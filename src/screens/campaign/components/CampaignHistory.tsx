"use client";
import { useEffect, useState } from "react";
import type { CampaignData } from "@/types/api/campaign";
import { useUpdateCampaignMutation } from "@/services/api/campaignApi";
import { toast } from "@/hooks/useToast";
import { extractApiErrorMessage } from "@/services/api/baseApi";

interface Props {
  campaigns: CampaignData[];
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

// Hook đếm ngược real-time
function useLiveCountdown(targetTime: string, paused: boolean): string {
  const calcStr = () => {
    const diff = new Date(targetTime).getTime() - Date.now();
    if (diff <= 0) return "-- : -- : --";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(h)} : ${pad(m)} : ${pad(s)}`;
  };

  const [display, setDisplay] = useState(() => paused ? "-- : -- : --" : calcStr());

  useEffect(() => {
    if (paused) {
      setDisplay("-- : -- : --");
      return;
    }
    setDisplay(calcStr());
    const id = setInterval(() => {
      const diff = new Date(targetTime).getTime() - Date.now();
      if (diff <= 0) {
        setDisplay("-- : -- : --");
        clearInterval(id);
      } else {
        setDisplay(calcStr());
      }
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime, paused]);

  return display;
}

// Trạng thái hiển thị thực tế
function getEffectiveStatus(campaign: CampaignData): string {
  const apiStatus = campaign.status;
  const now = Date.now();
  const startMs = new Date(campaign.startAt).getTime();
  const endMs = new Date(campaign.endAt).getTime();

  if (apiStatus === "DRAFT") return "DRAFT";
  if (now > endMs) return "CANCELLED";
  if (now >= startMs) return "ACTIVE";
  return "UPCOMING";
}

// Cấu hình giao diện theo trạng thái
function getStatusConfig(status: string) {
  const common = {
    gradient: "bg-gradient-to-r from-[#9F6728] via-[#DAA440] to-[#FCF19D]",
    leftBar: "bg-[#FFD000]",
  };

  switch (status) {
    case "DRAFT":
      return {
        ...common,
        badgeBg: "bg-black/40 border border-white/10 backdrop-blur-xs",
        badgeText: "text-white font-medium",
        dotBg: "bg-white",
        label: "Bản nháp",
      };
    case "UPCOMING":
      return {
        ...common,
        badgeBg: "bg-[#2A210F]",
        badgeText: "text-[#E8A838]",
        dotBg: "bg-[#E8A838]",
        label: "Sắp diễn ra",
      };
    case "ACTIVE":
      return {
        ...common,
        badgeBg: "bg-[#06301C]",
        badgeText: "text-[#60CF9B]",
        dotBg: "bg-[#60CF9B]",
        label: "Đang diễn ra",
      };
    case "CANCELLED":
    default:
      return {
        ...common,
        badgeBg: "bg-[#4D2C03]",
        badgeText: "text-[#F9A63A]",
        dotBg: "bg-[#F9A63A]",
        label: "Đã kết thúc",
      };
  }
}

// History Card
function HistoryCard({ campaign }: { campaign: CampaignData }) {
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();

  // Tính trạng thái hiển thị thực tế theo thời gian
  const effectiveStatus = getEffectiveStatus(campaign);
  const isDraft = effectiveStatus === "DRAFT";
  const isUpcoming = effectiveStatus === "UPCOMING";
  const isCancelled = effectiveStatus === "CANCELLED";

  // Countdown: UPCOMING → đếm đến startAt, ACTIVE → đếm đến endAt, còn lại → dừng
  const countdownTarget = isUpcoming ? campaign.startAt : campaign.endAt;
  const countdownPaused = isDraft || isCancelled;
  const liveCountdown = useLiveCountdown(countdownTarget, countdownPaused);
  const countdownLabel = isUpcoming ? "Thời gian chờ" : "Thời gian còn lại";

  // Giao diện theo trạng thái
  const cfg = getStatusConfig(effectiveStatus);

  // ── Nút "Phát hành"
  const handlePublish = async () => {
    try {
      const now = Date.now();
      const startMs = new Date(campaign.startAt).getTime();
      const endMs = new Date(campaign.endAt).getTime();

      // Xác định trạng thái
      let newStatus: string;
      if (now > endMs) {
        newStatus = "CANCELLED";
      } else if (now >= startMs) {
        newStatus = "ACTIVE";
      } else {
        newStatus = "UPCOMING";
      }

      await updateCampaign({ id: campaign.id, body: { status: newStatus } }).unwrap();

      const messages: Record<string, string> = {
        ACTIVE: "Chiến dịch đã được kích hoạt ngay lập tức!",
        UPCOMING: "Chiến dịch sẽ tự động bắt đầu khi đến ngày.",
        CANCELLED: "Chiến dịch đã quá hạn và được đánh dấu kết thúc.",
      };

      toast({
        title: "Phát hành thành công",
        description: messages[newStatus] || "Trạng thái đã được cập nhật.",
        variant: "success",
      });
    } catch (err: unknown) {
      console.error("Publish error:", err);
      const message = extractApiErrorMessage(err, "Không thể phát hành chiến dịch");
      toast({ title: "Phát hành thất bại", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="relative flex-shrink-0 w-full max-w-[380px] mx-auto min-[576px]:mx-0 min-[576px]:w-[380px] lg:max-w-none lg:w-auto bg-[#171717] rounded-[20px] overflow-hidden border border-white/5 flex flex-col snap-start">

      {/* Nửa trên */}
      <div className={`relative pt-5 px-5 pb-8 ${cfg.gradient}`}>

        <div className={`absolute left-0 top-5 w-[4px] h-[38px] ${cfg.leftBar} rounded-r-sm`} />

        <div className="flex justify-between items-start pl-2">
          <div className="flex-1 mr-3">
            <p className="text-[12px] font-medium text-white/80 mb-0.5 tracking-wide line-clamp-1">
              {campaign.name}
            </p>
          </div>

          {/* Badge trạng thái */}
          <div
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotBg}`} />
            {cfg.label}
          </div>
        </div>
      </div>

      {/* Nửa dưới */}
      <div className="relative z-10 -mt-5 bg-[#171717] rounded-t-[20px] p-5 flex-1 flex flex-col justify-between">

        {/* Stats */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1.5">Participants</p>
            <p className="font-bold text-[14px] text-white">
              {campaign.participantCount ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1.5">Tổng</p>
            <p className="font-bold text-[14px] text-white">
              {campaign.totalVolumeUsd != null
                ? formatVND(campaign.totalVolumeUsd)
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#8B8B93] mb-1.5">{countdownLabel}</p>
            <p className="font-bold text-[14px] text-white">
              {liveCountdown}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 my-5" />

        {/* Nút Action */}
        <div className="flex items-center justify-between gap-2">
          {/* Nút trạng thái (trái) */}
          <div>
            {isDraft && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 border border-[#F6F0AA]/20 text-[#F6F0AA]/80 hover:text-[#F6F0AA] hover:bg-[#F6F0AA]/10 font-bold text-[12px] px-3.5 py-2 rounded-[10px] transition-all disabled:opacity-50 active:scale-95"
              >
                {isUpdating ? "Đang xử lý..." : "Phát hành"}
              </button>
            )}
          </div>

          {/* Nút xem (phải) */}
          <button className="inline-flex justify-center items-center gap-2 bg-white text-black font-bold text-[13px] px-4 py-2.5 rounded-[12px] hover:bg-gray-200 transition-colors active:scale-[0.98]">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

      <div className="flex flex-col min-[576px]:flex-row lg:grid lg:grid-cols-3 gap-4 min-[576px]:overflow-x-auto pb-4 min-[576px]:snap-x min-[576px]:snap-mandatory scrollbar-hide">
        {campaigns.map((campaign) => (
          <HistoryCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}