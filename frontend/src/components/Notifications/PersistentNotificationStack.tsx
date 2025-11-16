// components/Notifications/PersistentNotificationStack.tsx
import React from "react";
import NotificationCard from "./NotificationCard";
import { usePersistentNotifications } from "@/context/PersistentNotificationContext";

/**
 * Displays persistent notifications (posture and blink warnings)
 * These don't auto-dismiss and are manually removed when the issue is resolved
 */
export default function PersistentNotificationStack() {
  const { postureNotification, blinkNotification } =
    usePersistentNotifications();

  return (
    <div
      className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Persistent Notifications"
      aria-live="assertive"
      aria-atomic="true"
    >
      {postureNotification && (
        <div key={postureNotification.id} className="pointer-events-auto">
          <NotificationCard
            notification={{
              id: postureNotification.id,
              title: postureNotification.title,
              body: postureNotification.body,
              score: postureNotification.score,
              type: "posture",
              duration: 0,
            }}
            onDismiss={() => void 0}
            isVisible={true}
          />
        </div>
      )}
      {blinkNotification && (
        <div key={blinkNotification.id} className="pointer-events-auto">
          <NotificationCard
            notification={{
              id: blinkNotification.id,
              title: blinkNotification.title,
              body: blinkNotification.body,
              score: blinkNotification.score,
              type: "eye-strain",
              duration: 0,
            }}
            onDismiss={() => void 0}
            isVisible={true}
          />
        </div>
      )}
    </div>
  );
}
