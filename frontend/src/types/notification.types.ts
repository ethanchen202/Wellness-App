// types/notification.types.ts
export type NotificationType = "posture" | "eye-strain" | "focus" | "default";

export interface Notification {
  id: string;
  title: string;
  body: string;
  score?: number;
  type?: NotificationType;
  timestamp?: Date;
  duration?: number; // Auto-dismiss in ms (0 = never)
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}
