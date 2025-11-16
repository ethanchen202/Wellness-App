// components/Home/SessionModeCard.tsx
import React from "react";
import { SessionMode } from "@/types/session.types";

interface SessionModeCardProps {
  mode: SessionMode;
  onClick?: () => void;
}

export default function SessionModeCard({
  mode,
  onClick,
}: SessionModeCardProps) {
  const Icon = mode.icon;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-[260px] bg-white rounded-3xl shadow-[0_0_90px_6px_var(--color-gray-200)] transition-shadow duration-200 cursor-pointer group"
    >
      <Icon
        size={100}
        className="text-axial-400 mb-4 group-hover:scale-110 transition-transform"
      />
      <h3 className="text-body-1 text-axial-400">{mode.name}</h3>
    </button>
  );
}
