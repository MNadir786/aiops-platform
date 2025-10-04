from fastapi import APIRouter
import psutil
import statistics
import time
from collections import deque

router = APIRouter()

# -------------------------------
# Config
# -------------------------------
WINDOW_SIZE = 20          # rolling window
ANOMALY_THRESHOLD = 2.0   # z-score threshold for anomalies

# -------------------------------
# Rolling history
# -------------------------------
cpu_history = deque(maxlen=WINDOW_SIZE)
mem_history = deque(maxlen=WINDOW_SIZE)

# -------------------------------
# Helper: anomaly detection
# -------------------------------
def detect_anomaly(series, threshold=ANOMALY_THRESHOLD):
    """Return tuple (is_anomaly, stats dict) for the latest value."""
    if len(series) < 5:  # need enough data points
        return False, None
    mean = statistics.mean(series)
    stdev = statistics.stdev(series)
    latest = series[-1]
    is_anomaly = abs(latest - mean) > threshold * stdev
    return is_anomaly, {
        "mean": round(mean, 2),
        "stdev": round(stdev, 2),
        "threshold": threshold,
    }

# -------------------------------
# Endpoint
# -------------------------------
@router.get("/anomalies")
def get_anomalies():
    # Grab latest system metrics
    cpu = psutil.cpu_percent(interval=0.2)
    mem = psutil.virtual_memory().percent

    # Update rolling history
    cpu_history.append(cpu)
    mem_history.append(mem)

    anomalies = []

    # CPU anomaly
    is_cpu_anom, cpu_stats = detect_anomaly(list(cpu_history))
    if is_cpu_anom:
        anomalies.append({
            "type": "cpu",
            "value": round(cpu, 2),
            "time": time.ctime(),
            "remediation": "restart_service",   # suggested action
            **cpu_stats
        })

    # Memory anomaly
    is_mem_anom, mem_stats = detect_anomaly(list(mem_history))
    if is_mem_anom:
        anomalies.append({
            "type": "memory",
            "value": round(mem, 2),
            "time": time.ctime(),
            "remediation": "scale_out",         # suggested action
            **mem_stats
        })

    return {
        "anomalies": anomalies,
        "window_size": WINDOW_SIZE,
        "cpu_latest": cpu,
        "mem_latest": mem,
        "timestamp": time.ctime()
    }
