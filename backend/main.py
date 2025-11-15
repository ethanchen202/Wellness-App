# server.py
import threading
from src.posture_engine import run_posture_monitor
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import uvicorn

app = FastAPI()
recording_flag = {"recording": False} 

# Allow Electron frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                self.disconnect(connection)

posture_manager = ConnectionManager()
blink_manager = ConnectionManager()

# Shared state
current_posture = "good"
current_blink = "not_blinking"

# ----------------- HTTP Endpoints -----------------
@app.post("/start")
async def start_recording():
    recording_flag["recording"] = True
    return {"status": "recording started"}

@app.post("/stop")
async def stop_recording(): 
    recording_flag["recording"] = False
    return {"status": "recording stopped"}

# ----------------- WebSocket Endpoints -----------------
@app.websocket("/ws/current_posture")
async def ws_posture(websocket: WebSocket):
    await posture_manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        posture_manager.disconnect(websocket)

@app.websocket("/ws/current_blink")
async def ws_blink(websocket: WebSocket):
    await blink_manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        blink_manager.disconnect(websocket)

def start_posture_thread():
    threading.Thread(target=run_posture_monitor, args=(recording_flag,), daemon=True).start()

# ----------------- Main -----------------
if __name__ == "__main__":
    start_posture_thread()
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
