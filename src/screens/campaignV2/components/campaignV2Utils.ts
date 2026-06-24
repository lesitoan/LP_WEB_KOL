import { formatVnd } from "@/lib/formatMoney";
import type {
  Campaign,
  CampaignCounts,
  CampaignHistoryFilter,
  CampaignLeaderboardItem,
  CampaignRankingType,
  CampaignReward,
  CampaignStatus,
} from "@/types/api/campaignV2";

export const FILTER_TABS: { key: CampaignHistoryFilter; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "ENDED", label: "Đã kết thúc" },
  { key: "ACTIVE", label: "Đang diễn ra" },
  { key: "UPCOMING", label: "Sắp diễn ra" },
  { key: "DRAFT", label: "Bản nháp" },
  { key: "CANCELLED", label: "Đã hủy" },
];

export function getEmptyCounts(): CampaignCounts {
  return {
    ALL: 0,
    ACTIVE: 0,
    UPCOMING: 0,
    DRAFT: 0,
    ENDED: 0,
    CANCELLED: 0,
  };
}

export function getEffectiveStatus(campaign: Campaign): CampaignStatus {
  if (campaign.status === "DRAFT") return "DRAFT";
  if (campaign.status === "CANCELLED") return "CANCELLED";
  if (campaign.status === "ENDED") return "ENDED";

  const now = Date.now();
  const startMs = new Date(campaign.startAt).getTime();
  const endMs = new Date(campaign.endAt).getTime();

  if (now > endMs) return "ENDED";
  if (now >= startMs) return "ACTIVE";
  return "UPCOMING";
}

export function getCountsFromCampaigns(campaigns: Campaign[]): CampaignCounts {
  const counts = getEmptyCounts();
  counts.ALL = campaigns.length;

  campaigns.forEach((campaign) => {
    const status = getEffectiveStatus(campaign);
    counts[status] += 1;
  });

  return counts;
}

export function getStatusLabel(status: CampaignStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Đang diễn ra";
    case "UPCOMING":
      return "Sắp diễn ra";
    case "DRAFT":
      return "Bản nháp";
    case "CANCELLED":
      return "Đã hủy";
    case "ENDED":
    default:
      return "Đã kết thúc";
  }
}

export function getStatusBadgeClass(status: CampaignStatus): string {
  switch (status) {
    case "ACTIVE":
      return "bg-[#06301C] text-[#60CF9B]";
    case "UPCOMING":
      return "bg-[#2A210F] text-[#E8A838]";
    case "DRAFT":
      return "bg-black/35 text-white";
    case "CANCELLED":
      return "bg-[#3A1D1D] text-[#FF8A8A]";
    case "ENDED":
    default:
      return "bg-[#4D2C03] text-[#F9A63A]";
  }
}

export function padTime(value: number): string {
  return String(value).padStart(2, "0");
}

export function getTimeLeft(targetTime: string) {
  const diff = new Date(targetTime).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}


export function formatNumber(value: number | null | undefined): string {
  if (!value || !Number.isFinite(value)) return "0";
  return value.toLocaleString("vi-VN");
}

export function getMemberName(entry: CampaignLeaderboardItem): string {
//   return (
//     entry.member.telegramUsername ||
//     [entry.member.telegramFirstName, entry.member.telegramLastName].filter(Boolean).join(" ") ||
//     entry.member.telegramUserId
//   );
  return `${entry?.member?.telegramFirstName} ${entry?.member?.telegramLastName}`
}

export function getRewardLabel(rank: number, rewards: CampaignReward[]): string {
  const reward = rewards.find((item) => rank >= item.rankFrom && rank <= item.rankTo);
  return reward?.label || "0";
}

export function getLeaderboardValue(
  entry: CampaignLeaderboardItem,
  rankingType: CampaignRankingType,
): string {
  if (rankingType === "TOP_TRADE_COUNT") {
    return String(entry.totalTradeCount ?? 0);
  }

  return formatVnd(entry.totalVolumeUsd) + " VNĐ";
}

export function getRankingLabel(rankingType: CampaignRankingType): string {
  // if (rankingType === "TOP_TRADE_COUNT") return "Số lệnh trade";
  // if (rankingType === "TOP_GROWTH") return "Tăng trưởng";
  return "Tổng tích lũy";
}
