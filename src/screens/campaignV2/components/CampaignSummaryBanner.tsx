"use client";

import { useEffect, useMemo, useState } from "react";
import type { Campaign } from "@/types/api/campaignV2";
import {
  getEffectiveStatus,
  getTimeLeft,
  padTime,
} from "./campaignV2Utils";
import { formatVnd } from "@/lib/formatMoney";

interface Props {
  campaign: Campaign;
}

const BG_SRC = "/images/campaign/campaign-trophy.png";
const TROPHY_SRC = "/images/campaign/trophy_baner.svg";

function getTitleFontClass(name: string) {
  const len = name?.length ?? 0;
  if (len <= 15) {
    return "text-[28px] sm:text-[36px] lg:text-[32px] xl:text-[40px]";
  }
  if (len <= 30) {
    return "text-[22px] sm:text-[28px] lg:text-[24px] xl:text-[32px]";
  }
  return "text-[18px] sm:text-[22px] lg:text-[18px] xl:text-[24px]";
}

function getTitleContainerClass(name: string) {
  const len = name?.length ?? 0;
  const base = "shrink-0 lg:shrink lg:min-w-0 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-0 lg:flex-1";
  if (len > 30) {
    return `${base} lg:ml-[130px] xl:ml-[160px]`;
  }
  if (len > 15) {
    return `${base} lg:ml-[150px] xl:ml-[190px]`;
  }
  return `${base} lg:ml-[180px] xl:ml-[220px]`;
}

export default function CampaignSummaryBanner({ campaign }: Props) {
  const status = useMemo(() => getEffectiveStatus(campaign), [campaign]);
  const isWaiting = status === "UPCOMING" || status === "DRAFT";
  const isFinished = status === "ENDED" || status === "CANCELLED";
  const countdownTarget = isWaiting ? campaign.startAt : campaign.endAt;

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(countdownTarget));

  useEffect(() => {
    if (isFinished) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft(getTimeLeft(countdownTarget));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(countdownTarget));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownTarget, isFinished]);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 bg-[#13110C] border border-[#2A2416] flex flex-col justify-center min-h-[140px] md:min-h-[160px]">
      <img
        src={BG_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-left opacity-60 lg:opacity-100 pointer-events-none select-none"
      />

      <img
        src={TROPHY_SRC}
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute left-0 bottom-0 h-[90%] lg:h-[95%] w-auto object-contain object-left-bottom pointer-events-none select-none z-0"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between w-full p-4 md:px-6 md:py-6 gap-4">
        <div className={getTitleContainerClass(campaign.name)}>
          <h2 className={`mb-1 max-w-full bg-[linear-gradient(90deg,#FCF19D_0%,#DAA440_100%)] bg-clip-text font-bold uppercase leading-tight text-transparent drop-shadow-md break-words ${getTitleFontClass(campaign.name)}`}>
            {campaign.name}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between bg-[#1C1C1E]/90 lg:bg-[#1C1C1E]/95 backdrop-blur-md border border-white/5 rounded-[11px] py-5 px-6 sm:px-4 md:px-4 md:py-4 lg:px-4 lg:py-4 xl:px-8 xl:py-7 gap-4 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-8 shadow-xl w-full max-w-[720px] mx-auto lg:w-auto lg:max-w-none lg:mx-0">
          <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start shrink-0 w-full sm:w-auto gap-2">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 xl:gap-2 sm:mb-2 lg:mb-1.5 xl:mb-3">
              <img src="/images/campaign/Ic_filled_users-group.png" alt="" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[20px] xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[15px] lg:text-[12px] xl:text-[14px] whitespace-nowrap">Participants</p>
            </div>
            <p className="font-bold text-white leading-none truncate text-[12px] sm:text-[14px] lg:text-[18px] xl:text-[24px]">
              {campaign?.leaderboardSummary?.participantCount}
            </p>
          </div>

          <div className="hidden sm:block h-10 md:h-10 lg:h-10 xl:h-14 w-px bg-white/10 shrink-0" />
          <div className="block sm:hidden h-px w-full bg-white/10" />

          <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start shrink-0 w-full sm:w-auto gap-2">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 xl:gap-2 sm:mb-2 lg:mb-1.5 xl:mb-3">
              <img src="/images/campaign/Ic_filled_bitcoin-circle.png" alt="" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[20px] xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[15px] lg:text-[12px] xl:text-[14px] whitespace-nowrap">
                <span className="hidden sm:inline">Tổng </span>volume
              </p>
            </div>
            <p className="font-bold text-white leading-none truncate text-[12px] sm:text-[14px] lg:text-[18px] xl:text-[24px]">
              {formatVnd(campaign?.leaderboardSummary?.totalVolumeUsd ?? 0)}
            </p>
          </div>

          <div className="hidden sm:block h-10 md:h-10 lg:h-10 xl:h-14 w-px bg-white/10 shrink-0" />
          <div className="block sm:hidden h-px w-full bg-white/10" />

          <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start shrink-0 w-full sm:w-auto gap-2">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 xl:gap-2 sm:mb-2 lg:mb-1.5 xl:mb-3">
              <img src="/images/campaign/Ic_filled_alarm-clock.png" alt="" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[20px] xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[15px] lg:text-[#8B8B93] xl:text-[14px] whitespace-nowrap">
                {isWaiting ? "Thời gian chờ" : "Thời gian còn lại"}
              </p>
            </div>
            <div className="font-bold text-white leading-none tracking-wider truncate text-[12px] sm:text-[14px] lg:text-[18px] xl:text-[24px]">
              {padTime(timeLeft.hours)} : {padTime(timeLeft.minutes)} : {padTime(timeLeft.seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
