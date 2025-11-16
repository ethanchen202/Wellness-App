import React from "react";
import { useNotification } from "@/hooks/useNotification";

export default function NotificationTestButton() {
  const { postureCheck, eyeStrain, focus, custom } = useNotification();

  const testNotifications = [
    {
      label: "Posture Check",
      action: () =>
        postureCheck(
          "You're starting to slouch. Try rolling your shoulders back and lifting your head.",
          67
        ),
    },
    {
      label: "Eye Strain",
      action: () =>
        eyeStrain(
          "Your eyes need a breather. Look 20 feet away for a few seconds to reset.",
          67
        ),
    },
    {
      label: "Focus Lost",
      action: () =>
        focus("Lost focus for a moment... let's get back into it!", 67),
    },
    {
      label: "All Three",
      action: () => {
        postureCheck(
          "You're starting to slouch. Try rolling your shoulders back and lifting your head.",
          67
        );
        eyeStrain(
          "Your eyes need a breather. Look 20 feet away for a few seconds to reset.",
          67
        );
        focus("Lost focus for a moment... let's get back into it!", 67);
      },
    },
    {
      label: "Custom",
      action: () =>
        custom({
          title: "Custom Notification",
          body: "This is a custom notification with custom duration",
          score: 42,
          duration: 3000,
        }),
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-40">
      {testNotifications.map((test) => (
        <button
          key={test.label}
          onClick={test.action}
          className="px-4 py-2 bg-axial-400 text-white rounded-lg hover:bg-axial-300 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
        >
          {test.label}
        </button>
      ))}
    </div>
  );
}
