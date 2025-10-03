# backend/app/routers/discovery.py
from fastapi import APIRouter
from typing import List, Dict
import random
import datetime

router = APIRouter()

# Dummy providers & services
CLOUD_SERVICES = {
    "aws": ["EC2 Instance", "S3 Bucket", "RDS Database"],
    "azure": ["VM", "Blob Storage", "Cosmos DB"],
    "gcp": ["Compute Engine", "Cloud Storage", "BigQuery"],
    "medical": ["MRI Scanner", "X-Ray Machine", "Patient Monitor"],
    "pos": ["POS Terminal", "Payment Gateway"],
    "atm": ["ATM Machine", "Cash Dispenser"],
    "generator": ["Diesel Generator", "Backup Generator"]
}

def random_metrics(service: str) -> Dict:
    if "EC2" in service or "VM" in service or "Compute" in service:
        return {"cpu_usage": random.randint(1, 90), "memory_usage": random.randint(1, 90)}
    if "ATM" in service:
        return {"cash_level": random.randint(0, 100), "errors": random.randint(0, 5)}
    if "POS" in service:
        return {"transactions": random.randint(50, 500), "errors": random.randint(0, 3)}
    if "Generator" in service:
        return {"fuel_level": random.randint(0, 100), "temperature": random.randint(40, 95)}
    if "MRI" in service or "X-Ray" in service or "Monitor" in service:
        return {"uptime": f"{random.randint(95,100)}%", "patients_today": random.randint(5, 50)}
    return {"status": "healthy"}

@router.get("/discovery")
def discover_assets() -> Dict[str, List[Dict]]:
    result = []
    for provider, services in CLOUD_SERVICES.items():
        for service in services:
            result.append({
                "id": f"{provider}-{service.replace(' ', '').lower()}-{random.randint(100,999)}",
                "provider": provider,
                "name": service,
                "status": random.choice(["running", "degraded", "error"]),
                "cost_estimate": f"${random.randint(100,1000)}/mo",
                "last_seen": datetime.datetime.now().isoformat(),
                "metrics": random_metrics(service),
            })
    return {"assets": result}
