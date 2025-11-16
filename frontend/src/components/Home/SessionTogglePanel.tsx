// components/Home/SessionTogglePanel.tsx
import React, { useState } from "react";

interface SessionTogglePanelProps {
  disabled?: boolean;
  onToggle?: (config: {
    posture: boolean;
    eyeStrain: boolean;
    distractions: boolean;
  }) => void;
}

export default function SessionTogglePanel({
  disabled = false,
  onToggle,
}: SessionTogglePanelProps) {
  const [posture, setPosture] = useState(true);
  const [eyeStrain, setEyeStrain] = useState(false);
  const [distractions, setDistractions] = useState(false);

  const handleToggle = (key: "posture" | "eyeStrain" | "distractions") => {
    if (disabled) return;

    const newState = { posture, eyeStrain, distractions };

    if (key === "posture") {
      setPosture(!posture);
      newState.posture = !posture;
    } else if (key === "eyeStrain") {
      setEyeStrain(!eyeStrain);
      newState.eyeStrain = !eyeStrain;
    } else if (key === "distractions") {
      setDistractions(!distractions);
      newState.distractions = !distractions;
    }

    onToggle?.(newState);
  };

  const toggles = [
    { key: "posture" as const, label: "Posture", value: posture },
    { key: "eyeStrain" as const, label: "Eye Strain", value: eyeStrain },
    {
      key: "distractions" as const,
      label: "Distractions",
      value: distractions,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 w-full">
      <div className="space-y-5">
        {toggles.map(({ key, label, value }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[18px] font-medium text-gray-900">
              {label}
            </span>
            <button
              onClick={() => handleToggle(key)}
              disabled={disabled}
              className={`
                relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200
                ${value ? "bg-axial-400" : "bg-gray-300"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <span
                className={`
                  inline-block h-7 w-7 transform rounded-full bg-white transition-transform duration-200
                  ${value ? "translate-x-8" : "translate-x-1"}
                `}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
