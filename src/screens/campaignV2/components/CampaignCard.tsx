"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Campaign } from "@/types/api/campaignV2";
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

export default function CampaignCard({ campaign, isActive, onViewCampaign, onDeleteCampaign }: Props) {
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
          <h4 className="text-[15px] font-semibold text-white/90 break-words flex-1 min-w-0">
            {campaign.name}
          </h4>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shrink-0 ${getStatusBadgeClass(status)}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {getStatusLabel(status)}
          </span>
        </div>
      </div>

      <div className="-mt-5 relative z-10 bg-[#171717] rounded-t-[18px] p-4 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1">SL tham gia</p>
            <p className="text-[13px] font-bold text-white">
              {campaign?.leaderboardSummary?.participantCount}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1">Tổng</p>
            <p className="text-[13px] font-bold text-white truncate">
              {formatVnd(campaign?.leaderboardSummary?.totalVolumeUsd ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1">
              {isWaiting ? "Thời gian chờ" : "Thời gian còn lại"}
            </p>
            <p className="text-[13px] font-bold text-white truncate">
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
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-black hover:bg-gray-200 active:scale-[0.98]"
            >
              <Eye className="h-3.5 w-3.5" />
              Xem chiến dịch
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit campaign"
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/5"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete campaign"
                onClick={() => onDeleteCampaign?.(campaign.id)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/5"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
