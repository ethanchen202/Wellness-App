// services/sessionService.ts
export interface SessionStartRequest {
  posture: boolean;
  eyeStrain: boolean;
  distractions: boolean;
}

export interface SessionStartResponse {
  sessionId: string;
  startTime: string;
}

export interface SessionStopResponse {
  sessionId: string;
  endTime: string;
  duration: number;
}

export class SessionService {
  private static readonly API_BASE_URL = "http://localhost:8000";
  private static readonly WS_URL = "ws://localhost:8000";

  static async startSession(
    config: SessionStartRequest
  ): Promise<SessionStartResponse> {
    const response = await fetch(`${this.API_BASE_URL}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error("Failed to start session");
    }

    return response.json();
  }

  static async stopSession(): Promise<SessionStopResponse> {
    const response = await fetch(`${this.API_BASE_URL}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to stop session");
    }

    return response.json();
  }

  static connectWebSocket(
    onMessage: (message: any) => void,
    onError: (error: Event) => void,
    onClose: (event: CloseEvent) => void
  ): WebSocket {
    const ws = new WebSocket(`${this.WS_URL}/current_status`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessage(message);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = onError;
    ws.onclose = onClose;

    return ws;
  }
}
