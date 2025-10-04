from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
import uuid

router = APIRouter()

class APIKey(BaseModel):
    id: str
    name: str
    provider: str
    key: str

API_KEYS: Dict[str, APIKey] = {}

@router.get("/", response_model=List[Dict])
def list_keys():
    """Return all API keys (masked)."""
    return [
        {
            "id": k,
            "name": v.name,
            "provider": v.provider,
            "key_hint": v.key[:4] + "****" + v.key[-4:],
        }
        for k, v in API_KEYS.items()
    ]

@router.post("/", response_model=Dict)
def add_key(key: Dict):
    key_id = str(uuid.uuid4())
    api_key = APIKey(
        id=key_id,
        name=key["name"],
        provider=key["provider"],
        key=key["key"],
    )
    API_KEYS[key_id] = api_key
    return {"message": "API Key added", "id": key_id}

@router.delete("/{key_id}", response_model=Dict)
def delete_key(key_id: str):
    if key_id not in API_KEYS:
        raise HTTPException(status_code=404, detail="Key not found")
    del API_KEYS[key_id]
    return {"message": f"Key {key_id} deleted"}
