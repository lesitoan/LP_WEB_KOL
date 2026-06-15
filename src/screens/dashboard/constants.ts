import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bitcoin,
  Flag,
  Landmark,
  Share2,
  TrendingDown,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

export type DashboardSegment = "all" | "spot" | "future";

export const dashboardSegments: Array<{ value: DashboardSegment; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "spot", label: "Spot" },
  { value: "future", label: "Future" },
];

export const defaultDateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
  to: new Date().toISOString().split("T")[0],
};

export const tierSummary = {
  tierName: "STARTER",
  currentMembers: 43,
  targetMembers: 50,
  neededMembers: 7,
  nextTier: "PARTNER - 40% HOA HỒNG",
  commissionRate: "30%",
};

export type OverviewMetric = {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: LucideIcon;
};

export const overviewMetrics: OverviewMetric[] = [
  {
    label: "Tổng số referral",
    value: "200",
    trend: "+10.5% so với tháng trước",
    trendDirection: "up",
    icon: UsersRound,
  },
  {
    label: "Tổng deposit",
    value: "60",
    trend: "+10.5% so với tháng trước",
    trendDirection: "up",
    icon: WalletCards,
  },
  {
    label: "Tổng trade",
    value: "50",
    trend: "+10.5% so với tháng trước",
    trendDirection: "up",
    icon: Landmark,
  },
  {
    label: "Tổng KYC",
    value: "60",
    trend: "-6.7% so với tháng trước",
    trendDirection: "down",
    icon: UserRoundCheck,
  },
];

export const volumeChartData = [
  { label: "T1", vip: 22, gold: 77, silver: 118 },
  { label: "", vip: 30, gold: 80, silver: 124 },
  { label: "", vip: 24, gold: 77, silver: 120 },
  { label: "", vip: 28, gold: 79, silver: 123 },
  { label: "", vip: 28, gold: 79, silver: 124 },
  { label: "", vip: 32, gold: 81, silver: 126 },
  { label: "", vip: 31, gold: 81, silver: 126 },
  { label: "", vip: 36, gold: 82, silver: 128 },
  { label: "", vip: 34, gold: 80, silver: 124 },
  { label: "", vip: 39, gold: 83, silver: 129 },
  { label: "", vip: 36, gold: 82, silver: 127 },
  { label: "", vip: 40, gold: 84, silver: 130 },
  { label: "T2", vip: 37, gold: 82, silver: 128 },
  { label: "", vip: 43, gold: 85, silver: 131 },
  { label: "", vip: 50, gold: 88, silver: 136 },
  { label: "", vip: 55, gold: 90, silver: 140 },
  { label: "", vip: 55, gold: 90, silver: 140 },
  { label: "", vip: 58, gold: 92, silver: 142 },
  { label: "", vip: 55, gold: 90, silver: 140 },
  { label: "", vip: 48, gold: 87, silver: 134 },
  { label: "", vip: 42, gold: 84, silver: 130 },
  { label: "", vip: 40, gold: 84, silver: 129 },
  { label: "", vip: 55, gold: 90, silver: 138 },
  { label: "", vip: 60, gold: 92, silver: 142 },
  { label: "", vip: 63, gold: 93, silver: 144 },
  { label: "T3", vip: 65, gold: 95, silver: 146 },
  { label: "", vip: 72, gold: 98, silver: 149 },
  { label: "", vip: 73, gold: 99, silver: 151 },
  { label: "", vip: 70, gold: 97, silver: 149 },
  { label: "", vip: 66, gold: 95, silver: 147 },
  { label: "", vip: 61, gold: 92, silver: 142 },
  { label: "", vip: 68, gold: 94, silver: 143 },
  { label: "", vip: 64, gold: 92, silver: 147 },
  { label: "", vip: 62, gold: 91, silver: 144 },
  { label: "", vip: 68, gold: 94, silver: 147 },
  { label: "", vip: 74, gold: 96, silver: 149 },
  { label: "", vip: 74, gold: 99, silver: 152 },
  { label: "T4", vip: 86, gold: 100, silver: 152 },
  { label: "", vip: 84, gold: 103, silver: 159 },
  { label: "", vip: 96, gold: 106, silver: 160 },
];

export const attentionActivities = [
  {
    time: "14:32",
    icon: TrendingUp,
    iconClassName: "bg-emerald-500/15 text-emerald-400",
    content: "+3 thành viên mới đăng ký hôm nay",
  },
  {
    time: "14:33",
    icon: Bell,
    iconClassName: "bg-yellow-400/15 text-yellow-300",
    content: "3 thành viên sắp bị kick",
  },
  {
    time: "14:34",
    icon: TrendingDown,
    iconClassName: "bg-amber-500/15 text-amber-400",
    content: "30 thành viên không hoạt động trong...",
  },
  {
    time: "14:35",
    icon: Share2,
    iconClassName: "bg-emerald-500/15 text-emerald-400",
    content: "+30 thành viên mới trong 30 ngày",
  },
  {
    time: "14:36",
    icon: Flag,
    iconClassName: "bg-brand/15 text-brand",
    content: "Campaign A đã kết thúc",
  },
];

export const referralUrl = "https://www.sc.exchange/ref/olivia-3282";

export const commissionTotal = {
  icon: Bitcoin,
  label: "Tổng số hoa hồng",
  value: "500 triệu VNĐ",
};
