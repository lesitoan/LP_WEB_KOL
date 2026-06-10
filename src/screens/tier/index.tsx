"use client";
import { useState } from "react";
import TierHeroCard from "./components/TierHeroCard";
import TierComparisonTable from "./components/TierComparisonTable";
import SignalTabs from "./components/SignalTabs";
import SignalFeed from "./components/SignalFeed";

export default function TierScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight mb-0.5">
            Tier & Quyền lợi
          </h1>
          <div className="text-[13px] text-muted-foreground">
            Theo dõi tiến độ lên tier và truy cập data/signal theo cấp
          </div>
        </div>
      </div>

      <TierHeroCard />

      <h2 className="text-lg font-semibold mb-4">So sánh các tier</h2>
      <TierComparisonTable />

      {/* <h2 className="text-lg font-semibold mb-4">
        📡 Data & Signal Feed <span className="text-muted-foreground text-sm font-normal">· ELITE access</span>
      </h2> */}
      {/* <SignalTabs activeTab={activeTab} onTabChange={setActiveTab} /> */}
      {/* <SignalFeed /> */}
    </div>
  );
}
