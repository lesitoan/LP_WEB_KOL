"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
    return "text-[28px] sm:text-[36px] xl:text-[40px]";
  }
  if (len <= 30) {
    return "text-[22px] sm:text-[28px] xl:text-[32px] 2xl:text-[36px]";
  }
  if (len <= 40) {
    return "text-[18px] sm:text-[22px] xl:text-[24px] 2xl:text-[28px]";
  }

  return "text-[16px] sm:text-[20px] xl:text-[20px] 2xl:text-[22px]";
}

function getTitleContainerClass(name: string) {
  const len = name?.length ?? 0;
  const base = "shrink-0 xl:shrink xl:min-w-0 flex flex-col items-center xl:items-start text-center xl:text-left w-full xl:w-0 xl:flex-1";
  if (len > 30) {
    return `${base} xl:ml-[160px] 2xl:ml-[190px] 2xl:max-w-[380px]`;
  }
  if (len > 15) {
    return `${base} xl:ml-[190px] 2xl:max-w-[420px]`;
  }
  return `${base} xl:ml-[220px]`;
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

  // Hard cap the title at 2 lines. The breakpoint-based classes above set a
  // good *starting* size, but no fixed set of breakpoints can predict every
  // combination of name length + actual available width. So after render we
  // measure the real height and, only if it's taller than 2 lines, shrink
  // the font in 1px steps until it fits (or we hit a floor) — never hiding
  // text, just sizing it down further than the static classes alone would.
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const MAX_LINES = 2;
    const MIN_FONT_SIZE = 14;
    let cancelled = false;

    const fitTitle = () => {
      if (cancelled) return;
      el.style.fontSize = ""; // reset to the CSS-driven size for this breakpoint first
      let computed = window.getComputedStyle(el);
      let lineHeight = parseFloat(computed.lineHeight);
      let fontSize = parseFloat(computed.fontSize);
      if (!lineHeight || !fontSize) return;

      while (
        el.scrollHeight > lineHeight * MAX_LINES + 1 &&
        fontSize > MIN_FONT_SIZE
      ) {
        fontSize -= 1;
        el.style.fontSize = `${fontSize}px`;
        computed = window.getComputedStyle(el);
        lineHeight = parseFloat(computed.lineHeight);
      }
    };

    fitTitle();

    const observer = new ResizeObserver(() => fitTitle());
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [campaign.name]);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 bg-[#13110C] border border-[#2A2416] flex flex-col justify-center min-h-[140px] md:min-h-[160px]">
      <img
        src={BG_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center xl:object-left opacity-60 xl:opacity-100 pointer-events-none select-none"
      />

      <img
        src={TROPHY_SRC}
        alt=""
        aria-hidden="true"
        className="hidden xl:block absolute left-0 bottom-0 h-[90%] xl:h-[95%] w-auto object-contain object-left-bottom pointer-events-none select-none z-0"
      />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between w-full p-4 md:px-6 md:py-6 gap-4">
        <div className={getTitleContainerClass(campaign.name)}>
          <h2 ref={titleRef} className={`mb-1 max-w-full bg-[linear-gradient(90deg,#FCF19D_0%,#DAA440_100%)] bg-clip-text font-bold uppercase leading-tight text-transparent drop-shadow-md break-words ${getTitleFontClass(campaign.name)}`}>
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
                Tổng volume
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