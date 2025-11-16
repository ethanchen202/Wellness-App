// types/websocket.types.ts
export type WebSocketEventType =
  | "posture_warning"
  | "posture_resolved"
  | "blink_warning"
  | "blink_resolved";

export interface PostureWarningEvent {
  type: "posture_warning";
  status: "prolonged_bad";
  bad_duration_sec: number;
}

export interface PostureResolvedEvent {
  type: "posture_resolved";
  status: "back_to_good_or_unknown";
}

export interface BlinkWarningEvent {
  type: "blink_warning";
  status: "prolonged_low_rate";
  blink_rate_per_min: number;
  low_duration_sec: number;
}

export interface BlinkResolvedEvent {
  type: "blink_resolved";
  status: "back_to_normal" | "face_not_visible";
  blink_rate_per_min?: number;
}

export type WebSocketEvent =
  | PostureWarningEvent
  | PostureResolvedEvent
  | BlinkWarningEvent
  | BlinkResolvedEvent;
