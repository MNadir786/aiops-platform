from fastapi import APIRouter, HTTPException, Response, Query
from prometheus_client import Gauge, generate_latest, CONTENT_TYPE_LATEST
import psutil
import datetime
import docker
import threading
import time
import httpx

router = APIRouter()

# -------------------------------
# Docker client (optional)
# -------------------------------
try:
    docker_client = docker.from_env()
except Exception:
    docker_client = None

# -------------------------------
# Prometheus Gauges (local export)
# -------------------------------
cpu_usage_gauge = Gauge("aiops_cpu_usage_percent", "CPU usage percentage")
mem_usage_gauge = Gauge("aiops_memory_usage_percent", "Memory usage percentage")

# -------------------------------
# Global state
# -------------------------------
metrics_state = {"cpu": 0.0, "memory": 0.0}

# -------------------------------
# Docker metrics collection
# -------------------------------
def collect_docker_metrics():
    """Collect CPU & memory usage from running containers if Docker is available."""
    metrics = {}
    try:
        containers = docker_client.containers.list()
        container_stats = []

        for c in containers:
            stats = c.stats(stream=False)

            # CPU %
            cpu_delta = (
                stats["cpu_stats"]["cpu_usage"]["total_usage"]
                - stats["precpu_stats"]["cpu_usage"]["total_usage"]
            )
            system_delta = (
                stats["cpu_stats"]["system_cpu_usage"]
                - stats["precpu_stats"]["system_cpu_usage"]
            )
            cpu_percent = 0.0
            if system_delta > 0 and cpu_delta > 0:
                cpu_percent = (
                    cpu_delta / system_delta
                ) * len(stats["cpu_stats"]["cpu_usage"]["percpu_usage"]) * 100.0

            # Memory %
            mem_usage = stats["memory_stats"]["usage"]
            mem_limit = stats["memory_stats"].get("limit", 1)
            mem_percent = (mem_usage / mem_limit) * 100 if mem_limit > 0 else 0

            container_stats.append(
                {
                    "id": c.short_id,
                    "name": c.name,
                    "cpu_usage": round(cpu_percent, 2),
                    "memory_usage": round(mem_percent, 2),
                }
            )

        metrics["containers"] = container_stats
        metrics["cpu_usage"] = round(
            sum(c["cpu_usage"] for c in container_stats) / max(len(container_stats), 1), 2
        )
        metrics["memory_usage"] = round(
            sum(c["memory_usage"] for c in container_stats) / max(len(container_stats), 1), 2
        )

        return metrics

    except Exception:
        return None

# -------------------------------
# Background thread collector
# -------------------------------
def metrics_collector():
    """Continuously collect CPU & memory usage."""
    while True:
        try:
            # Prefer Docker metrics if available
            if docker_client:
                docker_metrics = collect_docker_metrics()
            else:
                docker_metrics = None

            if docker_metrics:
                metrics_state["cpu"] = docker_metrics["cpu_usage"]
                metrics_state["memory"] = docker_metrics["memory_usage"]
            else:
                # Fallback to host metrics
                cpu = psutil.cpu_percent(interval=1)
                mem = psutil.virtual_memory().percent
                metrics_state["cpu"] = cpu
                metrics_state["memory"] = mem

            # Update Prometheus gauges
            cpu_usage_gauge.set(metrics_state["cpu"])
            mem_usage_gauge.set(metrics_state["memory"])

        except Exception:
            pass

        time.sleep(1)

thread = threading.Thread(target=metrics_collector, daemon=True)
thread.start()

# -------------------------------
# Prometheus scrape endpoint
# -------------------------------
@router.get("/metrics")
def get_metrics_prometheus():
    """Expose metrics in Prometheus format."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

# -------------------------------
# JSON snapshot endpoint
# -------------------------------
@router.get("/metrics/json")
def get_metrics_json():
    """Expose metrics in JSON format for frontend/cockpit."""
    return {
        "metrics": {
            "cpu_usage": round(metrics_state["cpu"], 2),
            "memory_usage": round(metrics_state["memory"], 2),
        },
        "timestamp": datetime.datetime.now().isoformat(),
        "mode": "docker" if docker_client else "local",
    }

# -------------------------------
# Prometheus query proxy
# -------------------------------
PROMETHEUS_URL = "http://prometheus:9090/api/v1"

async def query_prometheus(query: str, range: bool = False, start: str = None, end: str = None, step: str = "30s"):
    url = f"{PROMETHEUS_URL}/query_range" if range else f"{PROMETHEUS_URL}/query"
    params = {"query": query}
    if range:
        params.update({"start": start, "end": end, "step": step})

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        if resp.status_code != 200:
            raise HTTPException(status_code=500, detail="Prometheus query failed")
        return resp.json()

@router.get("/metrics/prometheus/cpu")
async def get_cpu_prometheus(node: str = Query(None)):
    """Historical CPU usage from Prometheus."""
    q = '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'
    if node:
        q = f'100 - (avg by (instance) (irate(node_cpu_seconds_total{{mode="idle",instance="{node}"}}[5m])) * 100)'
    return await query_prometheus(q, range=True, start="now-15m", end="now", step="30s")

@router.get("/metrics/prometheus/memory")
async def get_memory_prometheus(node: str = Query(None)):
    """Historical Memory usage from Prometheus."""
    q = '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100'
    if node:
        q = f'(1 - (node_memory_MemAvailable_bytes{{instance="{node}"}} / node_memory_MemTotal_bytes{{instance="{node}"}})) * 100'
    return await query_prometheus(q, range=True, start="now-15m", end="now", step="30s")
