// context/PersistentNotificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";

export interface PersistentNotification {
  id: string;
  type: "posture" | "blink";
  title: string;
  body: string;
  score?: number;
}

interface PersistentNotificationContextType {
  postureNotification: PersistentNotification | null;
  blinkNotification: PersistentNotification | null;
  setPostureNotification: (notification: PersistentNotification | null) => void;
  setBlinkNotification: (notification: PersistentNotification | null) => void;
}

const PersistentNotificationContext = createContext<
  PersistentNotificationContextType | undefined
>(undefined);

export function PersistentNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [postureNotification, setPostureNotification] =
    useState<PersistentNotification | null>(null);
  const [blinkNotification, setBlinkNotification] =
    useState<PersistentNotification | null>(null);

  return (
    <PersistentNotificationContext.Provider
      value={{
        postureNotification,
        blinkNotification,
        setPostureNotification,
        setBlinkNotification,
      }}
    >
      {children}
    </PersistentNotificationContext.Provider>
  );
}

export function usePersistentNotifications() {
  const context = useContext(PersistentNotificationContext);
  if (!context) {
    throw new Error(
      "usePersistentNotifications must be used within PersistentNotificationProvider"
    );
  }
  return context;
}
