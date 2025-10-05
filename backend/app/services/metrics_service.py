import os
import psutil
import docker
import requests
import datetime
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------------------------
MODE = os.getenv("METRICS_MODE", "local").lower()  # local | prometheus
PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://prometheus:9090")
PROMETHEUS_TIMEOUT = float(os.getenv("PROMETHEUS_TIMEOUT", 5))

# Lazy Docker client for local fallback
docker_client = None
if MODE == "local":
    try:
        docker_client = docker.from_env()
        logger.info("✅ Docker client initialized for local metrics mode.")
    except Exception as e:
        logger.warning(f"⚠️ Docker unavailable, local container metrics will be empty: {e}")


# -----------------------------------------------------------------------------
# GENERIC HELPERS
# -----------------------------------------------------------------------------
def safe_request(url: str, params: Dict[str, str]) -> Any:
    """Perform a safe Prometheus API call."""
    try:
        resp = requests.get(url, params=params, timeout=PROMETHEUS_TIMEOUT)
        resp.raise_for_status()
        return resp.json().get("data", {}).get("result", [])
    except Exception as e:
        logger.warning(f"⚠️ Prometheus query failed: {params.get('query', '')} ({e})")
        return []


def extract_value(results: List[Dict[str, Any]], fallback: float = 0.0) -> float:
    """Extract numeric value from Prometheus result safely."""
    try:
        if results and "value" in results[0]:
            return round(float(results[0]["value"][1]), 2)
    except Exception as e:
        logger.debug(f"⚠️ Failed to extract Prometheus value: {e}")
    return fallback


# -----------------------------------------------------------------------------
# LOCAL MODE METRICS
# -----------------------------------------------------------------------------
def get_local_metrics() -> Dict[str, Any]:
    """Collect system + container metrics using psutil and Docker SDK."""
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()

    containers_info = []
    if docker_client:
        try:
            for c in docker_client.containers.list():
                stats = c.stats(stream=False)
                cpu_percent, mem_percent = 0.0, 0.0

                try:
                    cpu_stats = stats["cpu_stats"]
                    precpu_stats = stats["precpu_stats"]
                    cpu_delta = float(cpu_stats["cpu_usage"]["total_usage"]) - float(
                        precpu_stats["cpu_usage"]["total_usage"]
                    )
                    system_delta = float(cpu_stats["system_cpu_usage"]) - float(
                        precpu_stats["system_cpu_usage"]
                    )
                    if system_delta > 0.0:
                        cpu_percent = (
                            cpu_delta
                            / system_delta
                            * len(cpu_stats["cpu_usage"]["percpu_usage"])
                            * 100.0
                        )

                    mem_usage = stats["memory_stats"].get("usage", 0)
                    mem_limit = stats["memory_stats"].get("limit", 1)
                    mem_percent = (mem_usage / mem_limit) * 100.0 if mem_limit > 0 else 0.0

                except Exception as e:
                    logger.debug(f"Error parsing stats for {c.name}: {e}")

                containers_info.append(
                    {
                        "id": c.short_id,
                        "name": c.name,
                        "cpu_usage": round(cpu_percent, 2),
                        "memory_usage": round(mem_percent, 2),
                    }
                )

        except Exception as e:
            logger.warning(f"⚠️ Error fetching Docker stats: {e}")

    return {
        "mode": "local",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "metrics": {
            "cpu_usage": round(cpu, 2),
            "memory_usage": round(mem.percent, 2),
        },
        "containers": containers_info,
    }


# -----------------------------------------------------------------------------
# PROMETHEUS MODE METRICS
# -----------------------------------------------------------------------------
def get_prometheus_metrics() -> Dict[str, Any]:
    """Collect normalized metrics from Prometheus."""
    result = {
        "mode": "prometheus",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "metrics": {},
        "containers": [],
    }

    base = f"{PROMETHEUS_URL}/api/v1/query"

    # Queries — use lightweight node_exporter or cAdvisor metrics
    queries = {
        "cpu_usage": "100 - (avg by(instance)(irate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)",
        "memory_usage": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
        "disk_io": "rate(node_disk_bytes_read_total[5m]) + rate(node_disk_bytes_written_total[5m])",
        "pod_restarts": "increase(kube_pod_container_status_restarts_total[30m])",
    }

    for key, query in queries.items():
        data = safe_request(base, {"query": query})
        result["metrics"][key] = extract_value(data)

    return result


# -----------------------------------------------------------------------------
# ENTRYPOINT (INTELLIGENT FALLBACK)
# -----------------------------------------------------------------------------
def get_metrics() -> Dict[str, Any]:
    """
    Smart metrics entrypoint:
    - Try Prometheus if MODE=prometheus
    - Auto-fallback to local metrics if Prometheus unreachable
    """
    if MODE == "prometheus":
        metrics = get_prometheus_metrics()
        if not metrics["metrics"] or all(v == 0 for v in metrics["metrics"].values()):
            logger.warning("⚠️ Prometheus unreachable, switching to local metrics fallback.")
            return get_local_metrics()
        return metrics
    return get_local_metrics()
