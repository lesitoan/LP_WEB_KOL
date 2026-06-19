"use client";

import { useEffect, useMemo, useState } from "react";
import type { CampaignData, LeaderboardEntry } from "@/types/api/campaign";

interface Props {
  campaign: CampaignData;
  leaderboard: LeaderboardEntry[];
}

const TROPHY_SRC = "/images/campaign/campaign-trophy.png";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function useCountdown(target: Date) {
  const [time, setTime] = useState(() => calcTimeLeft(target));

  useEffect(() => {
    setTime(calcTimeLeft(target));
    const id = setInterval(() => setTime(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

// Format số volume VNĐ
function formatVND(volumeStr: string | number): string {
  const usd = typeof volumeStr === "string" ? parseFloat(volumeStr || "0") : volumeStr;
  const vnd = usd * 25000;
  const viFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });
  if (vnd >= 1_000_000_000) return `${viFormatter.format(vnd / 1_000_000_000)} tỷ VNĐ`;
  if (vnd >= 1_000_000) return `${viFormatter.format(vnd / 1_000_000)} triệu VNĐ`;
  return `${Math.round(vnd).toLocaleString("vi-VN")} VNĐ`;
}

function formatMonthLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.getMonth() + 1;
  return `THÁNG ${month}`;
}

export default function CampaignHeroBanner({ campaign, leaderboard }: Props) {
  const endDate = useMemo(() => new Date(campaign.endAt), [campaign.endAt]);
  const { hours, minutes, seconds } = useCountdown(endDate);

  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];

  const participantCount = campaign.participantCount ?? safeLeaderboard.length;
  const totalVolume = useMemo(() => {
    if (campaign.totalVolumeUsd !== undefined) return campaign.totalVolumeUsd;
    return safeLeaderboard.reduce((sum, entry) => {
      return sum + parseFloat(entry.usdVolume || "0");
    }, 0);
  }, [safeLeaderboard, campaign.totalVolumeUsd]);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 bg-[#13110C] border border-[#2A2416] flex flex-col justify-center min-h-[140px] md:min-h-[160px]">
      
      {/* Ảnh BG */}
      <img
        src={TROPHY_SRC}
        alt="Trophy Background"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-left opacity-60 lg:opacity-100 pointer-events-none select-none"
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between w-full p-4 md:px-6 md:py-6 gap-4">
        
        {/* Title */}
        <div className="shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left lg:ml-[15%] xl:ml-[18%] w-full lg:w-auto">
          <p className="font-semibold tracking-[0.1em] uppercase text-white mb-1.5 md:mb-2 drop-shadow-md text-[clamp(12px,3vw,21px)] lg:text-[14px] xl:text-[21px]">
            {campaign.name}
          </p>
          <h2 className="font-extrabold text-[#F5C35A] tracking-tight leading-none drop-shadow-md text-[clamp(24px,6vw,40px)] lg:text-[24px] xl:text-[40px]">
            {formatMonthLabel(campaign.startAt)}
          </h2>
        </div>

        {/* Stats Block */}
        <div className="flex flex-row items-center justify-between bg-[#1C1C1E]/90 lg:bg-[#1C1C1E]/95 backdrop-blur-md border border-white/5 rounded-[11px] py-4 px-2.5 sm:px-4 md:px-4 md:py-4 lg:px-4 lg:py-5 xl:px-8 xl:py-7 gap-2 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-8 shadow-xl w-full lg:w-auto">
          
          {/* Stat 1: Participants */}
          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 xl:gap-2 mb-2 lg:mb-1.5 xl:mb-3">
              <img src="/images/campaign/Ic_filled_users-group.png" alt="Participants" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[20px] xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[12px] xl:text-[14px] whitespace-nowrap">Participants</p>
            </div>
            <p className="font-bold text-white leading-none truncate text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[22px]">
              {participantCount}
            </p>
          </div>

          <div className="h-10 md:h-10 lg:h-10 xl:h-14 w-px bg-white/10 shrink-0" />

          {/* Stat 2: Total Volume */}
          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 xl:gap-2 mb-2 lg:mb-1.5 xl:mb-3">
              <img src="/images/campaign/Ic_filled_bitcoin-circle.png" alt="Total Volume" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[20px] xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[12px] xl:text-[14px] whitespace-nowrap">
                <span className="hidden sm:inline">Tổng </span>volume
              </p>
            </div>
            <p className="font-bold text-white leading-none truncate text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[22px]">
              {formatVND(totalVolume)}
            </p>
          </div>

          <div className="h-10 md:h-10 lg:h-10 xl:h-14 w-px bg-white/10 shrink-0" />

          {/* Stat 3: Live Countdown */}
          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 xl:gap-2 mb-2 lg:mb-1.5 xl:mb-3">
              <img src="/images/campaign/Ic_filled_alarm-clock.png" alt="Remaining Time" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[20px] xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[12px] xl:text-[14px] whitespace-nowrap">
                <span className="hidden sm:inline">Thời gian </span>còn lại
              </p>
            </div>
            <div className="font-bold text-white leading-none tracking-wider truncate text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[22px]">
              {pad(hours)} : {pad(minutes)} : {pad(seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}