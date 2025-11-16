import React from "react";
import AnalyticsCard from "@/components/Analytics/AnalyticsCard";
import { eyeStrainMetrics } from "@/data/analyticsData";
import { Eye } from "lucide-react";

export default function EyeStrainPage() {
  return (
    <div className="py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <AnalyticsCard
          title="Eye Strain"
          icon={Eye}
          metrics={eyeStrainMetrics}
        />
      </div>
    </div>
  );
}
