# server.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random

app = FastAPI()

# Allow Electron frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Can restrict to your app URL
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
recording = False

# ----------------- HTTP Endpoints -----------------
@app.post("/start")
async def start_recording():
    global recording
    recording = True
    return {"status": "recording started"}

@app.post("/stop")
async def stop_recording():
    global recording
    recording = False
    return {"status": "recording stopped"}

# ----------------- WebSocket Endpoints -----------------
@app.websocket("/ws/current_posture")
async def ws_posture(websocket: WebSocket):
    await posture_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
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

# ----------------- Background Task -----------------
async def analysis_loop():
    global current_posture, current_blink
    while True:
        if recording:
            # Replace these with real video analysis
            current_posture = random.choice(["good", "bad"])
            current_blink = random.choice(["blinking", "not_blinking"])
            await posture_manager.broadcast({"posture": current_posture})
            await blink_manager.broadcast({"blink": current_blink})
        await asyncio.sleep(2)  # Adjust for analysis frame rate

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(analysis_loop())
