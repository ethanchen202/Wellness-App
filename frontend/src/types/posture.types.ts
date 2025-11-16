// types/posture.types.ts - Keep for backward compatibility, now extends analytics
import { AnalyticsMetric, TimeRangeData, ChartData } from "./analytics.types";

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

// Helper to convert PostureMetrics to AnalyticsMetric
export const convertPostureMetricsToAnalyticsMetric = (
  metrics: PostureMetrics
): AnalyticsMetric => {
  return {
    averageScore: metrics.week.averageScore,
    data: {
      day: {
        score: metrics.day.averageScore,
        charts: [
          {
            id: "posture-degradation-day",
            type: "line",
            title: "Posture Degradation",
            data: metrics.day.degradationData,
            yAxisLabel: "Score",
            description: "You usually hit poor posture after",
            descriptionValue: metrics.day.averageDegradationTime,
            descriptionSuffix: "minutes",
            showGrid: true,
            showPoints: true,
          },
          {
            id: "eye-fix-day",
            type: "bar",
            title: "Eye Fix Duration",
            data: metrics.day.eyeFixData,
            yAxisLabel: "Minutes",
            description: "You average",
            descriptionValue: metrics.day.averageEyeFixDuration,
            descriptionSuffix: "minutes before taking a break",
            showGrid: false,
          },
        ],
      },
      week: {
        score: metrics.week.averageScore,
        charts: [
          {
            id: "posture-degradation-week",
            type: "line",
            title: "Posture Degradation",
            data: metrics.week.degradationData,
            yAxisLabel: "Score",
            description: "You usually hit poor posture after",
            descriptionValue: metrics.week.averageDegradationTime,
            descriptionSuffix: "minutes",
            showGrid: true,
            showPoints: true,
          },
          {
            id: "eye-fix-week",
            type: "bar",
            title: "Eye Fix Duration",
            data: metrics.week.eyeFixData,
            yAxisLabel: "Minutes",
            description: "You average",
            descriptionValue: metrics.week.averageEyeFixDuration,
            descriptionSuffix: "minutes before taking a break",
            showGrid: false,
          },
        ],
      },
      month: {
        score: metrics.month.averageScore,
        charts: [
          {
            id: "posture-degradation-month",
            type: "line",
            title: "Posture Degradation",
            data: metrics.month.degradationData,
            yAxisLabel: "Score",
            description: "You usually hit poor posture after",
            descriptionValue: metrics.month.averageDegradationTime,
            descriptionSuffix: "minutes",
            showGrid: true,
            showPoints: true,
          },
          {
            id: "eye-fix-month",
            type: "bar",
            title: "Eye Fix Duration",
            data: metrics.month.eyeFixData,
            yAxisLabel: "Minutes",
            description: "You average",
            descriptionValue: metrics.month.averageEyeFixDuration,
            descriptionSuffix: "minutes before taking a break",
            showGrid: false,
          },
        ],
      },
      year: {
        score: metrics.year.averageScore,
        charts: [
          {
            id: "posture-degradation-year",
            type: "line",
            title: "Posture Degradation",
            data: metrics.year.degradationData,
            yAxisLabel: "Score",
            description: "You usually hit poor posture after",
            descriptionValue: metrics.year.averageDegradationTime,
            descriptionSuffix: "minutes",
            showGrid: true,
            showPoints: true,
          },
          {
            id: "eye-fix-year",
            type: "bar",
            title: "Eye Fix Duration",
            data: metrics.year.eyeFixData,
            yAxisLabel: "Minutes",
            description: "You average",
            descriptionValue: metrics.year.averageEyeFixDuration,
            descriptionSuffix: "minutes before taking a break",
            showGrid: false,
          },
        ],
      },
    },
  };
};
