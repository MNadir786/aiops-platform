from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class GeneralSettings(BaseModel):
    company_name: str
    theme: str
    notifications_enabled: bool

general_settings = GeneralSettings(
    company_name="X-Reach",
    theme="dark",
    notifications_enabled=True
)

@router.get("/", response_model=GeneralSettings)
def get_general():
    return general_settings

@router.put("/", response_model=GeneralSettings)
def update_general(cfg: GeneralSettings):
    global general_settings
    general_settings = cfg
    return general_settings
