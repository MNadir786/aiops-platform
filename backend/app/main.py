from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response
from app.services.secret_service import get_secret_service
import time
import os
import logging

# Routers...
from app.settings import router as settings_router
from app.routers import alerts, anomalies, assets, health, logs, metrics, remediation, discovery

# Logging config
logger = logging.getLogger("aiops.main")
logger.setLevel(logging.INFO)

# -------------------------------
# Prometheus metrics
# -------------------------------
REQUEST_COUNT = Counter("app_requests_total", "Total HTTP requests", ["method", "endpoint", "status"])
REQUEST_LATENCY = Histogram("app_request_latency_seconds", "Request latency", ["endpoint"])

def track_metrics(func):
    async def wrapper(request, *args, **kwargs):
        start = time.time()
        response = await func(request, *args, **kwargs)
        latency = time.time() - start
        REQUEST_COUNT.labels(request.method, str(request.url.path), response.status_code).inc()
        REQUEST_LATENCY.labels(str(request.url.path)).observe(latency)
        return response
    return wrapper

# -------------------------------
# FastAPI App
# -------------------------------
app = FastAPI(
    title="X-Reach AIOps Control Plane",
    description="Unified Observability, Automated Remediation, and Multi-Cloud Discovery",
    version="1.0.0",
)

secret_service = get_secret_service()
logger.info("🔐 Secret Service initialized successfully.")

# -------------------------------
# Secure CORS
# -------------------------------
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3300").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Routers
app.include_router(settings_router, prefix="/api", tags=["settings"])
app.include_router(alerts.router, prefix="/api", tags=["alerts"])
app.include_router(anomalies.router, prefix="/api", tags=["anomalies"])
app.include_router(assets.router, prefix="/api", tags=["assets"])
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(logs.router, prefix="/api", tags=["logs"])
app.include_router(metrics.router, prefix="/api", tags=["metrics"])
app.include_router(remediation.router, prefix="/api", tags=["remediation"])
app.include_router(discovery.router, prefix="/api", tags=["discovery"])

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/")
def root():
    return {"message": "X-Reach AIOps Control Plane API is running securely 🚀"}
