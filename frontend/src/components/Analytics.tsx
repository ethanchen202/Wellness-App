import { realisticPostureMetrics } from "../data/realisticPostureData";
import PostureCard from "./cards/PostureCard";

export default function Analytics() {
  return (
    <div className="w-full bg-white">
      {" "}
      <PostureCard metrics={realisticPostureMetrics} />
    </div>
  );
}
