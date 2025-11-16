// components/Analytics/AnalyticsCard.tsx
import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import TimeRangeSelector from "@/components/cards/TimeRangeSelector";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import ChartImage from "@/components/charts/ChartImage";
import CircleScore from "@/components/Analytics/CircleScore";
import {
  TimeRange,
  AnalyticsMetric,
  ChartData,
  GraphChartData,
  ImageChartData,
} from "@/types/analytics.types";

interface AnalyticsCardProps {
  title: string;
  icon: LucideIcon;
  metrics: AnalyticsMetric;
  getXAxisLabels?: (
    range: TimeRange,
    dataLength: number
  ) => (string | number)[];
}

const defaultGetXAxisLabels = (range: TimeRange, dataLength: number) => {
  switch (range) {
    case "day":
      return Array.from({ length: dataLength }, (_, i) => `${i * 2}h`);
    case "week":
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    case "month":
      return Array.from({ length: dataLength }, (_, i) => `Day ${i + 1}`);
    case "year":
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    default:
      return [];
  }
};

// Type guard for graph charts
function isGraphChart(chart: ChartData): chart is GraphChartData {
  return chart.dataType === "graph";
}

// Type guard for image charts
function isImageChart(chart: ChartData): chart is ImageChartData {
  return chart.dataType === "image";
}

export default function AnalyticsCard({
  title,
  icon: Icon,
  metrics,
  getXAxisLabels = defaultGetXAxisLabels,
}: AnalyticsCardProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("week");
  const currentData = metrics.data[selectedRange];

  const renderChart = (chart: ChartData) => {
    // Handle image chart
    if (isImageChart(chart)) {
      return (
        <ChartImage
          key={chart.id}
          title={chart.title}
          imagePath={chart.imagePath}
          width={chart.width}
          height={chart.height}
        />
      );
    }

    // Handle graph chart
    if (isGraphChart(chart)) {
      const xAxisLabels = getXAxisLabels(selectedRange, chart.data.length);

      if (chart.type === "line") {
        return (
          <LineChart
            key={chart.id}
            title={chart.title}
            data={chart.data}
            xAxisData={xAxisLabels}
            yAxisLabel={chart.yAxisLabel}
            height={140}
            showGrid={chart.showGrid ?? true}
            curveType={chart.curveType ?? "monotoneX"}
            showPoints={chart.showPoints ?? true}
            showXAxisLabel={chart.showXAxisLabel ?? true}
            showYAxisLabel={chart.showYAxisLabel ?? true}
          />
        );
      } else if (chart.type === "bar") {
        return (
          <BarChart
            key={chart.id}
            title={chart.title}
            data={chart.data}
            xAxisData={xAxisLabels}
            yAxisLabel={chart.yAxisLabel}
            height={140}
            showGrid={chart.showGrid ?? false}
            borderRadius={chart.borderRadius ?? 8}
            colors={chart.colors ?? ["#7E86C4"]}
            showXAxisLabel={chart.showXAxisLabel ?? true}
            showYAxisLabel={chart.showYAxisLabel ?? true}
          />
        );
      }
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full max-w-[1040px] bg-white rounded-4xl p-8 shadow-[0_0_90px_6px_var(--color-gray-200)] mb-3">
      {/* Header with Icon and Title */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Icon size={40} className="text-axial-400" />
          <h1 className="text-title-2 font-bold text-axial-400 leading-none">
            {title}
          </h1>
        </div>

        {/* Circle Score in top right */}
        <CircleScore score={currentData.score} size={50} strokeWidth={3} />
      </div>

      {/* Time Range Selector */}
      <div className="mt-2">
        <TimeRangeSelector
          selected={selectedRange}
          onChange={setSelectedRange}
        />
      </div>

      {/* Charts Grid */}
      <div
        className={`grid gap-12 mt-1 ${
          currentData.charts.length === 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {currentData.charts.map((chart) => (
          <div key={chart.id}>
            {renderChart(chart)}
            <p className="mt-6 text-body-2 text-gray-900">
              {chart.description}{" "}
              <span className="font-bold text-axial-400">
                {chart.descriptionValue}
              </span>{" "}
              {chart.descriptionSuffix}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
