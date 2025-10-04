from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class NetworkConfig(BaseModel):
    allow_private: bool
    allowed_cidrs: List[str]

network_settings = NetworkConfig(
    allow_private=True,
    allowed_cidrs=["10.0.0.0/24", "192.168.1.0/24"]
)

@router.get("/", response_model=NetworkConfig)
def get_network():
    return network_settings

@router.put("/", response_model=NetworkConfig)
def update_network(cfg: NetworkConfig):
    global network_settings
    network_settings = cfg
    return network_settings
