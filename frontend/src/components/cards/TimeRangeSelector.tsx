import React from "react";
import { TimeRange } from "@/types/posture";

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
    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2 w-fit">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            px-8 py-3 rounded-full text-[20px] font-medium transition-all duration-200 cursor-pointer
            ${
              selected === value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
