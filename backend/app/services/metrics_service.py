# backend/app/services/metrics_service.py
import os
import psutil
import docker
import requests
import datetime

# Choose mode from ENV, default = local
MODE = os.getenv("METRICS_MODE", "local")  # local | prometheus

# Docker client for local mode
docker_client = None
if MODE == "local":
    try:
        docker_client = docker.from_env()
    except Exception as e:
        print("⚠️ Docker not available:", e)


def get_local_metrics():
    """Collect system + container metrics via psutil + Docker SDK"""
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()

    containers_info = []
    if docker_client:
        try:
            containers = docker_client.containers.list()
            for c in containers:
                stats = c.stats(stream=False)
                cpu_percent = 0.0
                mem_percent = 0.0

                try:
                    # CPU %
                    cpu_stats = stats["cpu_stats"]
                    precpu_stats = stats["precpu_stats"]

                    cpu_delta = float(cpu_stats["cpu_usage"]["total_usage"]) - float(
                        precpu_stats["cpu_usage"]["total_usage"]
                    )
                    system_delta = float(cpu_stats["system_cpu_usage"]) - float(
                        precpu_stats["system_cpu_usage"]
                    )

                    if system_delta > 0.0:
                        cpu_percent = (cpu_delta / system_delta) * len(
                            cpu_stats["cpu_usage"]["percpu_usage"]
                        ) * 100.0

                    # Memory %
                    mem_usage = stats["memory_stats"].get("usage", 0)
                    mem_limit = stats["memory_stats"].get("limit", 1)
                    mem_percent = (mem_usage / mem_limit) * 100.0 if mem_limit > 0 else 0.0

                except Exception as e:
                    print(f"⚠️ Error parsing stats for {c.name}: {e}")

                containers_info.append(
                    {
                        "id": c.short_id,
                        "name": c.name,
                        "cpu_usage": round(cpu_percent, 2),
                        "memory_usage": round(mem_percent, 2),
                    }
                )
        except Exception as e:
            print(f"⚠️ Error fetching container stats: {e}")

    return {
        "metrics": {
            "cpu_usage": round(cpu, 2),
            "memory_usage": round(mem.percent, 2),
            "timestamp": datetime.datetime.now().isoformat(),
        },
        "containers": containers_info,
    }


def get_prometheus_metrics():
    """Fetch metrics from Prometheus API"""
    prometheus_url = os.getenv("PROMETHEUS_URL", "http://prometheus:9090")
    result = {
        "metrics": {"cpu_usage": 0, "memory_usage": 0, "timestamp": datetime.datetime.now().isoformat()},
        "containers": [],
    }

    try:
        # Example: query CPU usage rate across nodes
        cpu_query = f"{prometheus_url}/api/v1/query"
        cpu_resp = requests.get(cpu_query, params={"query": "100 - (avg by(instance)(irate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)"})
        if cpu_resp.ok:
            data = cpu_resp.json()["data"]["result"]
            if data:
                result["metrics"]["cpu_usage"] = round(float(data[0]["value"][1]), 2)

        # Example: memory usage %
        mem_resp = requests.get(cpu_query, params={"query": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"})
        if mem_resp.ok:
            data = mem_resp.json()["data"]["result"]
            if data:
                result["metrics"]["memory_usage"] = round(float(data[0]["value"][1]), 2)

    except Exception as e:
        print(f"⚠️ Prometheus fetch failed: {e}")

    return result


def get_metrics():
    """Main entrypoint: pick mode"""
    if MODE == "prometheus":
        return get_prometheus_metrics()
    return get_local_metrics()
