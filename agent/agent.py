# agent/agent.py
import asyncio
import json
import os
import socket
import websockets
import uuid
import yaml
import subprocess
import platform
import psutil
import time
from datetime import datetime

# -------------------------------
# Config
# -------------------------------
DEFAULT_CONFIG = {
    "agent_id": str(uuid.uuid4()),
    "backend_url": "ws://backend:8000/api/agent",
    "auth_token": "changeme-token"
}
CONFIG_PATH = os.getenv("AGENT_CONFIG", "/app/config.yaml")

def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            user_cfg = yaml.safe_load(f)
        return {**DEFAULT_CONFIG, **user_cfg}
    return DEFAULT_CONFIG

config = load_config()
AGENT_ID = config["agent_id"]
BACKEND_URL = f"{config['backend_url']}/{AGENT_ID}"
AUTH_TOKEN = config["auth_token"]

# -------------------------------
# Connectivity check
# -------------------------------
def connectivity_check():
    try:
        start = time.time()
        s = socket.create_connection(("backend", 8000), timeout=3)
        latency = (time.time() - start) * 1000
        s.close()
        return {"connectivity_ok": True, "latency_ms": round(latency, 2), "last_error": None}
    except Exception as e:
        return {"connectivity_ok": False, "latency_ms": None, "last_error": str(e)}

# -------------------------------
# System Info (Heartbeat)
# -------------------------------
def get_system_info():
    return {
        "cpu_usage": psutil.cpu_percent(interval=0.5),
        "memory_usage": psutil.virtual_memory().percent,
        "platform": platform.platform(),
        "hostname": socket.gethostname(),
        "timestamp": datetime.utcnow().isoformat(),
    }

# -------------------------------
# Command Handlers
# -------------------------------
async def handle_command(cmd: dict):
    action = cmd.get("action")
    params = cmd.get("params", {})

    if action == "ping":
        return {"status": "ok", "message": "pong"}
    elif action == "exec":
        try:
            output = subprocess.check_output(
                params.get("command", ""), shell=True, text=True, stderr=subprocess.STDOUT
            )
            return {"status": "ok", "output": output}
        except subprocess.CalledProcessError as e:
            return {"status": "error", "error": e.output}
    elif action == "stats":
        return get_system_info()
    elif action == "restart_service":
        service = params.get("service")
        return {"status": "ok", "service": service, "message": "restart simulated"}
    else:
        return {"status": "error", "message": f"Unknown action {action}"}

# -------------------------------
# Main Loop
# -------------------------------
async def agent_loop():
    async for ws in websockets.connect(
        BACKEND_URL,
        extra_headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
        ping_interval=20,
        ping_timeout=20,
    ):
        try:
            print(f"[Agent {AGENT_ID}] Connected to {BACKEND_URL}")

            # 🔹 Heartbeat loop
            async def heartbeat():
                while True:
                    payload = {
                        "job_id": None,
                        "agent_id": AGENT_ID,
                        "status": "online",
                        "metrics": get_system_info(),
                        "network": connectivity_check(),
                    }
                    await ws.send(json.dumps(payload))
                    await asyncio.sleep(10)

            asyncio.create_task(heartbeat())

            # 🔹 Command loop
            async for message in ws:
                cmd = json.loads(message)
                result = await handle_command(cmd)
                response = {
                    "job_id": cmd.get("job_id"),
                    "agent_id": AGENT_ID,
                    "result": result,
                    "timestamp": datetime.utcnow().isoformat(),
                }
                await ws.send(json.dumps(response))

        except Exception as e:
            print(f"[Agent {AGENT_ID}] Connection error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(agent_loop())
