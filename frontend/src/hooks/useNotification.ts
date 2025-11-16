// hooks/useNotification.ts
import { useNotifications } from "@/context/NotificationContext";
import { Notification } from "@/types/notification.types";

/**
 * Custom hook for easier notification management
 * Provides convenience methods for common notification types
 */
export function useNotification() {
  const { addNotification } = useNotifications();

  return {
    postureCheck: (body: string, score: number) =>
      addNotification({
        title: "Posture check!",
        body,
        score,
        type: "posture",
        duration: 5000,
      }),

    eyeStrain: (body: string, score: number) =>
      addNotification({
        title: "Take a break!",
        body,
        score,
        type: "eye-strain",
        duration: 5000,
      }),

    focus: (body: string, score: number) =>
      addNotification({
        title: "Focus",
        body,
        score,
        type: "focus",
        duration: 5000,
      }),

    custom: (notification: Omit<Notification, "id">) =>
      addNotification(notification),
  };
}
