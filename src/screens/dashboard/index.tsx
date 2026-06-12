"use client";

import AttentionActivities from "./components/AttentionActivities";
import DashboardFilters from "./components/DashboardFilters";
import DashboardHeader from "./components/DashboardHeader";
import OverviewSection from "./components/OverviewSection";
import ReferralShareCard from "./components/ReferralShareCard";
import TierSummaryCard from "./components/TierSummaryCard";
import VolumeByGroupChart from "./components/VolumeByGroupChart";

export default function HomeScreen() {
  return (
    <div className="relative min-h-[calc(100dvh-6.5rem)] overflow-hidden pb-8">
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 top-16 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.36)_0%,rgba(0,0,0,0.74)_22%,#000_62%,#000_100%),linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.24)_48%,rgba(0,0,0,0.9)_100%),url('/images/dashboard/dashboard_bg.png')] bg-cover bg-top bg-no-repeat md:left-[232px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 top-16 z-[2] bg-[url('/images/bg.png')] bg-left-top bg-no-repeat [background-size:680px_auto] md:left-[232px] max-sm:[background-size:520px_auto]" />

      <div className="relative z-[3] animate-fade-in">
        <DashboardHeader />
        <DashboardFilters />
        <TierSummaryCard />
        <OverviewSection />
        <VolumeByGroupChart />
        <div className="grid gap-4 lg:grid-cols-2">
          <AttentionActivities />
          <ReferralShareCard />
        </div>
      </div>
    </div>
  );
}
