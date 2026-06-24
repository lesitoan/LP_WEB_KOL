"use client";

import { useEffect, useState } from "react";
import { useGetCampaignLeaderboardQuery } from "@/services/api/campaignApiV2";
import type { Campaign, CampaignRankingType } from "@/types/api/campaignV2";
import CampaignLeaderboardSectionSkeleton from "../../../components/skeletons/campaignV2/CampaignLeaderboardSectionSkeleton";
import CampaignLeaderboardTop from "./CampaignLeaderboardTop";
import CampaignLeaderboardTable from "./CampaignLeaderboardTable";

interface Props {
  campaign?: Campaign;
  isCampaignLoading?: boolean;
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function TradeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default function CampaignLeaderboardSection({ campaign, isCampaignLoading }: Props) {
  const { data: leaderboardData, isLoading: isLeaderboardLoading, isFetching: isLeaderboardFetching } =
    useGetCampaignLeaderboardQuery(
      { campaignId: campaign?.id ?? "", page: 1, limit: 100 },
      { skip: !campaign?.id },
    );

  const campaignRankingType = campaign?.rankingType ?? "TOP_VOLUME";
  const [activeTab, setActiveTab] = useState<CampaignRankingType>(campaignRankingType);

  useEffect(() => {
    setActiveTab(campaignRankingType);
  }, [campaignRankingType, campaign?.id]);

  const isLoading =
    Boolean(isCampaignLoading) ||
    isLeaderboardLoading ||
    isLeaderboardFetching ||
    !campaign ||
    !leaderboardData;

  if (isLoading) {
    return <CampaignLeaderboardSectionSkeleton />;
  }

  const leaderboard = leaderboardData.items;
  const podium = leaderboard.filter((entry) => entry.rank <= 3).sort((a, b) => a.rank - b.rank);
  const rest = leaderboard.filter((entry) => entry.rank > 3);

  return (
    <div>
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-[24px] font-semibold text-white mb-4">Bảng xếp hạng</h3>
        <div className="inline-flex p-1 bg-[#121214] border border-white/10 rounded-full select-none">
          <div
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[16px] font-medium transition-all ${
              activeTab === "TOP_VOLUME"
                ? "bg-[#27272A] text-white shadow-sm"
                : "text-[#8B8B93]/50 cursor-default"
            }`}
          >
            <BarChartIcon className={`w-[16px] h-[16px] ${activeTab === "TOP_VOLUME" ? "text-[#FFD255]" : "text-[#8B8B93]/50"}`} />
            Top Volume
          </div>
          <div
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[16px] font-medium transition-all ${
              activeTab === "TOP_TRADE_COUNT"
                ? "bg-[#27272A] text-white shadow-sm"
                : "text-[#8B8B93]/50 cursor-default"
            }`}
          >
            <TradeIcon className={`w-[16px] h-[16px] ${activeTab === "TOP_TRADE_COUNT" ? "text-[#FFD255]" : "text-[#8B8B93]/50"}`} />
            Top Số lệnh trade
          </div>
        </div>
      </div>

      <CampaignLeaderboardTop
        entries={podium}
        rewards={campaign.rewards}
        rankingType={activeTab}
      />
      <CampaignLeaderboardTable entries={rest} rankingType={activeTab} />

      <div className="h-px w-full bg-white/10 mt-12 mb-8" />
    </div>
  );
}
