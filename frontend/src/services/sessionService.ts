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
  private static readonly API_BASE_URL = "http://localhost:8000/api";
  private static readonly WS_URL = "ws://localhost:8080";

  static async startSession(
    config: SessionStartRequest
  ): Promise<SessionStartResponse> {
    const response = await fetch(`${this.API_BASE_URL}/sessions/start`, {
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

  static async stopSession(sessionId: string): Promise<SessionStopResponse> {
    const response = await fetch(
      `${this.API_BASE_URL}/sessions/${sessionId}/stop`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to stop session");
    }

    return response.json();
  }

  static connectWebSocket(
    sessionId: string,
    onMessage: (message: any) => void,
    onError: (error: Event) => void,
    onClose: (event: CloseEvent) => void
  ): WebSocket {
    const ws = new WebSocket(`${this.WS_URL}?sessionId=${sessionId}`);

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
