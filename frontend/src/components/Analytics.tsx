import { Eye, User } from "lucide-react";
import { realisticPostureMetrics } from "../data/realisticPostureData";
import AnalyticsCard from "./Analytics/AnalyticsCard";
import EyeStrainPage from "./cards/EyeStrainCard";
import {
  eyeStrainMetrics,
  postureMetrics,
  distractionsMetrics,
  sessionLogsMetrics,
} from "@/data/analyticsData";
import { Vibrate, FileClock } from "lucide-react";

export default function Analytics() {
  return (
    <div className="flex flex-col bg-white">
      <div className="w-full px-[30px] pt-[30px] bg-white">
        <span className="text-title-1 text-axial-400">Analytics</span>
      </div>{" "}
      <div className="w-full px-5">
        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
          <AnalyticsCard title="Posture" icon={User} metrics={postureMetrics} />

          <AnalyticsCard
            title="Eye Strain"
            icon={Eye}
            metrics={eyeStrainMetrics}
          />
          <AnalyticsCard
            title="Distractions"
            icon={Vibrate}
            metrics={distractionsMetrics}
          />
          <AnalyticsCard
            title="Session Logs"
            icon={FileClock}
            metrics={sessionLogsMetrics}
          />
        </div>
      </div>
    </div>
  );
}
