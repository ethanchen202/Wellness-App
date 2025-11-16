// data/homepageData.ts
import { SessionMode } from "@/types/session.types";
import { Focus, User } from "lucide-react";

export const sessionModes: SessionMode[] = [
  {
    id: "deep-focus",
    name: "Deep Focus",
    icon: Focus,
    description: "Minimize distractions and track focus sessions",
  },
  {
    id: "posture",
    name: "Posture",
    icon: User,
    description: "Monitor and improve your posture",
  },
];

export const weekMetrics = {
  overall: 67,
  posture: 62,
  eyeStrain: 88,
  distractions: 51,
};

export const welcomeMessage = {
  greeting: "Welcome back, Timothy.",
  subtext: "Let's Start a Session",
};

export const feedbackMessage = {
  title:
    "Good job! Your screen-time habits and focus are strong, but there's some room to improve on your posture.",
};
