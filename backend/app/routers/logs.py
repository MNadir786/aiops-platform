from fastapi import APIRouter
import datetime
import random

router = APIRouter()

# In-memory log buffer (in production this would be from ELK, Loki, etc.)
logs_store = [
    {"timestamp": datetime.datetime.now().isoformat(), "level": "INFO", "message": "System initialized."}
]

@router.get("/logs")
def get_logs(limit: int = 50):
    """
    Returns recent logs (simulated for now).
    """
    # Return latest logs (in reverse chronological order)
    return {"logs": list(reversed(logs_store[-limit:]))}


@router.post("/logs/generate")
def generate_log(level: str = "INFO", message: str = "Synthetic log entry"):
    """
    Generate a fake log entry (useful for demo/testing).
    """
    entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "level": level,
        "message": message
    }
    logs_store.append(entry)
    return {"status": "ok", "entry": entry}
