import threading
import asyncio

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from src.monitor import run_combined_monitor, main_backend

app = FastAPI()

# shared flag to control recording start/stop
recording_flag = {"recording": False}

# Allow Electron frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- WebSocket Manager -----------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Called from run_combined_monitor in a background thread
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                self.disconnect(connection)

posture_manager = ConnectionManager()
blink_manager = ConnectionManager()

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
@app.websocket("/current_posture")
async def ws_posture(websocket: WebSocket):
    await posture_manager.connect(websocket)
    try:
        # Just keep the connection open; the background task will push messages.
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        posture_manager.disconnect(websocket)

@app.websocket("/current_blink")
async def ws_blink(websocket: WebSocket):
    await blink_manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        blink_manager.disconnect(websocket)

# ----------------- Background posture/blink thread -----------------
def start_posture_thread():
    def run():
        # This runs your new combined monitor forever in its own event loop
        asyncio.run(
            main_backend(recording_flag, posture_manager, blink_manager)
            # run_combined_monitor(recording_flag, posture_manager, blink_manager)
        )

    threading.Thread(target=run, daemon=True).start()

@app.on_event("startup")
async def startup_event():
    start_posture_thread()

# ----------------- Main -----------------
if __name__ == "__main__":
    # If this file is named main.py, keep "main:app"
    # If you rename the file to server.py, change this to "server:app"
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

