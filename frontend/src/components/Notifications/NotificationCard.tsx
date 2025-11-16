// components/Notifications/NotificationCard.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Notification } from "@/types/notification.types";

interface NotificationCardProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  isVisible?: boolean;
}

export default function NotificationCard({
  notification,
  onDismiss,
  isVisible = true,
}: NotificationCardProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleDismiss = () => {
    setIsLeaving(true);
    // Wait for animation to complete
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
        max-w-md
      `}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-axial-400">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`text-[20px] font-bold text-axial-400`}>
            {notification.title}
          </h3>
          <div className="flex items-center gap-3">
            {notification.score !== undefined && (
              <span className="text-sm font-medium text-gray-600">
                Score: {notification.score}
              </span>
            )}
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <p className="text-[16px] text-gray-700 leading-relaxed">
          {notification.body}
        </p>
      </div>
    </div>
  );
}
