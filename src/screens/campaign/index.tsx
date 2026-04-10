"use client";
import CampaignHeader from "./components/CampaignHeader";
import CampaignCountdown from "./components/CampaignCountdown";
import CampaignLeaderboard from "./components/CampaignLeaderboard";
import CampaignFooterActions from "./components/CampaignFooterActions";

export default function CampaignScreen() {
  return (
    <div className="animate-fade-in">
      <CampaignHeader />

      <div className="bg-surface-1 border border-border rounded-[14px] overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-[hsl(28_88%_60%/0.08)] to-transparent border-b border-border flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              🏆 Vua Volume Tháng 4 — Trang Anh
            </h2>
            <div className="flex items-center gap-3 text-[12.5px] text-muted-foreground flex-wrap">
              <span>📊 Top Volume</span>
              <span>·</span>
              <span>🎯 142 participants</span>
              <span>·</span>
              <span>💰 Tổng vol: $42.8M</span>
              <span>·</span>
              <span>🔄 Cập nhật 14:32</span>
            </div>
          </div>
          <CampaignCountdown />
        </div>

        <CampaignLeaderboard />

        <CampaignFooterActions />
      </div>
    </div>
  );
}
