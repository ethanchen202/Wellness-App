// components/Home/HomePage.tsx
import React from "react";
import {
  welcomeMessage,
  sessionModes,
  weekMetrics,
  feedbackMessage,
} from "@/data/homepageData";
import SessionModeCard from "./SessionModeCard";
import SessionTogglePanel from "./SessionTogglePanel";
import StartSessionButton from "./StartSessionButton";
import CircleScore from "@/components/Analytics/CircleScore";
import { useSession } from "@/hooks/useSession";
import StartSessionCard from "./StartSessionCard";
import NotificationTestButton from "../Notifications/NotificationTestButton";

export default function HomePage() {
  const { sessionState, isLoading, error, toggleSession, handleConfigChange } =
    useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[48px] font-bold text-axial-400 mb-2">
            {welcomeMessage.greeting}
          </h1>
          <p className="text-[28px] font-semibold text-axial-300">
            {welcomeMessage.subtext}
          </p>
        </div>

        {/* Main Section - Session Setup */}
        <div className="flex flex-row mb-16 gap-6">
          {/* Session Modes */}
          <div className="flex flex-row gap-6">
            {sessionModes.map((mode) => (
              <SessionModeCard key={mode.id} mode={mode} />
            ))}
          </div>

          {/* Start Button */}
          <StartSessionCard />
        </div>

        {/* Your Past Week Section */}
        <div>
          <h2 className="text-[32px] font-bold text-axial-400 mb-8">
            Your Past Week
          </h2>

          <div className="bg-white rounded-4xl shadow-[0_0_90px_6px_var(--color-gray-200)] p-12">
            <div className="grid grid-cols-[200px_1fr_auto_auto_auto] gap-12 items-center">
              {/* Overall Score */}
              <div className="flex flex-col items-center gap-4">
                <CircleScore
                  score={weekMetrics.overall}
                  size={160}
                  fontSize={50}
                  strokeWidth={10}
                />
                <p className="text-lg font-medium text-gray-900">Overall</p>
              </div>

              {/* Feedback */}
              <div>
                <p className="text-[18px] text-gray-700 leading-relaxed">
                  {feedbackMessage.title}
                </p>
              </div>

              {/* Individual Metrics */}
              <div className="flex flex-col items-center gap-2">
                <CircleScore
                  score={weekMetrics.posture}
                  size={110}
                  stroke="#E4E5ED"
                  strokeWidth={10}
                />
                <p className="text-base font-medium text-gray-900">Posture</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <CircleScore
                  score={weekMetrics.eyeStrain}
                  size={110}
                  stroke="#E4E5ED"
                  strokeWidth={10}
                />
                <p className="text-base font-medium text-gray-900">
                  Eye Strain
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <CircleScore
                  score={weekMetrics.distractions}
                  size={110}
                  stroke="#E4E5ED"
                  strokeWidth={10}
                />
                <p className="text-base font-medium text-gray-900">
                  Distractions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Status Indicator */}
        {sessionState.isActive && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-full shadow-lg">
            <p className="font-semibold">Session Active</p>
            <p className="text-sm">
              {sessionState.startTime &&
                `Started at ${sessionState.startTime.toLocaleTimeString()}`}
            </p>
          </div>
        )}
      </div>
      <NotificationTestButton />
    </div>
  );
}
