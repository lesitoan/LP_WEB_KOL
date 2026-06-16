"use client";
import { useEffect, useState } from "react";
import type { CampaignData } from "@/types/api/campaign";

interface Props {
  campaigns: CampaignData[];
}

// Format ngày ISO thành "THÁNG 3"
function formatMonthLabel(isoDate: string): string {
  const date = new Date(isoDate);
  return `THÁNG ${date.getMonth() + 1}`;
}

// Format VNĐ
function formatVND(volumeStr: string | number): string {
  const usd = typeof volumeStr === "string" ? parseFloat(volumeStr || "0") : volumeStr;
  const vnd = usd * 25000;
  const viFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });
  if (vnd >= 1_000_000_000) return `${viFormatter.format(vnd / 1_000_000_000)} tỷ VNĐ`;
  if (vnd >= 1_000_000) return `${viFormatter.format(vnd / 1_000_000)} triệu VNĐ`;
  return `${Math.round(vnd).toLocaleString("vi-VN")} VNĐ`;
}

// Hook đếm ngược real-time — tick mỗi giây, không bị đứng hình
function useLiveCountdown(endAt: string, isEnded: boolean): string {
  const calcStr = () => {
    const diff = new Date(endAt).getTime() - Date.now();
    if (diff <= 0) return "-- : -- : --";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(h)} : ${pad(m)} : ${pad(s)}`;
  };

  const [display, setDisplay] = useState(() => isEnded ? "-- : -- : --" : calcStr());

  useEffect(() => {
    if (isEnded) return;
    setDisplay(calcStr());
    const id = setInterval(() => {
      const diff = new Date(endAt).getTime() - Date.now();
      if (diff <= 0) {
        setDisplay("-- : -- : --");
        clearInterval(id);
      } else {
        setDisplay(calcStr());
      }
    }, 1000);
    return () => clearInterval(id);
  }, [endAt, isEnded]);

  return display;
}

// History Card
function HistoryCard({ campaign }: { campaign: CampaignData }) {
  const isEnded = campaign.status === "ENDED" || new Date(campaign.endAt).getTime() < Date.now();
  // Hook đếm ngược real-time: chỉ chạy khi chiến dịch đang ACTIVE
  const liveCountdown = useLiveCountdown(campaign.endAt, isEnded);

  return (
    <div className="flex-shrink-0 w-[85%] md:w-auto md:flex-1 bg-[#171717] rounded-[20px] overflow-hidden border border-white/5 flex flex-col snap-start">

      {/* ── Nửa trên (Header màu xanh) ── */}
      <div className="relative pt-5 px-5 pb-8 bg-gradient-to-r from-[#3A3514] via-[#8F8128] to-brand">

        <div className="absolute left-0 top-5 w-[4px] h-[38px] bg-[#FFD000] rounded-r-sm shadow-[1px_0_4px_rgba(255,208,0,0.3)]" />

        <div className="flex justify-between items-start pl-2">
          <div>
            <p className="text-[12px] font-medium text-white/80 mb-0.5 tracking-wide">
              {campaign.name}
            </p>
            <h4 className="text-[22px] font-bold text-white leading-none">
              {formatMonthLabel(campaign.startAt)}
            </h4>
          </div>

          {/* Badge trạng thái */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${
              isEnded
                ? "bg-[#4D2C03] text-[#F9A63A]"
                : "bg-[#06301C] text-[#60CF9B]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isEnded ? "bg-[#F9A63A]" : "bg-[#60CF9B]"
              }`}
            />
            {isEnded ? "Đã kết thúc" : "Đang diễn ra"}
          </div>
        </div>
      </div>

      {/* ── Nửa dưới (Body đen) ── */}
      <div className="relative z-10 -mt-5 bg-[#171717] rounded-t-[20px] p-5 flex-1 flex flex-col justify-between">

        {/* Stats */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1.5">Participants</p>
            <p className="font-geist-mono font-bold text-[14px] text-white">
              {campaign.participantCount ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1.5">Tổng</p>
            <p className="font-geist-mono font-bold text-[14px] text-white">
              {campaign.totalVolumeUsd != null
                ? formatVND(campaign.totalVolumeUsd)
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1.5">Thời gian còn lại</p>
            <p className="font-geist-mono font-bold text-[14px] text-white">
              {isEnded ? "-- : -- : --" : liveCountdown}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 my-5" />

        {/* Nút Action */}
        <div className="flex justify-end">
          <button className="inline-flex justify-center items-center gap-2 bg-white text-black font-bold text-[13.5px] px-6 py-2.5 rounded-[12px] hover:bg-gray-200 transition-colors active:scale-[0.98]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Xem chiến dịch
          </button>
        </div>
      </div>

    </div>
  );
}

// Main Component
export default function CampaignHistory({ campaigns }: Props) {
  return (
    <div className="mt-12 mb-8">
      <h3 className="text-[16px] font-semibold mb-5 text-white">
        Các chiến dịch đã tạo
      </h3>

      <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {campaigns.map((campaign) => (
          <HistoryCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
