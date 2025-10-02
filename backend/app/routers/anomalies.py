from fastapi import APIRouter
import psutil
import statistics
import time
from collections import deque

router = APIRouter()

# Keep last N values for simple anomaly detection
cpu_history = deque(maxlen=20)
mem_history = deque(maxlen=20)

def detect_anomaly(series, threshold=2.0):
    if len(series) < 5:
        return False
    mean = statistics.mean(series)
    stdev = statistics.stdev(series)
    latest = series[-1]
    return abs(latest - mean) > threshold * stdev

@router.get("/anomalies")
def get_anomalies():
    cpu = psutil.cpu_percent(interval=0.2)
    mem = psutil.virtual_memory().percent
    cpu_history.append(cpu)
    mem_history.append(mem)

    anomalies = []
    if detect_anomaly(list(cpu_history)):
        anomalies.append({"type": "cpu", "value": cpu, "time": time.ctime()})
    if detect_anomaly(list(mem_history)):
        anomalies.append({"type": "memory", "value": mem, "time": time.ctime()})

    return {"anomalies": anomalies}
