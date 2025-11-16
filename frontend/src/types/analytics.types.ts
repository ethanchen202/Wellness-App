// types/analytics.types.ts
import { LucideIcon } from "lucide-react";

export type TimeRange = "day" | "week" | "month" | "year";

export type ChartType = "line" | "bar";

export interface AnalyticsMetric {
  averageScore: number;
  data: { [key in TimeRange]: TimeRangeData };
}

export interface TimeRangeData {
  score: number; // For the circular display
  charts: ChartData[];
}

export interface ChartData {
  id: string; // Unique identifier
  type: ChartType; // 'line' or 'bar'
  title: string;
  data: number[];
  xAxisLabel?: string;
  yAxisLabel: string;
  description: string; // Text shown below chart
  descriptionValue: string | number; // Bold value in description
  descriptionSuffix: string; // Text after the value
  curveType?: "linear" | "monotoneX" | "natural" | "step";
  showPoints?: boolean;
  showGrid?: boolean;
  borderRadius?: number;
  colors?: string[];
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
}

export interface AnalyticsCardProps {
  title: string;
  icon: LucideIcon;
  metrics: AnalyticsMetric;
  getXAxisLabels?: (
    range: TimeRange,
    dataLength: number
  ) => (string | number)[];
}
