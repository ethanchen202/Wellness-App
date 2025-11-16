// components/Notifications/NotificationStack.tsx
import React, { useEffect } from "react";
import NotificationCard from "./NotificationCard";
import { useNotifications } from "@/context/NotificationContext";
import { ElectronNotificationService } from "@/services/electronNotificationService";

/**
 * Manages and displays notification stack
 * Handles both in-app and native Electron notifications
 * Should be placed in root layout/app component
 */
export default function NotificationStack() {
  const { notifications, removeNotification } = useNotifications();

  useEffect(() => {
    // Request notification permissions on mount
    ElectronNotificationService.requestPermission();
  }, []);

  // Send to native Electron notification when notification is added
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      ElectronNotificationService.showNotification(latest.title, {
        body: latest.body,
        tag: latest.id, // Prevents duplicate notifications
      });
    }
  }, [notifications]);

  return (
    <div
      className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="true"
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationCard
            notification={notification}
            onDismiss={removeNotification}
            isVisible={true}
          />
        </div>
      ))}
    </div>
  );
}
