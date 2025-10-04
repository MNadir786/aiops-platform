from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Dict, Optional
import random, datetime, uuid

router = APIRouter()

# -------------------------------
# Models
# -------------------------------
class Resource(BaseModel):
    id: str
    name: str
    status: str
    type: str
    provider: str
    region: str
    discovered_at: str
    cost_per_hour: float
    risk_score: str
    tags: Dict[str, str] = {}

class Category(BaseModel):
    name: str
    resources: List[Resource]

class DiscoveryJob(BaseModel):
    id: str
    provider: str
    started_at: str
    finished_at: Optional[str]
    status: str
    categories: Dict[str, Category]

# -------------------------------
# In-memory stores (mock DBs)
# -------------------------------
DISCOVERY_JOBS: Dict[str, DiscoveryJob] = {}
LATEST_DISCOVERY: Dict[str, Category] = {}

# -------------------------------
# Helpers
# -------------------------------
def generate_mock_resources(category: str, provider: str = "AWS") -> List[Resource]:
    now = datetime.datetime.utcnow().isoformat()
    risk_levels = ["Low", "Medium", "High"]

    def cost():
        return round(random.uniform(0.01, 50.0), 2)  # $/hour

    resources = []

    if category == "Compute":
        resources = [
            Resource(
                id=str(uuid.uuid4()),
                name=f"{provider}-VM-{i}",
                status=random.choice(["running", "stopped", "error"]),
                type="VM",
                provider=provider,
                region=random.choice(["us-east-1", "us-west-2", "eu-central-1"]),
                discovered_at=now,
                cost_per_hour=cost(),
                risk_score=random.choice(risk_levels),
                tags={"env": random.choice(["prod", "dev", "staging"])}
            )
            for i in range(1, 6)
        ]

    elif category == "Database":
        resources = [
            Resource(
                id=str(uuid.uuid4()),
                name=f"{provider}-DB-{i}",
                status=random.choice(["available", "degraded", "error"]),
                type=random.choice(["Postgres", "MySQL", "MongoDB"]),
                provider=provider,
                region=random.choice(["us-east-1", "ap-south-1"]),
                discovered_at=now,
                cost_per_hour=cost(),
                risk_score=random.choice(risk_levels),
                tags={"owner": random.choice(["team-a", "team-b"])}
            )
            for i in range(1, 4)
        ]

    elif category == "Networking":
        resources = [
            Resource(
                id=str(uuid.uuid4()),
                name=f"{provider}-VPC-{i}",
                status="active",
                type="VPC",
                provider=provider,
                region="us-east-1",
                discovered_at=now,
                cost_per_hour=cost(),
                risk_score=random.choice(risk_levels),
                tags={"cidr": "10.0.0.0/16"}
            )
            for i in range(1, 2)
        ]

    elif category == "Storage":
        resources = [
            Resource(
                id=str(uuid.uuid4()),
                name=f"{provider}-S3-Bucket-{i}",
                status="active",
                type="ObjectStorage",
                provider=provider,
                region=random.choice(["us-east-1", "us-west-2"]),
                discovered_at=now,
                cost_per_hour=cost(),
                risk_score=random.choice(risk_levels),
                tags={"encrypted": random.choice(["true", "false"])}
            )
            for i in range(1, 3)
        ]

    return resources

# -------------------------------
# API Endpoints
# -------------------------------
@router.post("/discovery/trigger")
def trigger_discovery(provider: Optional[str] = None):
    """
    Simulate auto-discovery. If provider is given, run for that provider only.
    """
    providers = [provider] if provider else ["AWS", "Azure", "GCP", "On-Prem"]
    categories = ["Compute", "Database", "Networking", "Storage"]

    job_id = str(uuid.uuid4())
    started = datetime.datetime.utcnow().isoformat()

    job_categories: Dict[str, Category] = {
        c: Category(name=c, resources=generate_mock_resources(c, random.choice(providers)))
        for c in categories
    }

    job = DiscoveryJob(
        id=job_id,
        provider=provider or "multi-cloud",
        started_at=started,
        finished_at=datetime.datetime.utcnow().isoformat(),
        status="completed",
        categories=job_categories
    )

    # Store results
    DISCOVERY_JOBS[job_id] = job
    global LATEST_DISCOVERY
    LATEST_DISCOVERY = job_categories

    return {"message": "Discovery triggered", "job_id": job_id, "categories": job_categories}

@router.get("/discovery")
def get_latest_discovery():
    """
    Return last discovery snapshot.
    """
    if not LATEST_DISCOVERY:
        return {"categories": []}
    return {"categories": list(LATEST_DISCOVERY.values())}

@router.get("/discovery/jobs")
def list_discovery_jobs(limit: int = Query(10, le=50)):
    """
    List past discovery jobs.
    """
    jobs = list(DISCOVERY_JOBS.values())
    return {"jobs": jobs[-limit:]}  # last N jobs
