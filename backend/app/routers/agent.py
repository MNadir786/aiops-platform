# backend/app/routers/agent.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from typing import Dict, Any
import uuid
import datetime
import asyncio
import json

router = APIRouter()

# -------------------------------
# Connected Agents State
# -------------------------------
connected_agents: Dict[str, WebSocket] = {}
agent_status: Dict[str, Dict[str, Any]] = {}
pending_jobs: Dict[str, asyncio.Future] = {}  # job_id → future

# -------------------------------
# Agent WebSocket Endpoint
# -------------------------------
@router.websocket("/agent/{agent_id}")
async def agent_ws(ws: WebSocket, agent_id: str, token: str = None):
    # TODO: validate token with DB/Secret Manager
    await ws.accept()
    connected_agents[agent_id] = ws
    agent_status[agent_id] = {
        "last_seen": datetime.datetime.utcnow().isoformat(),
        "status": "online",
        "network": {"connectivity_ok": True, "latency_ms": None, "last_error": None}
    }

    try:
        while True:
            msg = await ws.receive_text()
            data = json.loads(msg)

            # 🔹 Heartbeat / connectivity update
            if data.get("status") == "online":
                agent_status[agent_id].update({
                    "last_seen": datetime.datetime.utcnow().isoformat(),
                    "network": data.get("network", agent_status[agent_id]["network"]),
                    "metrics": data.get("metrics", {}),
                })
                continue

            # 🔹 Job results
            job_id = data.get("job_id")
            if job_id and job_id in pending_jobs:
                future = pending_jobs.pop(job_id)
                if not future.done():
                    future.set_result(data)

    except WebSocketDisconnect:
        connected_agents.pop(agent_id, None)
        if agent_id in agent_status:
            agent_status[agent_id]["status"] = "offline"

# -------------------------------
# Dispatch Command to Agent
# -------------------------------
async def send_command(agent_id: str, action: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
    if agent_id not in connected_agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not connected")

    ws = connected_agents[agent_id]
    job_id = str(uuid.uuid4())
    payload = {"job_id": job_id, "action": action, "params": params or {}}

    future: asyncio.Future = asyncio.get_event_loop().create_future()
    pending_jobs[job_id] = future

    await ws.send_json(payload)

    try:
        result = await asyncio.wait_for(future, timeout=10)
        return {
            "job_id": job_id,
            "agent_id": agent_id,
            "action": action,
            "params": params,
            "result": result,
            "timestamp": datetime.datetime.utcnow().isoformat(),
        }
    except asyncio.TimeoutError:
        pending_jobs.pop(job_id, None)
        raise HTTPException(status_code=504, detail="Agent did not respond in time")

# -------------------------------
# HTTP API: list agents
# -------------------------------
@router.get("/agent")
def list_agents():
    return {"agents": agent_status}
