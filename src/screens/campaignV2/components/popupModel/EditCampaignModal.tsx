"use client";

import { useMemo } from "react";
import { toast } from "@/hooks/useToast";
import { useUpdateCampaignMutation } from "@/services/api/campaignApiV2";
import type { Campaign } from "@/types/api/campaignV2";
import CampaignFormModal from "./CampaignFormModal";
import {
  buildChangedUpdateCampaignPayload,
  campaignToFormValues,
} from "./campaignFormMapper";
import type { CampaignFormValues } from "./schema";

interface Props {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCampaignModal({ campaign, isOpen, onClose }: Props) {
  const [updateCampaign, { isLoading }] = useUpdateCampaignMutation();
  const defaultValues = useMemo(() => campaignToFormValues(campaign), [campaign]);


  const handleSubmit = async (values: CampaignFormValues) => {
    if (!campaign) return;
    const body = buildChangedUpdateCampaignPayload(values, campaign);

    if (Object.keys(body).length === 0) {
      toast({
        title: "Không có thay đổi",
        description: "Bạn chưa thay đổi thông tin nào của chiến dịch.",
        variant: "default",
      });
      onClose();
      return;
    }

    try {
      await updateCampaign({
        campaignId: campaign.id,
        body,
      }).unwrap();
      toast({
        title: "Cập nhật chiến dịch thành công",
        description: "Thông tin chiến dịch đã được lưu.",
        variant: "success",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Cập nhật chiến dịch thất bại",
        description: error?.data?.externalMessage || error?.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  if (!isOpen || !campaign) return null;

  return (
    <CampaignFormModal
      key={campaign.id}
      isOpen={isOpen}
      mode="edit"
      defaultValues={defaultValues}
      isLoading={isLoading}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}
