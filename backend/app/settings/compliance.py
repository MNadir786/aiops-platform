from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ComplianceConfig(BaseModel):
    hipaa: bool
    gdpr: bool
    soc2: bool

compliance_settings = ComplianceConfig(hipaa=True, gdpr=True, soc2=False)

@router.get("/", response_model=ComplianceConfig)
def get_compliance():
    return compliance_settings

@router.put("/", response_model=ComplianceConfig)
def update_compliance(cfg: ComplianceConfig):
    global compliance_settings
    compliance_settings = cfg
    return compliance_settings
