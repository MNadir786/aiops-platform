# backend/app/routers/remediation.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
import uuid, datetime

# Import adapters
from app.adapters import aws, azure, gcp
from app.adapters import medical  # ✅ new medical adapter

router = APIRouter()

# -------------------------------
# Models
# -------------------------------
class RemediationRequest(BaseModel):
    target: str            # e.g., "cicd", "infrastructure", "medical"
    action: str            # e.g., "restart_pipeline", "scale", "diagnose"
    params: Dict[str, Any] # flexible for each action

class RemediationResponse(BaseModel):
    id: str
    timestamp: str
    target: str
    action: str
    result: Dict[str, Any]

# -------------------------------
# In-memory Audit Log
# -------------------------------
AUDIT_LOGS: Dict[str, RemediationResponse] = {}

def log_action(resp: RemediationResponse):
    AUDIT_LOGS[resp.id] = resp

# -------------------------------
# Action Handlers
# -------------------------------
def handle_cicd(action: str, params: Dict[str, Any]) -> Dict[str, Any]:
    if action == "restart_pipeline":
        return {"pipeline_id": params.get("pipeline_id"), "status": "restarted"}
    elif action == "rollback":
        return {"pipeline_id": params.get("pipeline_id"), "status": "rolled back"}
    return {"error": f"Unknown CICD action {action}"}

def handle_infrastructure(action: str, params: Dict[str, Any]) -> Dict[str, Any]:
    if action == "scale":
        return {"resource_id": params.get("resource_id"), "new_size": params.get("size")}
    elif action == "restart_service":
        return {"service": params.get("service"), "status": "restarted"}
    return {"error": f"Unknown infra action {action}"}

def handle_medical(action: str, params: Dict[str, Any]) -> Dict[str, Any]:
    hospital_id = params.get("hospital_id")
    device_id = params.get("device_id")

    devices = medical.get_medical_devices(hospital_id)
    device = next((d for d in devices if d.id == device_id), None)
    if not device:
        return {"error": "Device not found"}

    if action == "diagnose":
        return {"device": device, "diagnostic": "Self-test completed, metrics stable"}
    elif action == "recommend_patch":
        return {"device": device, "recommendation": f"Upgrade firmware {device.firmware_version} → latest"}
    elif action == "alert_team":
        return {"device": device, "ticket_id": f"TKT-{uuid.uuid4()}"}
    elif action == "restart":
        if device.status == "operational":
            return {"warning": "Restart blocked: device in active use"}
        return {"device": device, "status": "Restart command issued"}
    return {"error": f"Unknown medical action {action}"}

# Registry of handlers
ACTION_HANDLERS = {
    "cicd": handle_cicd,
    "infrastructure": handle_infrastructure,
    "medical": handle_medical,
}

# -------------------------------
# API Endpoints
# -------------------------------
@router.post("/remediation")
def run_remediation(req: RemediationRequest):
    """
    Run remediation across domains (CICD, infra, medical, etc.)
    """
    handler = ACTION_HANDLERS.get(req.target)
    if not handler:
        return {"error": f"Unsupported remediation target {req.target}"}

    result = handler(req.action, req.params)

    resp = RemediationResponse(
        id=str(uuid.uuid4()),
        timestamp=datetime.datetime.utcnow().isoformat(),
        target=req.target,
        action=req.action,
        result=result,
    )
    log_action(resp)
    return resp

@router.get("/remediation/audit")
def get_audit_log(limit: int = 20):
    """
    Return recent remediation actions for auditing
    """
    logs = list(AUDIT_LOGS.values())
    return {"audit": logs[-limit:]}
