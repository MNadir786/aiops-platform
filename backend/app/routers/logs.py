from fastapi import APIRouter, Query
import datetime

router = APIRouter()

# In-memory log buffer
logs_store = [
    {"timestamp": datetime.datetime.now().isoformat(), "level": "INFO", "message": "System initialized."}
]


@router.get("/logs")
def get_logs(limit: int = 50, container: str = Query(None, description="Optional container filter")):
    """
    Return recent logs, optionally filtered by container.
    """
    logs = list(reversed(logs_store[-limit:]))

    # In future, container filtering can be applied here
    if container:
        logs = [log for log in logs if container.lower() in log["message"].lower()]

    return {"logs": logs}


@router.post("/logs/generate")
def generate_log(level: str = "INFO", message: str = "Synthetic log entry"):
    """
    Generate a fake log entry (demo/testing).
    """
    entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "level": level.upper(),
        "message": message,
    }
    logs_store.append(entry)
    return {"status": "ok", "entry": entry}
