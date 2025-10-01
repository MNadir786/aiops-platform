from fastapi import APIRouter
import psutil

router = APIRouter()

@router.get("/metrics")
def get_metrics():
    # CPU usage in %
    cpu = psutil.cpu_percent(interval=0.5)

    # Memory usage in %
    mem = psutil.virtual_memory()

    return {
        "metrics": {
            "cpu_usage": round(cpu, 2),
            "memory_usage": round(mem.percent, 2)  # ✅ always percent
        }
    }
