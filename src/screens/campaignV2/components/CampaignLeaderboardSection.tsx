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
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M18.9108 16.4274C19.0075 16.6608 18.9541 16.9299 18.775 17.1083L17.9417 17.9416C17.82 18.0633 17.66 18.1249 17.5 18.1249C17.34 18.1249 17.1799 18.0641 17.0583 17.9416C16.8824 17.7658 16.8333 17.5116 16.9108 17.2916H14.5833C13.5491 17.2916 12.7083 16.4508 12.7083 15.4166V14.9999C12.7083 14.6549 12.9883 14.3749 13.3333 14.3749C13.6783 14.3749 13.9583 14.6549 13.9583 14.9999V15.4166C13.9583 15.7616 14.2383 16.0416 14.5833 16.0416H18.3333C18.5858 16.0416 18.8141 16.1941 18.9108 16.4274ZM17.0833 12.2916H14.7566C14.8341 12.0716 14.785 11.8174 14.6091 11.6416C14.365 11.3974 13.9691 11.3974 13.7249 11.6416L12.8916 12.4749C12.7133 12.6532 12.6591 12.9224 12.7558 13.1557C12.8525 13.3891 13.0808 13.5416 13.3333 13.5416H17.0833C17.4283 13.5416 17.7083 13.8216 17.7083 14.1666V14.5833C17.7083 14.9283 17.9883 15.2083 18.3333 15.2083C18.6783 15.2083 18.9583 14.9283 18.9583 14.5833V14.1666C18.9583 13.1324 18.1175 12.2916 17.0833 12.2916ZM10.8333 14.1666C10.8333 14.3249 10.8417 14.4833 10.8583 14.6416C10.8667 14.6749 10.8749 14.7083 10.8749 14.7416C10.8749 14.8833 10.7583 14.9999 10.6166 14.9999H4.16663C2.49996 14.9999 1.66663 14.1666 1.66663 12.4999V5.83325C1.66663 4.16659 2.49996 3.33325 4.16663 3.33325H14.1666C15.8333 3.33325 16.6666 4.16659 16.6666 5.83325V9.98324C16.6666 10.1582 16.4999 10.2666 16.3333 10.2166C15.9166 10.0749 15.4666 9.99992 15 9.99992C12.7 9.99992 10.8333 11.8666 10.8333 14.1666ZM4.99996 9.16577C4.99996 8.70577 4.62663 8.33244 4.16663 8.33244C3.70663 8.33244 3.33329 8.70577 3.33329 9.16577C3.33329 9.62577 3.70663 9.99911 4.16663 9.99911C4.62663 9.99911 4.99996 9.62661 4.99996 9.16577ZM11.6666 9.16659C11.6666 7.78575 10.5475 6.66659 9.16663 6.66659C7.78579 6.66659 6.66663 7.78575 6.66663 9.16659C6.66663 10.5474 7.78579 11.6666 9.16663 11.6666C10.5475 11.6666 11.6666 10.5474 11.6666 9.16659Z" 
        fill="currentColor" 
      />
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
