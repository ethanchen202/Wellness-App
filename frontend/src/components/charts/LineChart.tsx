// components/Charts/LineChart.tsx
import React from "react";
import { LineChart as MuiLineChart } from "@mui/x-charts/LineChart";
import { BaseChartProps } from "@/types/chart";

interface LineChartProps extends BaseChartProps {
  curveType?: "linear" | "monotoneX" | "natural" | "step";
  showArea?: boolean;
  showPoints?: boolean;
}

export default function LineChart({
  title,
  data,
  xAxisLabel,
  yAxisLabel,
  xAxisData,
  width,
  height = 280,
  showGrid = false,
  showLegend = false,
  loading = false,
  curveType = "monotoneX",
  showArea = false,
  showPoints = false,
  className = "",
}: LineChartProps) {
  // Generate default x-axis data if not provided
  const defaultXAxis = xAxisData || data.map((_, idx) => idx + 1);

  return (
    <div className={`relative ${className}`}>
      {title && (
        <h3 className="text-[28px] font-semibold text-gray-900 mb-6">
          {title}
        </h3>
      )}

      <MuiLineChart
        width={width}
        height={height}
        series={[
          {
            data,
            curve: curveType,
            area: showArea,
            showMark: showPoints,
            color: "#7E86C4",
          },
        ]}
        xAxis={[
          {
            data: defaultXAxis,
            scaleType: "point",
            label: xAxisLabel,
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
        yAxis={[
          {
            label: yAxisLabel,
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
        hideLegend={!showLegend}
        grid={{ horizontal: showGrid, vertical: showGrid }}
        margin={{ left: 0, right: 100, top: 0, bottom: 0 }}
        loading={loading}
        skipAnimation={false}
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
          "& .MuiLineElement-root": {
            strokeWidth: 3,
            strokeLinecap: "round",
          },
          "& .MuiAreaElement-root": {
            fill: "url(#gradient)",
            fillOpacity: 0.3,
          },
          "& .MuiMarkElement-root": {
            fill: "#7E86C4",
            stroke: "#fff",
            strokeWidth: 2,
            r: 4,
            "&:hover": {
              r: 6,
              fill: "#5B63A8",
            },
          },
          "& .MuiChartsAxis-left .MuiChartsAxis-label": {
            transform: "translateX(10px)", // Moves it to the right (closer to axis)
          },
        }}
      >
        {showArea && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7E86C4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#7E86C4" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        )}
      </MuiLineChart>
    </div>
  );
}
