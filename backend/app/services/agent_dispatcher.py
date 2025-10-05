import asyncio
from typing import Dict, Any

# In-memory registry of connected agent WebSocket connections
AGENT_CONNECTIONS: Dict[str, Any] = {}

async def register_agent(agent_id: str, websocket):
    """Register a new agent connection."""
    AGENT_CONNECTIONS[agent_id] = websocket

async def unregister_agent(agent_id: str):
    """Remove an agent connection when it disconnects."""
    AGENT_CONNECTIONS.pop(agent_id, None)

async def send_command(agent_id: str, command: Dict[str, Any]) -> Dict[str, Any]:
    """Send a command to an agent and wait for response."""
    ws = AGENT_CONNECTIONS.get(agent_id)
    if not ws:
        return {"error": f"Agent {agent_id} not connected"}

    try:
        await ws.send_json(command)
        response = await ws.receive_json()
        return {"status": "ok", "response": response}
    except Exception as e:
        return {"error": str(e)}
