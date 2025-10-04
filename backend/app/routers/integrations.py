from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional, List
import uuid
import datetime

router = APIRouter()

# -------------------------------
# Models
# -------------------------------
class Integration(BaseModel):
    id: str
    provider: str
    region: Optional[str] = None
    credentials: str
    status: str
    created_at: str
    updated_at: Optional[str] = None

class IntegrationCreate(BaseModel):
    provider: str
    region: Optional[str] = None
    credentials: str

# -------------------------------
# In-memory store (replace with DB later)
# -------------------------------
INTEGRATIONS: Dict[str, Integration] = {}

# -------------------------------
# Helpers
# -------------------------------
def validate_credentials(provider: str, credentials: str) -> bool:
    """
    Pretend to validate provider credentials.
    Future: integrate with AWS boto3, Azure SDK, GCP SDK, K8s client, etc.
    """
    if not credentials or len(credentials) < 10:
        return False
    return True

def simulate_status(provider: str) -> str:
    """
    Placeholder: in reality, test connection with the SDK.
    """
    return "connected" if provider.lower() in ["aws", "azure", "gcp", "kubernetes"] else "pending"

# -------------------------------
# Routes
# -------------------------------
@router.get("/integrations")
def list_integrations() -> List[Integration]:
    """
    List all integrations.
    """
    return list(INTEGRATIONS.values())

@router.post("/integrations")
def add_integration(payload: IntegrationCreate):
    """
    Add a new integration.
    """
    if not validate_credentials(payload.provider, payload.credentials):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    integration_id = str(uuid.uuid4())
    now = datetime.datetime.utcnow().isoformat()

    integration = Integration(
        id=integration_id,
        provider=payload.provider,
        region=payload.region,
        credentials=payload.credentials,  # ⚠️ For production, encrypt before storing
        status=simulate_status(payload.provider),
        created_at=now,
    )

    INTEGRATIONS[integration_id] = integration
    return {"message": "Integration added", "integration": integration}

@router.delete("/integrations/{integration_id}")
def delete_integration(integration_id: str):
    """
    Delete an integration by ID.
    """
    if integration_id not in INTEGRATIONS:
        raise HTTPException(status_code=404, detail="Integration not found")

    del INTEGRATIONS[integration_id]
    return {"message": "Integration deleted", "id": integration_id}

@router.get("/integrations/{integration_id}")
def get_integration(integration_id: str):
    """
    Get details of a specific integration.
    """
    if integration_id not in INTEGRATIONS:
        raise HTTPException(status_code=404, detail="Integration not found")

    return INTEGRATIONS[integration_id]
