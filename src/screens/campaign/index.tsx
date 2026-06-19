"use client";
import { useMemo, useState } from "react";
import { useGetCampaignsQuery, useGetCampaignLeaderboardQuery } from "@/services/api/campaignApi";
import CampaignHeader from "./components/CampaignHeader";
import CampaignHeroBanner from "./components/CampaignHeroBanner";
import CampaignLeaderboard from "./components/CampaignLeaderboard";
import CampaignHistory from "./components/CampaignHistory";
import CreateCampaignModal from "./components/create-modal/CreateCampaignModal";
import CampaignHeroBannerSkeleton from "@/components/skeletons/campaign/CampaignHeroBannerSkeleton";
import CampaignLeaderboardSkeleton from "@/components/skeletons/campaign/CampaignLeaderboardSkeleton";
import CampaignHistorySkeleton from "@/components/skeletons/campaign/CampaignHistorySkeleton";

export default function CampaignScreen() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. Fetch campaigns ACTIVE
  const { data: activeData, isLoading: isLoadingActive } = useGetCampaignsQuery({ 
    status: 'ACTIVE', 
    limit: 50 
  });
  
  // 2. Fetch campaigns CANCELLED
  const { data: historyData, isLoading: isLoadingHistory } = useGetCampaignsQuery({ 
    status: 'CANCELLED', 
    limit: 10
  });

  // 3. Fetch campaigns UPCOMING
  const { data: upcomingData, isLoading: isLoadingUpcoming } = useGetCampaignsQuery({ 
    status: 'UPCOMING', 
    limit: 50 
  });

  // 4. Fetch campaigns DRAFT
  const { data: draftData, isLoading: isLoadingDraft } = useGetCampaignsQuery({ 
    status: 'DRAFT', 
    limit: 50 
  });

  // Lọc ra campaign ACTIVE mới nhất
  const activeCampaign = useMemo(() => {
    if (!activeData?.items || activeData.items.length === 0) return null;
    return [...activeData.items].sort(
      (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
    )[0];
  }, [activeData]);

  // Gộp tất cả campaign cho phần lịch sử
  const allCampaigns = useMemo(() => {
    const active = activeData?.items ?? [];
    const ended = historyData?.items ?? [];
    const upcoming = upcomingData?.items ?? [];
    const draft = draftData?.items ?? [];
    return [...active, ...ended, ...upcoming, ...draft].sort(
      (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
    );
  }, [activeData, historyData, upcomingData, draftData]);

  // 5. Fetch Leaderboard nếu có activeCampaign
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useGetCampaignLeaderboardQuery(
    activeCampaign?.id ?? "", 
    { skip: !activeCampaign?.id } 
  );

  const leaderboard = leaderboardData ?? [];

  // Loading states cho từng phần
  const isHeroLoading = isLoadingActive;
  const isLeaderboardLoading = isLoadingActive || isLoadingLeaderboard;
  const isHistoryLoading = isLoadingActive || isLoadingHistory || isLoadingUpcoming || isLoadingDraft;

  return (
    <div className="animate-fade-in">
      <CampaignHeader onCreateClick={() => setIsCreateModalOpen(true)} />

      {/* Hero Banner */}
      {isHeroLoading ? (
        <CampaignHeroBannerSkeleton />
      ) : activeCampaign ? (
        <>
          <CampaignHeroBanner 
            campaign={activeCampaign} 
            leaderboard={leaderboard}
          />

          {/* Leaderboard */}
          <h3 className="text-[15px] font-semibold mb-4 text-white mt-8">Bảng xếp hạng</h3>
          {isLeaderboardLoading ? (
            <CampaignLeaderboardSkeleton />
          ) : (
            <CampaignLeaderboard 
              leaderboard={leaderboard} 
              rewards={activeCampaign.rewards} 
            />
          )}
        </>
      ) : (
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-10 text-center text-muted-foreground mb-8">
          Chưa có chiến dịch nào đang diễn ra.
        </div>
      )}

      {/* History */}
      {isHistoryLoading ? (
        <CampaignHistorySkeleton />
      ) : allCampaigns.length > 0 ? (
        <CampaignHistory campaigns={allCampaigns} />
      ) : null}

      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}