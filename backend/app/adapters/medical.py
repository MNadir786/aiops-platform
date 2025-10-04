# backend/app/adapters/medical.py

import random, datetime, uuid
from typing import List, Dict
from pydantic import BaseModel

# -------------------------------
# Models
# -------------------------------
class MedicalDevice(BaseModel):
    id: str
    hospital_id: str
    department: str
    device_type: str
    vendor: str
    model: str
    firmware_version: str
    status: str
    last_maintenance: str
    metrics: Dict[str, float]
    discovered_at: str

# -------------------------------
# Mock registry (would be DB in real life)
# -------------------------------
MOCK_DEVICES: List[MedicalDevice] = []

# -------------------------------
# Helpers
# -------------------------------
def discover_medical_devices(hospital_id: str, department: str) -> List[MedicalDevice]:
    """
    Simulate discovery of medical devices for a hospital/department.
    Later this should use IEEE 11073, HL7 FHIR APIs, or vendor SDKs.
    """
    now = datetime.datetime.utcnow().isoformat()

    device_types = [
        ("Ventilator", {"airflow": (20, 100), "pressure": (5, 50)}),
        ("ECG Monitor", {"heart_rate": (50, 120), "spo2": (90, 100)}),
        ("Infusion Pump", {"flow_rate": (1, 10), "volume_remaining": (0, 500)}),
        ("MRI Scanner", {"coil_temp": (20, 40), "power_draw": (1000, 2000)}),
    ]

    devices: List[MedicalDevice] = []
    for device_type, metrics_spec in device_types:
        device = MedicalDevice(
            id=str(uuid.uuid4()),
            hospital_id=hospital_id,
            department=department,
            device_type=device_type,
            vendor=random.choice(["GE Healthcare", "Philips", "Siemens", "Mindray"]),
            model=f"{device_type}-{random.randint(100,999)}",
            firmware_version=f"v{random.randint(1,3)}.{random.randint(0,9)}",
            status=random.choice(["operational", "maintenance_required", "error"]),
            last_maintenance=(datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(5,90))).isoformat(),
            metrics={
                k: round(random.uniform(low, high), 2) 
                for k, (low, high) in metrics_spec.items()
            },
            discovered_at=now,
        )
        devices.append(device)

    MOCK_DEVICES.extend(devices)
    return devices

def get_medical_devices(hospital_id: str) -> List[MedicalDevice]:
    """Return all medical devices for a hospital"""
    return [d for d in MOCK_DEVICES if d.hospital_id == hospital_id]

