"use client";

import { toast } from "@/hooks/useToast";
import { useCreateCampaignMutation } from "@/services/api/campaignApiV2";
import CampaignFormModal from "./CampaignFormModal";
import { buildCreateCampaignPayload } from "./campaignFormMapper";
import type { CampaignFormValues } from "./schema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose }: Props) {
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();

  const handleSubmit = async (values: CampaignFormValues) => {
    try {
      await createCampaign(buildCreateCampaignPayload(values)).unwrap();
      toast({
        title: "Tạo chiến dịch thành công",
        description: "Chiến dịch đã được lưu dưới dạng bản nháp.",
        variant: "success",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Tạo chiến dịch thất bại",
        description: error?.data?.externalMessage || error?.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  return (
    <CampaignFormModal
      isOpen={isOpen}
      mode="create"
      isLoading={isLoading}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}
