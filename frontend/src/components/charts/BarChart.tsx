import React from "react";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";
import { BaseChartProps } from "@/types/chart.types";

interface BarChartProps extends BaseChartProps {
  layout?: "vertical" | "horizontal";
  barWidth?: number;
  borderRadius?: number;
  colors?: string[];
}

export default function BarChart({
  title,
  data,
  xAxisLabel,
  yAxisLabel,
  xAxisData,
  width,
  height = 100,
  showGrid = false,
  showLegend = false,
  loading = false,
  layout = "vertical",
  barWidth,
  borderRadius = 8,
  colors = ["#7E86C4"],
  className = "",
  showYAxisLabel = false,
}: BarChartProps) {
  const defaultXAxis = xAxisData || data.map((_, idx) => `Item ${idx + 1}`);

  return (
    <div className={`${className}`}>
      {title && <h3 className="text-body-1 mb-6 mt-2">{title}</h3>}

      <MuiBarChart
        width={width}
        height={height}
        series={[
          {
            data,
            color: colors[0],
          },
        ]}
        xAxis={[
          {
            data: defaultXAxis,
            scaleType: "band",
            label: xAxisLabel,
            labelStyle: {
              fill: "#5B63A8",
              fontSize: 14,
              fontWeight: 500,
            },
            tickLabelStyle: {
              fill: "#9C9C9C",
              fontSize: 12,
              angle: layout === "vertical" ? 0 : -45,
              textAnchor: layout === "vertical" ? "middle" : "end",
            },
          },
        ]}
        yAxis={[
          {
            label: showYAxisLabel ? yAxisLabel : undefined,
            labelStyle: {
              fill: "#5B63A8",
              fontSize: 14,
              fontWeight: 500,
            },
            tickLabelStyle: {
              fill: "#9C9C9C",
              fontSize: 12,
            },
          },
        ]}
        layout={layout}
        hideLegend={!showLegend}
        grid={{ horizontal: showGrid, vertical: showGrid }}
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        loading={loading}
        skipAnimation={false}
        borderRadius={borderRadius}
        slotProps={{
          loadingOverlay: {
            message: "Loading chart data...",
          },
          noDataOverlay: {
            message: "No data available",
          },
        }}
        sx={{
          "& .MuiChartsAxis-line": {
            stroke: "#E8E8E8",
            strokeWidth: 2,
          },
          "& .MuiChartsAxis-tickLabel": {
            fill: "#9C9C9C",
            fontFamily: "Inter, sans-serif",
          },
          "& .MuiChartsGrid-line": {
            stroke: "#E8E8E8",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          },
          "& .MuiBarElement-root": {
            transition: "fill 0.2s ease",
            "&:hover": {
              fill: "#5B63A8",
              cursor: "pointer",
            },
          },
          "& .MuiChartsBarLabel-root": {
            fill: "#5B63A8",
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
}
