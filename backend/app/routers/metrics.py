from fastapi import APIRouter, Response
from prometheus_client import Gauge, generate_latest, CONTENT_TYPE_LATEST
import psutil
import datetime
import docker
import threading
import time

router = APIRouter()

# Try to init Docker client (optional, for container stats)
try:
    docker_client = docker.from_env()
except Exception:
    docker_client = None

# Prometheus metrics
cpu_usage_gauge = Gauge("aiops_cpu_usage_percent", "CPU usage percentage")
mem_usage_gauge = Gauge("aiops_memory_usage_percent", "Memory usage percentage")

# Global state for smoother metrics
metrics_state = {"cpu": 0.0, "memory": 0.0}


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


def metrics_collector():
    """Background thread to continuously collect CPU & memory usage."""
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


# Start background thread
thread = threading.Thread(target=metrics_collector, daemon=True)
thread.start()


@router.get("/metrics")
def get_metrics_prometheus():
    """Expose metrics in Prometheus format."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


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
