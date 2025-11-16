// hooks/useSession.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { SessionConfig, SessionState } from "@/types/session.types";
import { WebSocketEvent } from "@/types/websocket.types";
import { SessionService } from "@/services/sessionService";
import { useNotification } from "./useNotification";
import { usePersistentNotifications } from "@/context/PersistentNotificationContext";

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

  const { custom } = useNotification();
  const { setPostureNotification, setBlinkNotification } =
    usePersistentNotifications();

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(
    (event: WebSocketEvent) => {
      console.log("WebSocket message received:", event);

      if (event.type === "posture_warning") {
        // Show persistent posture warning
        setPostureNotification({
          id: "posture-warning",
          type: "posture",
          title: "Posture check!",
          body: `You've been in poor posture for ${event.bad_duration_sec} seconds. Try rolling your shoulders back and lifting your head.`,
          score: 67, // You might want to calculate this from duration
        });
      } else if (event.type === "posture_resolved") {
        // Remove posture warning
        setPostureNotification(null);
        // Show brief positive notification
        custom({
          title: "Great job!",
          body: "Your posture has improved.",
          duration: 3000,
        });
      } else if (event.type === "blink_warning") {
        // Show persistent blink warning
        setBlinkNotification({
          id: "blink-warning",
          type: "blink",
          title: "Take a break!",
          body: `Your eyes need a breather. You've had a low blink rate of ${event.blink_rate_per_min} blinks/min for ${event.low_duration_sec} seconds. Look 20 feet away for a few seconds to reset.`,
          score: 67,
        });
      } else if (event.type === "blink_resolved") {
        // Remove blink warning
        setBlinkNotification(null);
        // Show brief positive notification
        if (event.status === "back_to_normal") {
          custom({
            title: "Eyes refreshed!",
            body: `Your blink rate is back to normal (${event.blink_rate_per_min} blinks/min).`,
            duration: 3000,
          });
        } else if (event.status === "face_not_visible") {
          custom({
            title: "Face not detected",
            body: "Camera cannot see your face. Please adjust camera position.",
            duration: 3000,
          });
        }
      }
    },
    [setPostureNotification, setBlinkNotification, custom]
  );

  const connectWebSocket = useCallback(() => {
    try {
      wsRef.current = SessionService.connectWebSocket(
        handleWebSocketMessage,
        (error) => {
          console.error("WebSocket error:", error);
          setError("WebSocket connection error");
        },
        (event) => {
          console.log("WebSocket closed:", event);
          // Clean up persistent notifications on disconnect
          setPostureNotification(null);
          setBlinkNotification(null);
        }
      );
    } catch (err) {
      console.error("Failed to connect WebSocket:", err);
      setError("Failed to connect to WebSocket");
    }
  }, [handleWebSocketMessage, setPostureNotification, setBlinkNotification]);

  const startSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Start session on backend
      await SessionService.startSession(sessionConfig);

      // Connect to WebSocket
      connectWebSocket();

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
  }, [sessionConfig, connectWebSocket]);

  const stopSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop session on backend
      await SessionService.stopSession();

      // Disconnect WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // Clean up persistent notifications
      setPostureNotification(null);
      setBlinkNotification(null);

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
  }, [setPostureNotification, setBlinkNotification]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    sessionState,
    sessionConfig,
    isLoading,
    error,
    toggleSession,
    handleConfigChange,
  };
};
