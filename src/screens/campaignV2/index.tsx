"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useDeleteCampaignMutation,
  useGetCampaignByIdQuery,
  useGetCampaignsQuery,
  useUpdateCampaignMutation,
} from "@/services/api/campaignApiV2";
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
import { toast } from "@/hooks/useToast";

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
    : "ACTIVE";
}

export default function CampaignScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showConfirm, Popup } = usePopup();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [updateCampaign] = useUpdateCampaignMutation();

  const initialFilter = useMemo(() => parseFilter(searchParams.get("status")), []);
  const initialCampaignId = useMemo(() => searchParams.get("campaignId"), []);

  const [activeFilter, setActiveFilter] = useState<CampaignHistoryFilter>(initialFilter);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaignId);
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

      window.history.replaceState(null, "", queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, searchParams],
  );

  const campaignListQuery: GetCampaignsQuery = useMemo(() => {
    const query: GetCampaignsQuery = { page: 1, limit: CAMPAIGN_LIST_LIMIT };
    if (activeFilter !== "ALL") {
      query.status = activeFilter;
    }
    return query;
  }, [activeFilter]);

  const { data: campaignsData, isLoading, isFetching } = useGetCampaignsQuery(campaignListQuery);
  const { data: allCampaignsData } = useGetCampaignsQuery({ page: 1, limit: CAMPAIGN_LIST_LIMIT });
  const { data: selectedCampaign, isLoading: isDetailLoading, isFetching: isDetailFetching } =
    useGetCampaignByIdQuery(selectedCampaignId ?? "", {
      skip: !selectedCampaignId,
    });

  const campaigns = campaignsData?.items ?? [];
  const firstCampaignId = campaigns[0]?.id ?? null;

  const allCounts = useMemo(() => {
    return getCountsFromCampaigns(allCampaignsData?.items ?? []);
  }, [allCampaignsData]);

  const hasLoadedInitialAll = !!allCampaignsData;
  const hasNoCampaigns = hasLoadedInitialAll && allCounts.ALL === 0;

  useEffect(() => {
    if (!hasLoadedInitialAll || isLoading || !campaignsData) return;

    if (!firstCampaignId) {
      setSelectedCampaignId(null);
      if (activeFilter !== "ALL") {
        setActiveFilter("ALL");
        replaceCampaignUrl("ALL", null);
      } else {
        replaceCampaignUrl(activeFilter, null);
      }
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
    hasLoadedInitialAll,
    replaceCampaignUrl,
    selectedCampaignId,
  ]);

  const handleFilterChange = (filter: CampaignHistoryFilter) => {
    if ((allCounts[filter] ?? 0) === 0) return;
    setActiveFilter(filter);
    replaceCampaignUrl(filter, null);
  };

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    replaceCampaignUrl(activeFilter, campaignId);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handlePublishCampaign = async (campaign: Campaign) => {
    const nextStatus = new Date(campaign.startAt).getTime() > Date.now() ? "UPCOMING" : "ACTIVE";
    const confirmed = await showConfirm({
      title: "Phát hành chiến dịch",
      description:
        nextStatus === "UPCOMING"
          ? "Chiến dịch sẽ được chuyển sang trạng thái sắp diễn ra."
          : "Chiến dịch sẽ được chuyển sang trạng thái đang diễn ra.",
      confirmText: "Phát hành",
      cancelText: "Hủy",
    });

    if (!confirmed) return;

    try {
      await updateCampaign({
        campaignId: campaign.id,
        body: { status: nextStatus },
      }).unwrap();
      toast({
        title: "Phát hành chiến dịch thành công",
        description: "Trạng thái chiến dịch đã được cập nhật.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Phát hành chiến dịch thất bại",
        description: err?.data?.externalMessage || err?.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
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
        toast({
          title: "Xóa chiến dịch thành công",
          description: "Chiến dịch đã được xóa khỏi hệ thống.",
          variant: "success",
        });
      } catch (err: any) {
        toast({
          title: "Xóa chiến dịch thất bại",
          description: err?.data?.externalMessage || err?.message || "Đã xảy ra lỗi",
          variant: "destructive",
        });
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
      onPublishCampaign={handlePublishCampaign}
    />
  );

  return (
    <div className="animate-fade-in flex flex-col min-h-[calc(100dvh-104px)]">
      <CampaignHeader
        hasNoCampaigns={hasNoCampaigns}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {!hasLoadedInitialAll ? (
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
