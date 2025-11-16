// components/Charts/ChartImage.tsx
import React from "react";

interface ChartImageProps {
  title?: string;
  imagePath: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ChartImage({
  title,
  imagePath,
  width = 600,
  height = 280,
  className = "",
}: ChartImageProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {title && <h3 className="text-body-1 mt-2 mb-6">{title}</h3>}

      <div className="w-full flex flex-col items-center justify-start overflow-hidden">
        <img
          src="./src/assets/haha.png"
          alt={title || "Chart"}
          className="max-w-full max-h-[150px] object-contain"
        />
      </div>
    </div>
  );
}
