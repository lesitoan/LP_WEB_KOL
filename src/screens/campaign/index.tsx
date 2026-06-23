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
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

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
  const newestActiveCampaign = useMemo(() => {
    if (!activeData?.items || activeData.items.length === 0) return null;
    return [...activeData.items].sort((a, b) => {
      const dateA = (a as any).createdAt || (a as any).created_at || a.startAt;
      const dateB = (b as any).createdAt || (b as any).created_at || b.startAt;
      const timeDiff = new Date(dateB).getTime() - new Date(dateA).getTime();
      if (timeDiff !== 0) return timeDiff;
      return b.id.localeCompare(a.id);
    })[0];
  }, [activeData]);

  // Gộp tất cả campaign cho phần lịch sử
  const allCampaigns = useMemo(() => {
    const active = activeData?.items ?? [];
    const ended = historyData?.items ?? [];
    const upcoming = upcomingData?.items ?? [];
    const draft = draftData?.items ?? [];
    return [...active, ...ended, ...upcoming, ...draft].sort((a, b) => {
      const dateA = (a as any).createdAt || (a as any).created_at || a.startAt;
      const dateB = (b as any).createdAt || (b as any).created_at || b.startAt;
      const timeDiff = new Date(dateB).getTime() - new Date(dateA).getTime();
      if (timeDiff !== 0) return timeDiff;
      return b.id.localeCompare(a.id);
    });
  }, [activeData, historyData, upcomingData, draftData]);

  // Campaign hiển thị trên banner (Được chọn hoặc mặc định)
  const displayedCampaign = useMemo(() => {
    if (selectedCampaignId) {
      const found = allCampaigns.find(c => c.id === selectedCampaignId);
      if (found) return found;
    }
    return newestActiveCampaign;
  }, [selectedCampaignId, newestActiveCampaign, allCampaigns]);

  // 5. Fetch Leaderboard nếu có displayedCampaign
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useGetCampaignLeaderboardQuery(
    displayedCampaign?.id ?? "", 
    { skip: !displayedCampaign?.id } 
  );

  const leaderboard = leaderboardData || [];

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
      ) : displayedCampaign ? (
        <>
          <CampaignHeroBanner 
            campaign={displayedCampaign} 
            leaderboard={leaderboard}
          />

          {isLeaderboardLoading ? (
            <CampaignLeaderboardSkeleton />
          ) : (
            <CampaignLeaderboard 
              leaderboard={leaderboard} 
              rewards={displayedCampaign?.rewards || []} 
              campaign={displayedCampaign}
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
        <CampaignHistory 
          campaigns={allCampaigns} 
          activeCampaignId={displayedCampaign?.id}
          onViewCampaign={(id) => {
            setSelectedCampaignId(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : null}

      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}