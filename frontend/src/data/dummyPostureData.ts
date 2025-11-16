// data/dummyPostureData.ts
import { PostureMetrics } from "@/types/posture";

export const dummyPostureMetrics: PostureMetrics = {
  // Day view - hourly data (12 data points for 24 hours)
  day: {
    averageScore: 85,
    degradationData: [95, 93, 90, 87, 84, 80, 75, 72, 68, 65, 62, 58],
    eyeFixData: [45, 38, 52, 41, 35, 48, 43, 39, 46, 37, 42, 40],
    averageDegradationTime: 18,
    averageEyeFixDuration: 42,
  },

  // Week view - daily data (7 data points)
  week: {
    averageScore: 88,
    degradationData: [95, 90, 85, 82, 78, 70, 60],
    eyeFixData: [35, 25, 55, 40, 30, 50, 35],
    averageDegradationTime: 16,
    averageEyeFixDuration: 43,
  },

  // Month view - weekly data (4 weeks)
  month: {
    averageScore: 82,
    degradationData: [92, 88, 80, 75],
    eyeFixData: [48, 42, 38, 35],
    averageDegradationTime: 20,
    averageEyeFixDuration: 41,
  },

  // Year view - monthly data (12 months)
  year: {
    averageScore: 78,
    degradationData: [85, 83, 80, 78, 76, 74, 72, 70, 68, 70, 72, 75],
    eyeFixData: [50, 48, 45, 42, 40, 38, 36, 35, 37, 40, 43, 46],
    averageDegradationTime: 22,
    averageEyeFixDuration: 42,
  },
};
