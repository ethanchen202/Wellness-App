export type TimeRange = "day" | "week" | "month" | "year";

export interface PostureData {
  timestamp: Date;
  score: number;
  degradationTime: number;
  eyeFixDuration: number;
}

export interface PostureStats {
  averageScore: number;
  degradationData: number[];
  eyeFixData: number[];
  averageDegradationTime: number;
  averageEyeFixDuration: number;
}

export interface PostureMetrics {
  day: PostureStats;
  week: PostureStats;
  month: PostureStats;
  year: PostureStats;
}
