from fastapi import APIRouter
import datetime

router = APIRouter()

# Available actions
available_actions = {
    "restart-backend": {"desc": "Restart Backend Service"},
    "rerun-pipeline": {"desc": "Rerun CI/CD Pipeline"},
    "scale-up": {"desc": "Scale Up Pods"},
}

# In-memory history
remediation_history = []


@router.get("/remediation/actions")
def list_actions():
    """
    List available remediation actions.
    """
    return {"actions": available_actions}


@router.get("/remediation/history")
def list_history():
    """
    List past remediation runs.
    """
    return {"history": remediation_history}


@router.post("/remediation/run/{action}")
def run_action(action: str):
    """
    Execute a remediation action (simulated).
    """
    if action not in available_actions:
        return {"status": "error", "message": f"Unknown action: {action}"}

    entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "action": action,
        "desc": available_actions[action]["desc"],
        "result": f"Action '{action}' executed successfully (simulated).",
    }
    remediation_history.append(entry)

    return {"status": "ok", "remediation": entry}
