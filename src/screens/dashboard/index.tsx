"use client";
import HomeHeader from "./components/HomeHeader";
import TierProgressCard from "./components/TierProgressCard";
import KpiGrid from "./components/KpiGrid";
import VolumeMembersChart from "./components/VolumeMembersChart";
import ActivityFeed from "./components/ActivityFeed";
import NextActions from "./components/NextActions";

export default function HomeScreen() {
  return (
    <div className="animate-fade-in">
      <HomeHeader />
      <TierProgressCard />
      <KpiGrid />

      <div className="grid grid-cols-[1.6fr_1fr] gap-4 mb-5 max-lg:grid-cols-1">
        <VolumeMembersChart />
        <ActivityFeed />
      </div>

      <NextActions />
    </div>
  );
}
