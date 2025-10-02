from fastapi import FastAPI
from fastapi.responses import Response
from app.routers import health, metrics, logs, remediation, anomalies, assets  # <-- added assets
from prometheus_client import Gauge, generate_latest, CONTENT_TYPE_LATEST
import psutil

app = FastAPI(title="AIOps Backend")

# --- Register Routers ---
app.include_router(health.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(logs.router, prefix="/api")
app.include_router(remediation.router, prefix="/api")
app.include_router(anomalies.router, prefix="/api")
app.include_router(assets.router, prefix="/api")   # <-- NEW include

# --- Prometheus Gauges ---
cpu_usage_gauge = Gauge("system_cpu_usage_percent", "System CPU usage percentage")
mem_usage_gauge = Gauge("system_memory_usage_percent", "System memory usage percentage")

@app.get("/metrics")
def prometheus_metrics():
    """Expose system CPU and memory usage for Prometheus scrapes."""
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()

    cpu_usage_gauge.set(cpu)
    mem_usage_gauge.set(mem.percent)

    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
