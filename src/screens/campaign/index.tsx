"use client";
import { useMemo, useState } from "react";
import { useGetCampaignsQuery, useGetCampaignLeaderboardQuery } from "@/services/api/campaignApi";
import CampaignHeader from "./components/CampaignHeader";
import CampaignHeroBanner from "./components/CampaignHeroBanner";
import CampaignLeaderboard from "./components/CampaignLeaderboard";
import CampaignHistory from "./components/CampaignHistory";
import CreateCampaignModal from "./components/create-modal/CreateCampaignModal";

export default function CampaignScreen() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. Fetch campaigns ACTIVE
  const { data: activeData, isLoading: isLoadingActive } = useGetCampaignsQuery({ 
    status: 'ACTIVE', 
    limit: 50 
  });
  
  // 2. Fetch campaigns ENDED
  const { data: historyData, isLoading: isLoadingHistory } = useGetCampaignsQuery({ 
    status: 'ENDED', 
    limit: 10
  });

  // Lọc ra campaign ACTIVE mới nhất
  const activeCampaign = useMemo(() => {
    if (!activeData?.items || activeData.items.length === 0) return null;
    return [...activeData.items].sort(
      (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
    )[0];
  }, [activeData]);

  // Gộp tất cả campaign (ACTIVE + ENDED) cho phần lịch sử
  const allCampaigns = useMemo(() => {
    const active = activeData?.items ?? [];
    const ended = historyData?.items ?? [];
    return [...active, ...ended].sort(
      (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
    );
  }, [activeData, historyData]);

  // 3. Fetch Leaderboard nếu có activeCampaign
  const { data: leaderboardData } = useGetCampaignLeaderboardQuery(
    activeCampaign?.id ?? "", 
    { skip: !activeCampaign?.id } 
  );


  if (isLoadingActive || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white font-medium text-[14px]">
        Đang tải dữ liệu chiến dịch...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <CampaignHeader onCreateClick={() => setIsCreateModalOpen(true)} />

      {activeCampaign ? (
        <>
          <CampaignHeroBanner 
            campaign={activeCampaign} 
            leaderboard={leaderboardData ?? []} 
          />
          <h3 className="text-[15px] font-semibold mb-4 text-white mt-8">Bảng xếp hạng</h3>
          <CampaignLeaderboard 
            leaderboard={leaderboardData ?? []} 
            rewards={activeCampaign.rewards} 
          />
        </>
      ) : (
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-10 text-center text-muted-foreground mb-8">
          Chưa có chiến dịch nào đang diễn ra.
        </div>
      )}

      {allCampaigns.length > 0 && (
        <CampaignHistory campaigns={allCampaigns} />
      )}

      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}