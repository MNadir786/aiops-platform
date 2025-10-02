from fastapi import APIRouter
import psutil
import datetime
import os
import requests

# Env variable to switch metric mode
MODE = os.getenv("METRICS_MODE", "local")  # local | prometheus
PROM_URL = os.getenv("PROMETHEUS_URL", "http://prometheus:9090")  # default target

# Try to import Docker SDK (optional, only in local mode)
try:
    import docker
    docker_client = docker.from_env() if MODE == "local" else None
except Exception:
    docker_client = None

router = APIRouter()


def get_local_metrics():
    """System + container metrics using psutil + Docker"""
    metrics = {}

    if docker_client:
        try:
            containers = docker_client.containers.list()
            container_stats = []
            for c in containers:
                stats = c.stats(stream=False)

                # CPU calc
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

                # Memory calc
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

        except Exception as e:
            metrics["error"] = f"Docker metrics error: {e}"
            cpu = psutil.cpu_percent(interval=0.5)
            mem = psutil.virtual_memory()
            metrics["cpu_usage"] = round(cpu, 2)
            metrics["memory_usage"] = round(mem.percent, 2)

    else:
        # Fallback: host metrics only
        cpu = psutil.cpu_percent(interval=0.5)
        mem = psutil.virtual_memory()
        metrics["cpu_usage"] = round(cpu, 2)
        metrics["memory_usage"] = round(mem.percent, 2)

    return metrics


def get_prometheus_metrics():
    """Fetch CPU & Memory usage from Prometheus"""
    metrics = {}
    try:
        # CPU usage %
        cpu_query = "100 - (avg by(instance)(irate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)"
        resp = requests.get(f"{PROM_URL}/api/v1/query", params={"query": cpu_query}, timeout=5)
        if resp.ok:
            data = resp.json()["data"]["result"]
            if data:
                metrics["cpu_usage"] = round(float(data[0]["value"][1]), 2)

        # Memory usage %
        mem_query = "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"
        resp = requests.get(f"{PROM_URL}/api/v1/query", params={"query": mem_query}, timeout=5)
        if resp.ok:
            data = resp.json()["data"]["result"]
            if data:
                metrics["memory_usage"] = round(float(data[0]["value"][1]), 2)

    except Exception as e:
        metrics["error"] = f"Prometheus fetch failed: {e}"
        metrics["cpu_usage"] = 0
        metrics["memory_usage"] = 0

    return metrics


@router.get("/metrics")
def get_metrics():
    """
    Return system or container-level metrics.
    Modes:
      - local (default): psutil + Docker
      - prometheus: query Prometheus API
    """
    if MODE == "prometheus":
        metrics = get_prometheus_metrics()
    else:
        metrics = get_local_metrics()

    return {
        "metrics": metrics,
        "timestamp": datetime.datetime.now().isoformat(),
        "mode": MODE,
    }
