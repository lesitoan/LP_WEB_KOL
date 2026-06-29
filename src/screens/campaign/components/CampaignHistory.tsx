"use client";
import { useEffect, useState } from "react";
import type { CampaignData } from "@/types/api/campaign";
import { useUpdateCampaignMutation, useDeleteCampaignMutation } from "@/services/api/campaignApi";
import { toast } from "@/hooks/useToast";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import { usePopup } from "@/hooks/usePopup";

interface Props {
  campaigns: CampaignData[];
  activeCampaignId?: string;
  onViewCampaign?: (id: string) => void;
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
function HistoryCard({ campaign, onViewCampaign, isActive }: { campaign: CampaignData, onViewCampaign?: (id: string) => void, isActive?: boolean }) {
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();
  const { showConfirm, Popup } = usePopup();

  // Tính trạng thái hiển thị thực tế theo thời gian
  const effectiveStatus = getEffectiveStatus(campaign);
  const isDraft = effectiveStatus === "DRAFT";
  const isUpcoming = effectiveStatus === "UPCOMING";
  const isCancelled = effectiveStatus === "CANCELLED";

  // Countdown: UPCOMING đến startAt, ACTIVE đến endAt
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

      if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs >= endMs || now >= endMs) {
        toast({
          title: "Không thể phát hành",
          description: "thời gian diễn ra campaign không hợp lệ",
          variant: "destructive",
        });
        return;
      }

      const newStatus = now >= startMs ? "ACTIVE" : "UPCOMING";

      await updateCampaign({ id: campaign.id, body: { status: newStatus } }).unwrap();

      toast({
        title: "Phát hành thành công",
        description: "Chiến dịch đã được lên lịch và sẽ tự động bắt đầu khi đến thời gian.",
        variant: "success",
      });
    } catch (err: unknown) {
      console.error("Publish error:", err);
      const message = extractApiErrorMessage(err, "Không thể phát hành chiến dịch");
      toast({ title: "Phát hành thất bại", description: message, variant: "destructive" });
    }
  };

  return (
    <div className={`relative w-full bg-[#171717] rounded-[20px] overflow-hidden border border-white/5 flex flex-col transition-all duration-300 ${
      isActive 
        ? "ring-2 ring-[#FFD255] shadow-[0_0_15px_rgba(255,210,85,0.25)]" 
        : ""
    }`}>

      {/* Nửa trên */}
      <div className={`relative pt-5 px-5 pb-8 min-[576px]:px-4 lg:px-5 ${cfg.gradient}`}>

        <div className={`absolute left-0 top-5 w-[4px] h-[38px] ${cfg.leftBar} rounded-r-sm`} />

        <div className="flex justify-between items-start pl-2">
          <div className="flex-1 mr-3">
            <p className="text-[18px] font-medium text-white/80 mb-0.5 tracking-wide line-clamp-1">
              {campaign.name}
            </p>
          </div>

          {/* Badge trạng thái */}
          <div
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotBg}`} />
            {cfg.label}
          </div>
        </div>
      </div>

      {/* Nửa dưới */}
      <div className="relative z-10 -mt-5 bg-[#171717] rounded-t-[20px] pt-5 px-5 pb-4 min-[576px]:pt-4 min-[576px]:px-4 min-[576px]:pb-3.5 lg:pt-5 lg:px-5 lg:pb-4 flex-1 flex flex-col justify-between">

        {/* Stats */}
        <div className="flex justify-between items-start gap-1">
          {[
            { label: "Participants", value: campaign.participantCount ?? "—" },
            { label: "Tổng", value: campaign.totalVolumeUsd != null ? formatVND(campaign.totalVolumeUsd) : "—" },
            { label: countdownLabel, value: liveCountdown },
          ].map((item, i) => (
            <div key={i} className="min-w-0">
              <p className="text-[14px] text-[#8B8B93] mb-1.5 truncate">{item.label}</p>
              <p className="font-bold text-[14px] text-white truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 mt-4 mb-3" />

        {/* Nút Action */}
        <div className="flex items-center justify-between gap-3">
          {/* Xem chiến dịch & Phát hành */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onViewCampaign?.(campaign.id)}
              className="inline-flex justify-center items-center gap-2 bg-white text-black font-bold text-[16px] px-4 py-2.5 rounded-[12px] hover:bg-gray-200 transition-colors active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Xem chiến dịch
            </button>

            {isDraft && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 border border-[#F6F0AA]/20 text-[#F6F0AA]/80 hover:text-[#F6F0AA] hover:bg-[#F6F0AA]/10 font-bold text-[12px] px-3.5 py-2.5 rounded-[12px] transition-all disabled:opacity-50 active:scale-95"
              >
                {isUpdating ? "Đang xử lý..." : "Phát hành"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              type="button"
              className="transition-all active:scale-95 shrink-0"
            >
              <img 
                src="/images/campaign/Button_edit.png" 
                alt="Edit" 
                className="w-[42px] h-[42px] object-contain hover:brightness-110" 
              />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                const accepted = await showConfirm({
                  title: "Xác nhận xóa chiến dịch",
                  description: (
                    <span>
                      Bạn có chắc chắn muốn xóa chiến dịch{' '}
                      <span className="font-bold text-foreground break-all">
                        "{campaign.name}"
                      </span>
                      ? Hành động này không thể hoàn tác.
                    </span>
                  ),
                  confirmText: "Đồng ý",
                  cancelText: "Hủy bỏ",
                  destructive: true,
                });
                if (!accepted) return;

                try {
                  await deleteCampaign(campaign.id).unwrap();
                  toast({
                    title: "Xóa thành công",
                    description: "Chiến dịch đã được xóa khỏi hệ thống.",
                    variant: "success",
                  });
                } catch (err) {
                  console.error("Delete campaign error:", err);
                  const msg = extractApiErrorMessage(err, "Không thể xóa chiến dịch");
                  toast({
                    title: "Xóa thất bại",
                    description: msg,
                    variant: "destructive",
                  });
                }
              }}
              className="transition-all active:scale-95 shrink-0 disabled:opacity-50"
            >
              <img 
                src="/images/campaign/Button_delete.png" 
                alt="Delete" 
                className="w-[42px] h-[42px] object-contain hover:brightness-110" 
              />
            </button>
          </div>
        </div>
      </div>

      <Popup />
    </div>
  );
}

// Main Component
export default function CampaignHistory({ campaigns, activeCampaignId, onViewCampaign }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [cols, setCols] = useState(3);

  // Detect responsive column count
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setCols(3);
      else if (window.innerWidth >= 576) setCols(2);
      else setCols(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset page on filter or column change
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter, cols]);

  const counts = {
    ALL: campaigns.length,
    CANCELLED: campaigns.filter((c) => getEffectiveStatus(c) === "CANCELLED").length,
    ACTIVE: campaigns.filter((c) => getEffectiveStatus(c) === "ACTIVE").length,
    UPCOMING: campaigns.filter((c) => getEffectiveStatus(c) === "UPCOMING").length,
    DRAFT: campaigns.filter((c) => getEffectiveStatus(c) === "DRAFT").length,
  };

  const tabs: { key: string; label: string }[] = [
    { key: "ALL", label: "Tất cả" },
    { key: "CANCELLED", label: "Đã kết thúc" },
    { key: "ACTIVE", label: "Đang diễn ra" },
    { key: "UPCOMING", label: "Sắp diễn ra" },
    { key: "DRAFT", label: "Bản nháp" },
  ];

  const filtered = activeFilter === "ALL"
    ? campaigns
    : campaigns.filter((c) => getEffectiveStatus(c) === activeFilter);

  const totalPages = Math.ceil(filtered.length / cols);
  const paginated = filtered.slice(currentPage * cols, (currentPage + 1) * cols);

  return (
    <div className="mt-12 mb-8">
      <h3 className="text-[20px] font-semibold text-white mb-4">
        Các chiến dịch đã tạo
      </h3>

      {/* Filter Tabs Row + Pagination Buttons */}
      <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[16px] font-medium transition-all ${
                  isActive
                    ? "bg-[#27272A] text-white"
                    : "text-[#8B8B93] hover:text-white"
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[12px] font-bold ${
                    isActive
                      ? "bg-[#F7F0A1] text-black"
                      : "bg-white/10 text-[#8B8B93]"
                  }`}
                >
                  {counts[tab.key as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white disabled:opacity-30 hover:bg-white/5 transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white disabled:opacity-30 hover:bg-white/5 transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-[#8B8B93] py-10 text-[14px]">
          Không có chiến dịch nào trong mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[576px]:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {paginated.map((campaign, index) => (
            <HistoryCard 
              key={`${campaign.id}-${index}`} 
              campaign={campaign} 
              onViewCampaign={onViewCampaign} 
              isActive={campaign.id === activeCampaignId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
