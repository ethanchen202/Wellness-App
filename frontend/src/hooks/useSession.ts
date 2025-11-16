// hooks/useSession.ts
import { useState, useCallback, useRef } from "react";
import { SessionConfig, SessionState } from "@/types/session.types";
import { SessionService } from "@/services/sessionService";

export const useSession = () => {
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
  });
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    posture: true,
    eyeStrain: false,
    distractions: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const startSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Start session on backend
      const response = await SessionService.startSession(sessionConfig);
      sessionIdRef.current = response.sessionId;

      // Connect to WebSocket
      // TODO: Handle WebSocket messages with various event types
      // wsRef.current = SessionService.connectWebSocket(
      //   response.sessionId,
      //   (message) => {
      //     // Handle incoming messages based on type:
      //     // - 'posture': Update posture data
      //     // - 'eye_strain': Update eye strain data
      //     // - 'distraction': Update distraction data
      //     // - 'error': Handle errors
      //     console.log("WebSocket message:", message);
      //   },
      //   (error) => {
      //     console.error("WebSocket error:", error);
      //     setError("WebSocket connection error");
      //   },
      //   (event) => {
      //     console.log("WebSocket closed:", event);
      //   }
      // );

      setSessionState({
        isActive: true,
        startTime: new Date(),
        config: sessionConfig,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session");
      console.error("Start session error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionConfig]);

  const stopSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!sessionIdRef.current) {
        throw new Error("No active session");
      }

      // Stop session on backend
      await SessionService.stopSession();

      // Disconnect WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      setSessionState({
        isActive: false,
      });
      sessionIdRef.current = null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop session");
      console.error("Stop session error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfigChange = (newConfig: SessionConfig) => {
    if (!sessionState.isActive) {
      setSessionConfig(newConfig);
    }
  };

  const toggleSession = useCallback(async () => {
    if (sessionState.isActive) {
      await stopSession();
    } else {
      await startSession();
    }
  }, [sessionState.isActive, startSession, stopSession]);

  return {
    sessionState,
    sessionConfig,
    isLoading,
    error,
    toggleSession,
    handleConfigChange,
  };
};
