import React from "react";

interface CircleScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  fontSize?: number | string;
  stroke?: string;
}

export default function CircleScore({
  score,
  size = 80,
  strokeWidth = 4,
  fontSize = "24px",
  stroke = "#E8E8E8",
}: CircleScoreProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background + progress circle */}
        <svg
          width={size}
          height={size}
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={"#5B63A8"}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            style={{
              fontSize:
                typeof fontSize === "number" ? `${fontSize}px` : fontSize,
              color: "#5B63A8",
              fontWeight: 700,
            }}
          >
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
