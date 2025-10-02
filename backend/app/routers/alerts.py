from fastapi import APIRouter
import datetime
import random

router = APIRouter()

# In-memory alert list
alerts_store = []

@router.get("/alerts")
def get_alerts():
    """
    Returns all active alerts.
    """
    return {"alerts": alerts_store}

@router.post("/alerts/generate")
def generate_alert():
    """
    Generate a demo alert for testing.
    """
    alert = {
        "id": len(alerts_store) + 1,
        "timestamp": datetime.datetime.now().isoformat(),
        "severity": random.choice(["low", "medium", "high"]),
        "message": random.choice([
            "High CPU detected on backend container",
            "Memory usage exceeded 85%",
            "Pod restart loop detected in EKS",
            "Unauthorized login attempt detected"
        ]),
        "status": "active"
    }
    alerts_store.append(alert)
    return {"status": "ok", "alert": alert}

@router.post("/alerts/ack/{alert_id}")
def acknowledge_alert(alert_id: int):
    """
    Mark alert as acknowledged.
    """
    for alert in alerts_store:
        if alert["id"] == alert_id:
            alert["status"] = "acknowledged"
            return {"status": "ok", "alert": alert}
    return {"status": "not_found"}
