"use client";
import CampaignHeader from "./components/CampaignHeader";
import CampaignHeroBanner from "./components/CampaignHeroBanner";
import CampaignLeaderboard from "./components/CampaignLeaderboard";
import CampaignFooterActions from "./components/CampaignFooterActions";

export default function CampaignScreen() {
  return (
    <div className="animate-fade-in">
      <CampaignHeader />
      <CampaignHeroBanner />

      <h3 className="text-[15px] font-semibold mb-4">Bảng xếp hạng</h3>

      <CampaignLeaderboard />

      <CampaignFooterActions />
    </div>
  );
}
