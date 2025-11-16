// components/Home/StartSessionCard.tsx
import React, { useState } from "react";
import StartSessionButton from "./StartSessionButton";
import { useSession } from "@/hooks/useSession";

interface StartSessionCardProps {
  disabled?: boolean;
  onToggle?: (config: {
    posture: boolean;
    eyeStrain: boolean;
    distractions: boolean;
  }) => void;
}

export default function StartSessionCard({
  disabled = false,
  onToggle,
}: StartSessionCardProps) {
  const { sessionState, isLoading, error, toggleSession, handleConfigChange } =
    useSession();
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
    <div className="flex flex-row bg-white rounded-3xl shadow-[0_0_90px_6px_var(--color-gray-200)] py-8 w-full">
      <div className="flex items-center justify-center w-[400px] border-r border-gray-300">
        <StartSessionButton
          isActive={sessionState.isActive}
          isLoading={isLoading}
          onClick={toggleSession}
        />
      </div>
      <div className="space-y-5 p-10 w-full">
        {toggles.map(({ key, label, value }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[18px] font-medium text-gray-900">
              {label}
            </span>
            <button
              onClick={() => handleToggle(key)}
              disabled={sessionState.isActive}
              className={`
    relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 py-[18px]
    ${value ? "bg-axial-400" : "bg-gray-300"}
    ${
      sessionState.isActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    }
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
