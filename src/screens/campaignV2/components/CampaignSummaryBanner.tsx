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

const TROPHY_SRC = "/images/campaign/campaign-trophy.png";

function formatCampaignName(name: string) {
  if (!name) return "";
  if (name.length <= 15) return name;

  const mid = Math.round(name.length / 2);
  let splitIndex = name.indexOf(" ", 12);
  if (splitIndex === -1 || splitIndex > 20) {
    let minDiff = Infinity;
    let bestSpace = -1;
    for (let i = 0; i < name.length; i++) {
      if (name[i] === " ") {
        const diff = Math.abs(i - mid);
        if (diff < minDiff) {
          minDiff = diff;
          bestSpace = i;
        }
      }
    }
    splitIndex = bestSpace;
  }

  if (splitIndex !== -1) {
    return (
      <>
        {name.slice(0, splitIndex)}
        <br />
        {name.slice(splitIndex + 1)}
      </>
    );
  }

  return (
    <>
      {name.slice(0, 15)}
      <br />
      {name.slice(15)}
    </>
  );
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
        src={TROPHY_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-left opacity-60 lg:opacity-100 pointer-events-none select-none"
      />

      <div className="relative z-10 flex flex-col 2xl:flex-row 2xl:items-center justify-between w-full p-4 md:px-6 md:py-6 gap-4">
        <div className="shrink-0 flex flex-col items-center 2xl:items-start text-center 2xl:text-left 2xl:ml-[18%] w-full 2xl:w-auto">
          <h2 className="mb-1 max-w-full bg-[linear-gradient(90deg,#FCF19D_0%,#DAA440_100%)] bg-clip-text font-bold uppercase leading-tight text-transparent text-[30px] sm:text-[40px] drop-shadow-md">
            {formatCampaignName(campaign.name)}
          </h2>
        </div>

        <div className="flex flex-row items-center justify-between bg-[#1C1C1E]/90 2xl:bg-[#1C1C1E]/95 backdrop-blur-md border border-white/5 rounded-[11px] py-4 px-2.5 sm:px-4 md:px-4 md:py-4 2xl:px-8 2xl:py-7 gap-2 sm:gap-4 md:gap-4 2xl:gap-8 shadow-xl w-full max-w-[720px] mx-auto 2xl:w-auto 2xl:max-w-none 2xl:mx-0">
          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 2xl:gap-2 mb-2 lg:mb-1.5 2xl:mb-3">
              <img src="/images/campaign/Ic_filled_users-group.png" alt="" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] 2xl:w-[20px] 2xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[15px] 2xl:text-[14px] whitespace-nowrap">Participants</p>
            </div>
            <p className="font-bold text-white leading-none truncate text-[12px] sm:text-[14px] lg:text-[17px] 2xl:text-[24px]">
              {campaign?.leaderboardSummary?.participantCount}
            </p>
          </div>

          <div className="h-10 md:h-10 lg:h-10 2xl:h-14 w-px bg-white/10 shrink-0" />

          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 2xl:gap-2 mb-2 lg:mb-1.5 2xl:mb-3">
              <img src="/images/campaign/Ic_filled_bitcoin-circle.png" alt="" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] 2xl:w-[20px] 2xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[15px] 2xl:text-[14px] whitespace-nowrap">
                <span className="hidden sm:inline">Tổng </span>volume
              </p>
            </div>
            <p className="font-bold text-white leading-none truncate text-[12px] sm:text-[14px] lg:text-[17px] 2xl:text-[24px]">
              {formatVnd(campaign?.leaderboardSummary?.totalVolumeUsd ?? 0)}
            </p>
          </div>

          <div className="h-10 md:h-10 lg:h-10 2xl:h-14 w-px bg-white/10 shrink-0" />

          <div className="flex flex-col justify-center items-center lg:items-start shrink-0">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-1.5 2xl:gap-2 mb-2 lg:mb-1.5 2xl:mb-3">
              <img src="/images/campaign/Ic_filled_alarm-clock.png" alt="" className="w-[11px] h-[11px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px] 2xl:w-[20px] 2xl:h-[20px] shrink-0 object-contain" />
              <p className="text-[#8B8B93] font-medium text-[10px] sm:text-[15px] 2xl:text-[14px] whitespace-nowrap">
                {isWaiting ? "Thời gian chờ" : "Thời gian còn lại"}
              </p>
            </div>
            <div className="font-bold text-white leading-none tracking-wider truncate text-[12px] sm:text-[14px] lg:text-[17px] 2xl:text-[24px]">
              {padTime(timeLeft.hours)} : {padTime(timeLeft.minutes)} : {padTime(timeLeft.seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
