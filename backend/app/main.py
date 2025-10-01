from fastapi import FastAPI
from app.routers import health, metrics

app = FastAPI()

# include routers
app.include_router(health.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
