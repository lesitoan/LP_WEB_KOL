"use client";

import { useEffect, useState } from "react";

const TROPHY_SRC = "/images/campaign/campaign-trophy.png";
const CAMPAIGN_END = new Date("2026-06-30T23:59:00+07:00");

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
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

export default function CampaignHeroBanner() {
  const { hours, minutes, seconds } = useCountdown(CAMPAIGN_END);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 min-h-[140px] flex items-center bg-[#13110C] border border-[#2A2416]">
      {/* ── Ảnh BG (Cúp vàng + Gradient) ── */}
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
            Vua Volume
          </p>
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#F5C35A] tracking-tight leading-none">
            THÁNG 6
          </h2>
        </div>

        {/* Stats Block */}
        <div className="flex flex-wrap md:flex-nowrap items-center bg-[#1C1C1E]/95 backdrop-blur-md border border-white/5 rounded-2xl px-4 md:px-8 py-4 gap-4 md:gap-8 shadow-xl">
          
          {/* Participants */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="w-[18px] h-[18px] text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="text-[12px] text-[#8B8B93] font-medium">Participants</p>
            </div>
            <p className="text-[22px] font-bold text-white leading-none">142</p>
          </div>

          <div className="h-12 w-px bg-white/10 shrink-0" />

          {/* Total volume */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="w-[18px] h-[18px] text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.5 8h4.5a2 2 0 0 1 0 4h-5" />
                <path d="M9.5 12h5.5a2 2 0 0 1 0 4h-6" />
                <path d="M12 6v2" />
                <path d="M12 16v2" />
              </svg>
              <p className="text-[12px] text-[#8B8B93] font-medium">Tổng</p>
            </div>
            <p className="text-[22px] font-bold text-white leading-none">$42.5 M</p>
          </div>

          <div className="h-12 w-px bg-white/10 shrink-0" />

          {/* Live countdown */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="w-[18px] h-[18px] text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
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