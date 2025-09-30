from fastapi import FastAPI
from datetime import datetime
import random

app = FastAPI(title="AIOps Backend")

# 1. Health Check
@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# 2. Logs API
@app.get("/logs")
def get_logs():
    sample_logs = [
        {"timestamp": datetime.utcnow().isoformat(), "level": "INFO", "message": "System started successfully"},
        {"timestamp": datetime.utcnow().isoformat(), "level": "WARNING", "message": "High memory usage detected"},
        {"timestamp": datetime.utcnow().isoformat(), "level": "ERROR", "message": "Failed to connect to database"},
    ]
    return {"logs": sample_logs}

# 3. Metrics API
@app.get("/metrics")
def get_metrics():
    metrics = {
        "cpu_usage": f"{random.randint(10, 90)}%",
        "memory_usage": f"{random.randint(1000, 8000)}MB",
        "requests_per_minute": random.randint(50, 500),
        "errors_last_minute": random.randint(0, 5),
    }
    return {"metrics": metrics}
