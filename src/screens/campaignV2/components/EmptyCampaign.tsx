"use client";

import { Plus } from "lucide-react";

interface Props {
  onCreateClick?: () => void;
}

export default function EmptyCampaign({ onCreateClick }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <img
        src="/images/campaign/not_found_campaign_icon.svg"
        alt="No campaigns found"
        className="w-[100px] h-[100px] mb-5 object-contain"
      />
      <h2 className="text-[32px] font-medium text-white mb-2">
        Hiện chưa có chiến dịch nào
      </h2>
      <p className="text-[14px] font-normal text-[#ECEDEE] mb-6">
        Bạn hãy tạo chiến dịch mới để bắt đầu hành trình đua volume đầy hấp dẫn nhé
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F7F0A1] px-4 py-2.5 text-[14px] font-bold text-black hover:brightness-105 active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        Tạo campaign
      </button>
    </div>
  );
}

