from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
import uuid

router = APIRouter()

class Role(BaseModel):
    id: str
    user: str
    role: str

RBAC: Dict[str, Role] = {}

@router.get("/", response_model=List[Role])
def list_roles():
    return list(RBAC.values())

@router.post("/", response_model=Dict)
def add_role(role: Dict):
    role_id = str(uuid.uuid4())
    new_role = Role(id=role_id, user=role["user"], role=role["role"])
    RBAC[role_id] = new_role
    return {"message": "Role added", "id": role_id}

@router.delete("/{role_id}", response_model=Dict)
def delete_role(role_id: str):
    if role_id not in RBAC:
        raise HTTPException(status_code=404, detail="Role not found")
    del RBAC[role_id]
    return {"message": f"Role {role_id} removed"}
