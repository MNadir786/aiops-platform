# backend/app/routers/assets.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, List
import datetime, random

router = APIRouter()

# -------------------------------
# Data Models
# -------------------------------
class Device(BaseModel):
    id: int
    name: str
    status: str
    metrics: Optional[Dict] = {}

class Category(BaseModel):
    name: str
    items: List[Device] = []

# -------------------------------
# In-Memory Store
# -------------------------------
categories: Dict[str, Category] = {
    "servers": Category(
        name="servers",
        items=[
            Device(id=1, name="API Server", status="running"),
            Device(id=2, name="Database Server", status="running"),
        ],
    ),
    "atms": Category(
        name="atms",
        items=[
            Device(id=1, name="ATM #101", status="online", metrics={"cash_level": "75%"}),
            Device(id=2, name="ATM #102", status="error", metrics={"cash_level": "15%"}),
        ],
    ),
    "pos": Category(
        name="pos",
        items=[
            Device(id=1, name="POS Terminal #1", status="healthy"),
            Device(id=2, name="POS Terminal #2", status="overloaded"),
        ],
    ),
    "generators": Category(
        name="generators",
        items=[
            Device(id=1, name="Generator A", status="running", metrics={"fuel": "60%"}),
            Device(id=2, name="Generator B", status="offline", metrics={"fuel": "0%"}),
        ],
    ),
}

# -------------------------------
# Endpoints
# -------------------------------

@router.get("/assets")
def list_assets():
    """List all categories and devices (skip empty categories)."""
    non_empty = [cat for cat in categories.values() if cat.items]
    return {"categories": non_empty}

@router.post("/assets/category/{category_name}")
def add_category(category_name: str):
    """Add a new category."""
    if category_name in categories:
        return {"error": "Category already exists"}
    categories[category_name] = Category(name=category_name, items=[])
    return {"status": "category_added", "category": category_name}

@router.post("/assets/item/{category_name}")
def add_device(category_name: str, device: Device):
    """Add a device into a category."""
    if category_name not in categories:
        categories[category_name] = Category(name=category_name, items=[])
    categories[category_name].items.append(device)
    return {"status": "device_added", "device": device}

@router.delete("/assets/item/{category_name}/{device_id}")
def remove_device(category_name: str, device_id: int):
    """Remove a device from a category. Auto-delete category if empty."""
    if category_name not in categories:
        return {"error": "Category not found"}

    items = categories[category_name].items
    for i, dev in enumerate(items):
        if dev.id == device_id:
            removed = items.pop(i)
            # ✅ delete category if now empty
            if not items:
                del categories[category_name]
                return {
                    "status": "device_removed",
                    "device": removed,
                    "category_deleted": category_name,
                }
            return {"status": "device_removed", "device": removed}
    return {"error": "Device not found"}

@router.post("/assets/item/{category_name}/{device_id}/status")
def update_device_status(category_name: str, device_id: int, status: str):
    """Update device status dynamically."""
    if category_name not in categories:
        return {"error": "Category not found"}
    for dev in categories[category_name].items:
        if dev.id == device_id:
            dev.status = status
            dev.metrics["last_update"] = datetime.datetime.now().isoformat()
            return {"status": "updated", "device": dev}
    return {"error": "Device not found"}

# -------------------------------
# New Endpoints: Metrics + Logs
# -------------------------------

@router.get("/assets/{category_name}/{device_id}/metrics")
def get_device_metrics(category_name: str, device_id: int):
    """Return simulated metrics for a device."""
    if category_name not in categories:
        return {"error": "Category not found"}

    device = next((d for d in categories[category_name].items if d.id == device_id), None)
    if not device:
        return {"error": "Device not found"}

    metrics = {}
    now = datetime.datetime.now().isoformat()

    if "server" in category_name:
        metrics = {
            "cpu": f"{random.randint(10, 90)}%",
            "memory": f"{round(random.uniform(1.0, 16.0), 2)} GB",
            "uptime": f"{random.randint(1, 72)}h",
            "timestamp": now
        }
    elif "atm" in category_name:
        metrics = {
            "cash_level": f"{random.randint(0, 100)}%",
            "transaction_rate": f"{random.randint(50, 200)} tx/min",
            "timestamp": now
        }
    elif "pos" in category_name:
        metrics = {
            "latency": f"{round(random.uniform(0.1, 2.0), 2)}s",
            "error_rate": f"{random.randint(0, 5)}%",
            "timestamp": now
        }
    elif "generator" in category_name:
        metrics = {
            "fuel": f"{random.randint(0, 100)}%",
            "runtime": f"{random.randint(0, 500)}h",
            "temperature": f"{random.randint(60, 95)}°C",
            "timestamp": now
        }

    device.metrics.update(metrics)
    return {"device": device, "metrics": metrics}

@router.get("/assets/{category_name}/{device_id}/logs")
def get_device_logs(category_name: str, device_id: int):
    """Return simulated logs for a device."""
    if category_name not in categories:
        return {"error": "Category not found"}

    device = next((d for d in categories[category_name].items if d.id == device_id), None)
    if not device:
        return {"error": "Device not found"}

    now = datetime.datetime.now()
    logs = []
    for i in range(10):
        ts = (now - datetime.timedelta(minutes=i)).isoformat()
        msg = ""
        if "server" in category_name:
            msg = random.choice(["Service started", "Health check OK", "High CPU load", "Database connection error"])
        elif "atm" in category_name:
            msg = random.choice(["Cash dispensed", "Low cash warning", "Card read error", "ATM rebooted"])
        elif "pos" in category_name:
            msg = random.choice(["Transaction approved", "Payment declined", "POS reboot", "Network timeout"])
        elif "generator" in category_name:
            msg = random.choice(["Generator started", "Fuel low", "Maintenance required", "Overheat warning"])
        logs.append({"timestamp": ts, "message": msg})

    return {"device": device, "logs": logs}
