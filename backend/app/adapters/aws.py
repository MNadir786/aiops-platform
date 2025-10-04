# backend/app/adapters/aws.py
# Placeholder AWS adapter for discovery
import random
import datetime

def discover_resources():
    now = datetime.datetime.utcnow().isoformat()
    return [
        {
            "id": f"ec2-{i}",
            "name": f"EC2-Instance-{i}",
            "status": random.choice(["running", "stopped", "error"]),
            "type": "VM",
            "provider": "AWS",
            "region": random.choice(["us-east-1", "us-west-2", "eu-central-1"]),
            "discovered_at": now,
        }
        for i in range(1, 4)
    ]
