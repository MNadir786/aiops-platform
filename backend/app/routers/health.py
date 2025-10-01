from fastapi import APIRouter
import datetime

router = APIRouter()

@router.get("/health")
def get_health():
    return {
        "status": "ok",
        "timestamp": datetime.datetime.now().isoformat()
    }
