export interface ChartDataPoint {
  x: string | number;
  y: number;
}

export interface BaseChartProps {
  title?: string;
  data: number[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisData?: (string | number)[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  loading?: boolean;
  className?: string;
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
}
