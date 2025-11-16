import React from "react";
import { TimeRange } from "@/types/analytics.types";

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

const ranges: { value: TimeRange; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function TimeRangeSelector({
  selected,
  onChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-full w-fit p-1 border-[0.5px] border-gray-300">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            px-5 rounded-full text-body-2 transition-all duration-200 cursor-pointer border-[1px]
            ${
              selected === value
                ? "bg-axial-100 text-gray-900 shadow-sm border-axial-400"
                : "text-gray-600  hover:text-gray-900 hover:bg-gray-200 border-transparent"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
