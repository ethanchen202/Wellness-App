// components/Home/StartSessionButton.tsx
import React from "react";
import { Play, Square } from "lucide-react";

interface StartSessionButtonProps {
  isActive: boolean;
  isLoading?: boolean;
  onClick: () => void;
}

export default function StartSessionButton({
  isActive,
  isLoading = false,
  onClick,
}: StartSessionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={"flex flex-col cursor-pointer items-center"}
    >
      {isActive ? (
        <>
          <Square
            size={100}
            className="mb-1 group-hover:scale-110 transition-transform"
            fill="#5B63A8"
          />
          <span className="text-body-1 mt-1">Stop</span>
        </>
      ) : (
        <>
          <Play
            size={100}
            className="text-axial-400 mb-4 hover:scale-110 transition-transform"
            fill="#5B63A8"
          />
          <span className="text-body-1 text-axial-400 mt-1">Start</span>
        </>
      )}
    </button>
  );
}
