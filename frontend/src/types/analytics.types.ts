// types/analytics.types.ts
import { LucideIcon } from "lucide-react";

export type TimeRange = "day" | "week" | "month" | "year";

export type ChartType = "line" | "bar";

export type ChartDataType = "graph" | "image";

export interface AnalyticsMetric {
  averageScore: number;
  data: { [key in TimeRange]: TimeRangeData };
}

export interface TimeRangeData {
  score: number;
  charts: ChartData[];
}

export interface BaseChartData {
  id: string;
  title: string;
  description: string;
  descriptionValue: string | number;
  descriptionSuffix: string;
}

export interface GraphChartData extends BaseChartData {
  type: ChartType; // 'line' or 'bar'
  dataType: "graph";
  data: number[];
  xAxisLabel?: string;
  yAxisLabel: string;
  curveType?: "linear" | "monotoneX" | "natural" | "step";
  showPoints?: boolean;
  showGrid?: boolean;
  borderRadius?: number;
  colors?: string[];
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
}

export interface ImageChartData extends BaseChartData {
  dataType: "image";
  imagePath: string; // Path to PNG/JPG image
  width?: number;
  height?: number;
}

export type ChartData = GraphChartData | ImageChartData;
