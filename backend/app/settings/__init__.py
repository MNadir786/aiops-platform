# backend/app/settings/__init__.py
from fastapi import APIRouter
from . import apikey, rbac, compliance, network, general  # ✅ match actual filenames

router = APIRouter()

router.include_router(apikey.router, prefix="/settings/api-keys", tags=["settings-api-keys"])
router.include_router(rbac.router, prefix="/settings/rbac", tags=["settings-rbac"])
router.include_router(compliance.router, prefix="/settings/compliance", tags=["settings-compliance"])
router.include_router(network.router, prefix="/settings/network", tags=["settings-network"])
router.include_router(general.router, prefix="/settings/general", tags=["settings-general"])
