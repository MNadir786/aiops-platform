from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Modular settings router (new structure)
from app.settings import router as settings_router  

# Routers
from app.routers import (
    alerts,
    anomalies,
    assets,
    health,
    logs,
    metrics,
    remediation,
    discovery
)

app = FastAPI(
    title="X-Reach AIOps Control Plane",
    description="Unified Observability, Automated Remediation, and Multi-Cloud Discovery",
    version="1.0.0",
)

# CORS Middleware (allow frontend dev server & others)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔐 TODO: tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(settings_router, prefix="/api", tags=["settings"])  # ✅ Only once
app.include_router(alerts.router, prefix="/api", tags=["alerts"])
app.include_router(anomalies.router, prefix="/api", tags=["anomalies"])
app.include_router(assets.router, prefix="/api", tags=["assets"])
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(logs.router, prefix="/api", tags=["logs"])
app.include_router(metrics.router, prefix="/api", tags=["metrics"])
app.include_router(remediation.router, prefix="/api", tags=["remediation"])
app.include_router(discovery.router, prefix="/api", tags=["discovery"])

@app.get("/")
def root():
    return {"message": "X-Reach AIOps Control Plane API is running 🚀"}
