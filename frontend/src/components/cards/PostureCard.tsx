import React, { useState } from "react";
import TimeRangeSelector from "@/components/cards/TimeRangeSelector";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { TimeRange, PostureMetrics } from "@/types/posture";

interface PostureCardProps {
  metrics: PostureMetrics;
}

export default function PostureCard({ metrics }: PostureCardProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("week");
  const currentStats = metrics[selectedRange];

  const getXAxisLabels = (range: TimeRange, dataLength: number) => {
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

  return (
    <div className="flex flex-col w-full max-w-[1040px] bg-white rounded-4xl shadow-sm p-12">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-[64px] font-bold text-axial-400 leading-none mb-2">
          Posture
        </h1>
        <p className="text-[24px] text-axial-300">
          Average Score:{" "}
          <span className="font-semibold">{currentStats.averageScore}</span>
        </p>
      </div>

      <div className="flex flex-col items-center">
        {/* Time Range Selector */}
        <TimeRangeSelector
          selected={selectedRange}
          onChange={setSelectedRange}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-12 mt-">
          {/* Posture Degradation Chart */}
          <div>
            <LineChart
              title="Posture Degradation"
              data={currentStats.degradationData}
              xAxisData={getXAxisLabels(
                selectedRange,
                currentStats.degradationData.length
              )}
              yAxisLabel="Score"
              height={280}
              showGrid={true}
              curveType="monotoneX"
              showPoints={true}
            />
            <p className="mt-6 text-[18px] text-gray-700">
              You usually hit poor posture after{" "}
              <span className="font-bold text-axial-400">
                {currentStats.averageDegradationTime} minutes
              </span>
            </p>
          </div>

          {/* Eye Fix Duration Chart */}
          <div className="w-full">
            <BarChart
              title="Eye Fix Duration"
              data={currentStats.eyeFixData}
              xAxisData={getXAxisLabels(
                selectedRange,
                currentStats.eyeFixData.length
              )}
              yAxisLabel="Minutes"
              showGrid={false}
              borderRadius={8}
              colors={["#7E86C4"]}
            />
            <p className="mt-6 text-[18px] text-gray-700">
              You average{" "}
              <span className="font-bold text-axial-400">
                {currentStats.averageEyeFixDuration} minutes
              </span>{" "}
              before taking a break
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
