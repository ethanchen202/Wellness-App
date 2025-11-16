import React from "react";
import AnalyticsCard from "@/components/Analytics/AnalyticsCard";
import { postureMetrics } from "@/data/analyticsData";
import { User } from "lucide-react";

export default function EyeStrainPage() {
  return (
    <div className="py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <AnalyticsCard title="Posture" icon={User} metrics={postureMetrics} />
      </div>
    </div>
  );
}
