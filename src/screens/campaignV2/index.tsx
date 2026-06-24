"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeleteCampaignMutation, useGetCampaignByIdQuery, useGetCampaignsQuery } from "@/services/api/campaignApiV2";
import type { Campaign, CampaignCounts, CampaignHistoryFilter, GetCampaignsQuery } from "@/types/api/campaignV2";
import CampaignSummaryBanner from "./components/CampaignSummaryBanner";
import CampaignLeaderboardSection from "./components/CampaignLeaderboardSection";
import CampaignHistoryScroller from "./components/CampaignHistoryScroller";
import CampaignHeader from "./components/CampaignHeader";
import EmptyCampaign from "./components/EmptyCampaign";
import CreateCampaignModal from "./components/popupModel/CreateCampaignModal";
import EditCampaignModal from "./components/popupModel/EditCampaignModal";
import CampaignSummaryBannerSkeleton from "../../components/skeletons/campaignV2/CampaignSummaryBannerSkeleton";
import CampaignLeaderboardSectionSkeleton from "../../components/skeletons/campaignV2/CampaignLeaderboardSectionSkeleton";
import CampaignHistoryScrollerSkeleton from "../../components/skeletons/campaignV2/CampaignHistoryScrollerSkeleton";
import { getCountsFromCampaigns, getEmptyCounts } from "./components/campaignV2Utils";
import { usePopup } from "@/hooks/usePopup";

const CAMPAIGN_LIST_LIMIT = 100;
const VALID_FILTERS: CampaignHistoryFilter[] = [
  "ALL",
  "ACTIVE",
  "UPCOMING",
  "DRAFT",
  "ENDED",
  "CANCELLED",
];

function parseFilter(value: string | null): CampaignHistoryFilter {
  return VALID_FILTERS.includes(value as CampaignHistoryFilter)
    ? (value as CampaignHistoryFilter)
    : "ALL";
}

export default function CampaignScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showConfirm, Popup } = usePopup();
  const [deleteCampaign] = useDeleteCampaignMutation();

  const initialFilter = useMemo(() => parseFilter(searchParams.get("status")), []);
  const initialCampaignId = useMemo(() => searchParams.get("campaignId"), []);

  const [activeFilter, setActiveFilter] = useState<CampaignHistoryFilter>("ALL");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaignId);
  const [allCounts, setAllCounts] = useState<CampaignCounts>(() => getEmptyCounts());
  const [hasLoadedInitialAll, setHasLoadedInitialAll] = useState(false);
  const [hasAppliedInitialFilter, setHasAppliedInitialFilter] = useState(initialFilter === "ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const replaceCampaignUrl = useCallback(
    (filter: CampaignHistoryFilter, campaignId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (filter === "ALL") {
        params.delete("status");
      } else {
        params.set("status", filter);
      }

      if (campaignId) {
        params.set("campaignId", campaignId);
      } else {
        params.delete("campaignId");
      }

      const queryString = params.toString();
      if (queryString === searchParams.toString()) return;

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const campaignListQuery: GetCampaignsQuery = useMemo(() => {
    const query: GetCampaignsQuery = { page: 1, limit: CAMPAIGN_LIST_LIMIT };
    if (activeFilter !== "ALL") {
      query.status = activeFilter;
    }
    return query;
  }, [activeFilter]);

  const { data: campaignsData, isLoading, isFetching } = useGetCampaignsQuery(campaignListQuery);
  const { data: selectedCampaign, isLoading: isDetailLoading, isFetching: isDetailFetching } =
    useGetCampaignByIdQuery(selectedCampaignId ?? "", {
      skip: !selectedCampaignId,
    });

  const campaigns = campaignsData?.items ?? [];
  const firstCampaignId = campaigns[0]?.id ?? null;
  const isInitialAllResponse = activeFilter === "ALL" && !isLoading && !!campaignsData;
  const hasNoCampaigns = hasLoadedInitialAll && allCounts.ALL === 0;
  const isPreparingInitialFilter = !hasAppliedInitialFilter;

  useEffect(() => {
    if (!isInitialAllResponse) return;

    setAllCounts(getCountsFromCampaigns(campaigns));
    setHasLoadedInitialAll(true);

    if (!hasAppliedInitialFilter) {
      setActiveFilter(initialFilter);
      setHasAppliedInitialFilter(true);
    }
  }, [campaigns, hasAppliedInitialFilter, initialFilter, isInitialAllResponse]);

  useEffect(() => {
    if (isPreparingInitialFilter || isLoading || !campaignsData) return;

    if (!firstCampaignId) {
      setSelectedCampaignId(null);
      replaceCampaignUrl(activeFilter, null);
      return;
    }

    const selectedExistsInCurrentList = campaigns.some((campaign) => campaign.id === selectedCampaignId);
    const nextCampaignId = selectedExistsInCurrentList ? selectedCampaignId : firstCampaignId;

    if (nextCampaignId !== selectedCampaignId) {
      setSelectedCampaignId(nextCampaignId);
    }
    replaceCampaignUrl(activeFilter, nextCampaignId);
  }, [
    activeFilter,
    campaigns,
    campaignsData,
    firstCampaignId,
    isLoading,
    isPreparingInitialFilter,
    replaceCampaignUrl,
    selectedCampaignId,
  ]);

  const handleFilterChange = (filter: CampaignHistoryFilter) => {
    if ((allCounts[filter] ?? 0) === 0) return;
    setActiveFilter(filter);
    setSelectedCampaignId(null);
    replaceCampaignUrl(filter, null);
  };

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    replaceCampaignUrl(activeFilter, campaignId);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    const confirmed = await showConfirm({
      title: "Xóa chiến dịch",
      description: "Bạn có chắc chắn muốn xóa chiến dịch này không? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      destructive: true,
    });

    if (confirmed) {
      try {
        await deleteCampaign(campaignId).unwrap();
      } catch (err: any) {
        console.error("Xóa chiến dịch thất bại:", err);
      }
    }
  };

  const renderHistory = () => (
    <CampaignHistoryScroller
      campaigns={campaigns}
      counts={allCounts}
      activeFilter={activeFilter}
      selectedCampaignId={selectedCampaignId}
      isFetching={isFetching}
      onFilterChange={handleFilterChange}
      onSelectCampaign={handleSelectCampaign}
      onEditCampaign={handleEditCampaign}
      onDeleteCampaign={handleDeleteCampaign}
    />
  );

  return (
    <div className="animate-fade-in flex flex-col min-h-[calc(100dvh-104px)]">
      <CampaignHeader
        hasNoCampaigns={hasNoCampaigns}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {(isLoading && activeFilter === "ALL") || isPreparingInitialFilter ? (
        <>
          <CampaignSummaryBannerSkeleton />
          <CampaignLeaderboardSectionSkeleton />
          <CampaignHistoryScrollerSkeleton />
        </>
      ) : hasNoCampaigns ? (
        <EmptyCampaign onCreateClick={() => setIsCreateModalOpen(true)} />
      ) : selectedCampaignId ? (
        <>
          {isDetailLoading || isDetailFetching || !selectedCampaign ? (
            <CampaignSummaryBannerSkeleton />
          ) : (
            <CampaignSummaryBanner campaign={selectedCampaign} />
          )}
          <CampaignLeaderboardSection
            campaign={selectedCampaign}
            isCampaignLoading={isDetailLoading || isDetailFetching}
          />
          {renderHistory()}
        </>
      ) : (
        renderHistory()
      )}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditCampaignModal
        isOpen={!!editingCampaign}
        campaign={editingCampaign}
        onClose={() => setEditingCampaign(null)}
      />
      <Popup />
    </div>
  );
}
