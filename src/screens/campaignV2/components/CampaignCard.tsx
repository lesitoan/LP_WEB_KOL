"use client";

import type { Campaign } from "@/types/api/campaignV2";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M9.7917 5.83333C9.7917 7.0975 8.7642 8.125 7.50003 8.125C6.23587 8.125 5.20837 7.0975 5.20837 5.83333C5.20837 5.5425 5.2683 5.26664 5.36747 5.00997C5.52913 5.1383 5.72419 5.22664 5.94669 5.22664C6.46919 5.22664 6.89334 4.80249 6.89334 4.27999C6.89334 4.05749 6.805 3.86243 6.67667 3.70077C6.93334 3.6016 7.2092 3.54167 7.50003 3.54167C8.7642 3.54167 9.7917 4.56917 9.7917 5.83333ZM14.6601 7.06421C13.6376 8.77588 11.3409 11.6667 7.50003 11.6667C3.6592 11.6667 1.3625 8.77588 0.34 7.06421C-0.113333 6.30588 -0.113333 5.36079 0.34 4.60246C1.3625 2.89079 3.6592 0 7.50003 0C11.3409 0 13.6376 2.89079 14.6601 4.60246C15.1134 5.36079 15.1134 6.30588 14.6601 7.06421ZM11.0417 5.83333C11.0417 3.88083 9.45337 2.29167 7.50003 2.29167C5.5467 2.29167 3.95837 3.88083 3.95837 5.83333C3.95837 7.78583 5.5467 9.375 7.50003 9.375C9.45337 9.375 11.0417 7.78583 11.0417 5.83333Z" 
        fill="currentColor" 
      />
    </svg>
  );
}
import {
  getEffectiveStatus,
  getStatusBadgeClass,
  getStatusLabel,
  getTimeLeft,
  padTime,
} from "./campaignV2Utils";
import { useEffect, useState } from "react";
import { formatVnd } from "@/lib/formatMoney";

interface Props {
  campaign: Campaign;
  isActive?: boolean;
  onViewCampaign: (campaignId: string) => void;
  onEditCampaign?: (campaign: Campaign) => void;
  onDeleteCampaign?: (campaignId: string) => void;
}

function useCountdown(targetTime: string, paused: boolean) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetTime));

  useEffect(() => {
    if (paused) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft(getTimeLeft(targetTime));
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetTime)), 1000);
    return () => clearInterval(timer);
  }, [targetTime, paused]);

  return timeLeft;
}

export default function CampaignCard({
  campaign,
  isActive,
  onViewCampaign,
  onEditCampaign,
  onDeleteCampaign,
}: Props) {
  const status = getEffectiveStatus(campaign);
  const isWaiting = status === "UPCOMING";
  const isPaused = status === "DRAFT" || status === "ENDED" || status === "CANCELLED";
  const targetTime = isWaiting ? campaign.startAt : campaign.endAt;
  const timeLeft = useCountdown(targetTime, isPaused);

  return (
    <div
      className={`w-full h-full flex flex-col rounded-[18px] overflow-hidden bg-[#171717] border transition-all ${
        isActive
          ? "border-[#F7F0A1] shadow-[0_0_0_1px_rgba(247,240,161,0.35)]"
          : "border-white/5"
      }`}
    >
      <div className="relative p-4 pb-8 bg-gradient-to-r from-[#9F6728] via-[#DAA440] to-[#FCF19D]">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-[18px] font-medium text-white/90 break-words flex-1 min-w-0">
            {campaign.name}
          </h4>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[14px] font-normal shrink-0 ${getStatusBadgeClass(status)}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {getStatusLabel(status)}
          </span>
        </div>
      </div>

      <div className="-mt-5 relative z-10 bg-[#171717] rounded-t-[18px] p-4 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[14px] font-normal text-[#8B8B93] mb-1">SL tham gia</p>
            <p className="text-[14px] font-semibold text-white">
              {campaign?.leaderboardSummary?.participantCount}
            </p>
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8B8B93] mb-1">Tổng</p>
            <p className="text-[14px] font-semibold text-white truncate">
              {formatVnd(campaign?.leaderboardSummary?.totalVolumeUsd ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8B8B93] mb-1">
              {isWaiting ? "Thời gian chờ" : "Thời gian còn lại"}
            </p>
            <p className="text-[14px] font-semibold text-white truncate">
              {padTime(timeLeft.hours)}:{padTime(timeLeft.minutes)}:{padTime(timeLeft.seconds)}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="h-px w-full bg-white/5 my-3" />

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onViewCampaign(campaign.id)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-[14px] font-semibold text-black hover:bg-gray-200 active:scale-[0.98]"
            >
              <EyeIcon className="w-[15px] h-[12px] shrink-0" />
              Xem chiến dịch
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit campaign"
                onClick={() => onEditCampaign?.(campaign)}
                className="h-9 w-9 shrink-0 hover:opacity-85 active:scale-95 transition-all"
              >
                <img
                  src="/images/campaign/Button_edit.png"
                  alt="Edit"
                  className="h-full w-full object-contain"
                />
              </button>
              <button
                type="button"
                aria-label="Delete campaign"
                onClick={() => onDeleteCampaign?.(campaign.id)}
                className="h-9 w-9 shrink-0 hover:opacity-85 active:scale-95 transition-all"
              >
                <img
                  src="/images/campaign/Button_delete.png"
                  alt="Delete"
                  className="h-full w-full object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
