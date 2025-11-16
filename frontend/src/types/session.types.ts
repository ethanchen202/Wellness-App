// types/session.types.ts
export interface SessionMode {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description?: string;
}

export interface SessionConfig {
  posture: boolean;
  eyeStrain: boolean;
  distractions: boolean;
}

export interface SessionState {
  isActive: boolean;
  startTime?: Date;
  config?: SessionConfig;
}

export interface WebSocketMessage {
  type: "posture" | "eye_strain" | "distraction" | "error" | string;
  data: any;
  timestamp: number;
}
