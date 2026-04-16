"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";
import { formatCurrency, formatPercentage } from "@/lib/mockData";
import { extractApiErrorMessage } from "@/services/api/baseApi";
import { DashboardKpiGridSkeleton } from "@/components/skeletons/DashboardKpiGridSkeleton";
import {
  useGetCashbackGrowthSummaryQuery,
  useGetMemberOverviewStatsQuery,
} from "@/services/api/dashboardApi";

function formatDelta(value: number, fallback: string) {
  if (!Number.isFinite(value)) return fallback;
  const fixed = Math.abs(value).toFixed(1);
  return value >= 0
    ? `▲ +${fixed}% so với tháng trước`
    : `▼ -${fixed}% so với tháng trước`;
}

export default function KpiGrid() {
  const router = useRouter();

  const { data: memberStats, error: memberError } = useGetMemberOverviewStatsQuery();
  const { data: cashbackSummary, error: cashbackError, isLoading: isCashbackLoading } = useGetCashbackGrowthSummaryQuery();

  useEffect(() => {
    const error = memberError ?? cashbackError;
    if (!error) return;

    toast({
      variant: "destructive",
      title: "Không tải được thống kê dashboard",
      description: extractApiErrorMessage(error, "Đã có lỗi xảy ra"),
    });
  }, [cashbackError, memberError]);

  const kpis = useMemo(
    () => [
      {
        label: "Tổng số Referral",
        value: memberStats ? memberStats.totalMembers.toLocaleString("vi-VN") : "0",
        delta: memberStats
          ? formatDelta(memberStats.growthPercentage, "—")
          : "—",
        up: true,
        href: "/members",
      },
      {
        label: "Tổng Hoa hồng",
        value: cashbackSummary ? formatCurrency(cashbackSummary.totalCommissionUsd) : formatCurrency(0),
        delta: "▲ +8.2% so với tháng trước",
        up: true,
        href: "/cashback?tab=summary",
      },
      {
        label: "Tổng Cashback",
        value: cashbackSummary ? formatCurrency(cashbackSummary.totalCashbackPaidUsd) : formatCurrency(0),
        delta: cashbackSummary
          ? formatDelta(cashbackSummary.cashbackGrowthPercentage, "—")
          : "—",
        up: true,
        href: "/cashback?tab=summary",
      },
      {
        label: "Tỷ lệ chuyển đổi",
        value: formatPercentage(57.1),
        delta: "▼ -2.3% so với tháng trước",
        up: false,
        href: "/analytics",
      },
    ],
    [cashbackSummary, memberStats]
  );

  const showSkeleton = !memberStats || !cashbackSummary || isCashbackLoading;

  if (showSkeleton) return <DashboardKpiGridSkeleton />;

  return (
    <div className="grid grid-cols-4 gap-4 mb-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-surface-1 border border-border rounded-[14px] p-5 relative transition-all hover:border-border-strong hover:-translate-y-0.5 cursor-pointer"
          onClick={() => router.push(kpi.href)}
        >
          <div className="text-[11px] font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-3">
            {kpi.label}
          </div>
          <div className="text-[28px] font-semibold tracking-tight font-geist-mono mb-2">
            {kpi.value}
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-medium font-geist-mono text-success">
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
