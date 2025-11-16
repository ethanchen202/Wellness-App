// data/realisticPostureData.ts
import { PostureMetrics } from "@/types/posture";

/**
 * Realistic posture data that simulates actual user behavior:
 * - Degradation gets worse as the day/week progresses (fatigue)
 * - Eye fix duration varies but has patterns (breaks get shorter when tired)
 * - Weekend vs weekday differences
 * - Seasonal patterns in yearly data
 */
export const realisticPostureMetrics: PostureMetrics = {
  // Day view - Every 2 hours from 8am to 10pm
  day: {
    averageScore: 84,
    degradationData: [
      95, // 8-10am (fresh, good posture)
      92, // 10am-12pm
      88, // 12-2pm (post-lunch dip)
      85, // 2-4pm
      80, // 4-6pm (afternoon fatigue)
      75, // 6-8pm
      70, // 8-10pm (tired)
    ],
    eyeFixData: [
      45, // 8-10am (taking good breaks)
      42, // 10am-12pm
      38, // 12-2pm (focused work, fewer breaks)
      35, // 2-4pm
      40, // 4-6pm (recovery)
      45, // 6-8pm
      50, // 8-10pm (more breaks as tired)
    ],
    averageDegradationTime: 17,
    averageEyeFixDuration: 42,
  },

  // Week view - Monday through Sunday
  week: {
    averageScore: 88,
    degradationData: [
      92, // Monday (well-rested)
      90, // Tuesday
      85, // Wednesday (mid-week slump)
      82, // Thursday
      78, // Friday (end of week fatigue)
      88, // Saturday (rested, but casual posture)
      90, // Sunday (recovered)
    ],
    eyeFixData: [
      38, // Monday (focused, fewer breaks)
      35, // Tuesday (busy)
      42, // Wednesday (more conscious)
      40, // Thursday
      45, // Friday (taking it easier)
      50, // Saturday (more relaxed, frequent breaks)
      48, // Sunday
    ],
    averageDegradationTime: 16,
    averageEyeFixDuration: 43,
  },

  // Month view - 4 weeks
  month: {
    averageScore: 82,
    degradationData: [
      90, // Week 1 (fresh start)
      85, // Week 2 (settling in)
      78, // Week 3 (accumulated fatigue)
      76, // Week 4 (end of month push)
    ],
    eyeFixData: [
      45, // Week 1 (good habits)
      40, // Week 2 (getting busier)
      38, // Week 3 (less breaks)
      42, // Week 4 (trying to recover)
    ],
    averageDegradationTime: 19,
    averageEyeFixDuration: 41,
  },

  // Year view - 12 months
  year: {
    averageScore: 80,
    degradationData: [
      82, // Jan (New Year resolutions)
      80, // Feb
      78, // Mar
      76, // Apr
      75, // May
      73, // Jun (summer slump)
      70, // Jul
      72, // Aug
      76, // Sep (back to routine)
      78, // Oct
      80, // Nov (year-end push)
      82, // Dec (holidays, more breaks)
    ],
    eyeFixData: [
      45, // Jan (fresh habits)
      43, // Feb
      40, // Mar
      38, // Apr
      37, // May
      36, // Jun
      35, // Jul (lowest - summer distraction)
      38, // Aug
      42, // Sep (renewed focus)
      44, // Oct
      46, // Nov
      48, // Dec (more relaxed)
    ],
    averageDegradationTime: 20,
    averageEyeFixDuration: 41,
  },
};
