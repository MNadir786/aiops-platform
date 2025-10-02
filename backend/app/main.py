from fastapi import FastAPI
from app.routers import health, metrics, logs, alerts, remediation

app = FastAPI()

# include routers
app.include_router(health.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(logs.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(remediation.router, prefix="/api")
