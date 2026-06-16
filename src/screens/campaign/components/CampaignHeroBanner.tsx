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
        <div className="shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left lg:ml-[18%] w-full lg:w-auto">
          <p className="font-semibold tracking-[0.1em] uppercase text-white mb-0.5 drop-shadow-md text-[clamp(12px,3vw,21px)]">
            {campaign.name}
          </p>
          <h2 className="font-extrabold text-[#F5C35A] tracking-tight leading-none drop-shadow-md text-[clamp(24px,6vw,40px)]">
            {formatMonthLabel(campaign.startAt)}
          </h2>
        </div>

        {/* Stats Block */}
        <div className="flex flex-row items-center justify-between bg-[#1C1C1E]/90 lg:bg-[#1C1C1E]/95 backdrop-blur-md border border-white/5 rounded-2xl py-3 px-4 md:px-8 md:py-4 gap-4 md:gap-8 shadow-xl w-full lg:w-auto">
          
          {/* Stat 1: Participants */}
          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 mb-1">
              <img src="/images/campaign/Ic_filled_users-group.png" alt="Participants" className="w-[12px] h-[12px] md:w-[18px] md:h-[18px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium truncate text-[clamp(10px,2vw,12px)]">Participants</p>
            </div>
            <p className="font-bold text-white leading-none font-geist-mono truncate text-[clamp(14px,3.5vw,22px)]">
              {participantCount}
            </p>
          </div>

          <div className="h-8 md:h-12 w-px bg-white/10 shrink-0" />

          {/* Stat 2: Total Volume */}
          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 mb-1">
              <img src="/images/campaign/Ic_filled_bitcoin-circle.png" alt="Total Volume" className="w-[12px] h-[12px] md:w-[18px] md:h-[18px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium truncate text-[clamp(10px,2vw,12px)]">Tổng volume</p>
            </div>
            <p className="font-bold text-white leading-none font-geist-mono truncate text-[clamp(14px,3.5vw,22px)]">
              {formatVND(totalVolume)}
            </p>
          </div>

          <div className="h-8 md:h-12 w-px bg-white/10 shrink-0" />

          {/* Stat 3: Live Countdown */}
          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 mb-1">
              <img src="/images/campaign/Ic_filled_alarm-clock.png" alt="Remaining Time" className="w-[12px] h-[12px] md:w-[18px] md:h-[18px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium truncate text-[clamp(10px,2vw,12px)]">Thời gian còn lại</p>
            </div>
            <div className="font-bold text-white leading-none tracking-wider font-geist-mono truncate text-[clamp(14px,3.5vw,22px)]">
              {pad(hours)} : {pad(minutes)} : {pad(seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}