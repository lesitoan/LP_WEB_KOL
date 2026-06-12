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

// Format ngày
function formatMonthLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.getMonth() + 1;
  return `THÁNG ${month}`;
}

// Component
export default function CampaignHeroBanner({ campaign, leaderboard }: Props) {
  const endDate = useMemo(() => new Date(campaign.endAt), [campaign.endAt]);
  const { hours, minutes, seconds } = useCountdown(endDate);

  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];

  // Ưu tiên lấy số liệu tổng từ backend (nếu có), nếu không có mới fallback tính từ leaderboard (bảng rank có thể bị limit)
  const participantCount = campaign.participantCount ?? safeLeaderboard.length;
  const totalVolume = useMemo(() => {
    if (campaign.totalVolumeUsd !== undefined) return campaign.totalVolumeUsd;
    return safeLeaderboard.reduce((sum, entry) => {
      return sum + parseFloat(entry.usdVolume || "0");
    }, 0);
  }, [safeLeaderboard, campaign.totalVolumeUsd]);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 min-h-[140px] flex items-center bg-[#13110C] border border-[#2A2416]">
      {/* ── Ảnh BG ── */}
      <img
        src={TROPHY_SRC}
        alt="Trophy Background"
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-full object-cover object-left pointer-events-none select-none"
      />

      {/* ── Content Wrapper ── */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between w-full px-4 md:px-6 py-4 md:py-6 gap-6">
        
        {/* Title */}
        <div className="shrink-0 ml-[20%] md:ml-[18%]">
          <p className="text-[16px] md:text-[21px] font-semibold tracking-[0.1em] uppercase text-white mb-1">
            {campaign.name}
          </p>
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#F5C35A] tracking-tight leading-none">
            {formatMonthLabel(campaign.startAt)}
          </h2>
        </div>

        {/* Stats Block */}
        <div className="flex flex-wrap md:flex-nowrap items-center bg-[#1C1C1E]/95 backdrop-blur-md border border-white/5 rounded-2xl px-4 md:px-8 py-4 gap-4 md:gap-8 shadow-xl">
          
          {/* Participants — đếm từ leaderboard.length */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <img src="/images/campaign/Ic_filled_users-group.png" alt="Participants" className="w-[18px] h-[18px] shrink-0 object-contain" />
              <p className="text-[12px] text-[#8B8B93] font-medium">Participants</p>
            </div>
            <p className="text-[22px] font-bold text-white leading-none">{participantCount}</p>
          </div>

          <div className="h-12 w-px bg-white/10 shrink-0" />

          {/* Total volume — tính bằng reduce từ leaderboard */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <img src="/images/campaign/Ic_filled_bitcoin-circle.png" alt="Total Volume" className="w-[18px] h-[18px] shrink-0 object-contain" />
              <p className="text-[12px] text-[#8B8B93] font-medium">Tổng</p>
            </div>
            <p className="text-[22px] font-bold text-white leading-none">{formatVND(totalVolume)}</p>
          </div>

          <div className="h-12 w-px bg-white/10 shrink-0" />

          {/* Live countdown — tính từ campaign.endAt */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <img src="/images/campaign/Ic_filled_alarm-clock.png" alt="Remaining Time" className="w-[18px] h-[18px] shrink-0 object-contain" />
              <p className="text-[12px] text-[#8B8B93] font-medium">Thời gian còn lại</p>
            </div>
            <div className="text-[22px] font-bold text-white leading-none tracking-wider">
              {pad(hours)} : {pad(minutes)} : {pad(seconds)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
