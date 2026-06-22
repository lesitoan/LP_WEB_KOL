"use client";

import { Triangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { formatVnd } from "@/lib/formatMoney";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/services/api/authApi";
import { useGetKolCashbackCommissionQuery } from "@/services/api/cashbackApi";
import { useGetKolDashboardSummaryQuery } from "@/services/api/dashboardApi";
import type { KolDashboardMetricKey, KolDashboardTrendSummary } from "@/types/api";
import { defaultDateRange, type DashboardSegment } from "../constants";
import { OverviewSkeleton } from "@/components/skeletons/dashboard/OverviewSkeleton";

const metricIconSrcs: Record<Exclude<KolDashboardMetricKey, "commission">, string> = {
  referral: "/images/dashboard/overview/refferal_icon.svg",
  deposit: "/images/dashboard/overview/deposit_icon.svg",
  trade: "/images/dashboard/overview/trade_icon.svg",
  kyc: "/images/dashboard/overview/kyc_icon.svg",
};

type OverviewMetricKey = Exclude<KolDashboardMetricKey, "commission">;

interface OverviewMetricCard {
  key: OverviewMetricKey;
  title: string;
  trend: KolDashboardTrendSummary | undefined;
}

const fallbackMetricOrder: OverviewMetricKey[] = ["referral", "deposit", "trade", "kyc"];

function isDashboardSegment(value: string | null): value is DashboardSegment {
  return value === "all" || value === "spot" || value === "future";
}

function formatNumber(value: number | undefined) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function formatMetricValue(metric: OverviewMetricCard) {
  if (metric.key === "deposit" || metric.key === "trade") {
    return `${formatVnd(metric.trend?.current)}`;
  }

  return formatNumber(metric.trend?.current);
}

function formatTrend(trend: KolDashboardTrendSummary | undefined) {
  if (!trend || typeof trend.growthPercentage !== "number") {
    return "Chưa có dữ liệu kỳ trước";
  }

  const sign = trend.growthPercentage > 0 ? "+" : "";
  const value = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
  }).format(trend.growthPercentage);

  return `${sign}${value}% so với kỳ trước`;
}

export default function OverviewSection() {
  const searchParams = useSearchParams();
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isFetching: isCurrentUserFetching,
  } = useGetCurrentUserQuery();
  const selectedSegment = isDashboardSegment(searchParams.get("segment"))
    ? searchParams.get("segment")
    : "all";
  const hasDateRangeParams = searchParams.has("from") || searchParams.has("to");
  const isGetAllTime = searchParams.get("getalltime") === "true" || !hasDateRangeParams;
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;
  const isInvalidRange = !isGetAllTime && Boolean(from && to && to < from);
  const lpexUid = currentUser?.lpexUid?.trim();
  const { data, isLoading, isFetching } = useGetKolDashboardSummaryQuery(
    {
      startDate: isGetAllTime ? undefined : from,
      endDate: isGetAllTime ? undefined : to,
    },
    { skip: isInvalidRange },
  );
  const {
    data: commissionData,
    isLoading: isCommissionLoading,
    isFetching: isCommissionFetching,
  } = useGetKolCashbackCommissionQuery(
    { lpexUid: lpexUid ?? "" },
    { skip: !lpexUid },
  );
  const totalCommission =
    selectedSegment === "spot"
      ? (commissionData?.spot.commission ?? 0)
      : selectedSegment === "future"
        ? (commissionData?.future.commission ?? 0)
        : (commissionData?.spot.commission ?? 0) + (commissionData?.future.commission ?? 0);
  const isInitialLoading =
    isLoading ||
    isCurrentUserLoading ||
    isCurrentUserFetching ||
    (Boolean(lpexUid) && isCommissionLoading);

  if (isInitialLoading) {
    return <OverviewSkeleton />;
  }

  const metricCards = ([
    { key: "referral", title: "Lượt giới thiệu", trend: data?.referralTrend },
    { key: "deposit", title: "Nạp tiền", trend: data?.depositTrend },
    { key: "trade", title: "Giao dịch", trend: data?.tradeTrend },
    { key: "kyc", title: "KYC", trend: data?.kycTrend },
  ] satisfies OverviewMetricCard[]).sort(
    (a, b) => fallbackMetricOrder.indexOf(a.key) - fallbackMetricOrder.indexOf(b.key),
  );

  return (
    <section className={cn("mb-4 rounded-[14px] bg-surface-2 p-5 md:p-6", (isFetching || isCommissionFetching) && "opacity-80")}>
      <h2 className="mb-5 text-base font-semibold text-foreground">Chỉ số tổng quan</h2>

      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <div className="min-h-[228px] rounded-md bg-[url('/images/dashboard/hero_bg_gradient.png')] bg-cover bg-center p-6">
          <div className="flex h-full flex-col justify-center">
            <div className="mb-7 flex items-center gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full">
                <img src="/images/bitcoin_logo.png" alt="" className="h-10 w-10 object-contain" />
              </span>
              <span className="text-sm font-medium uppercase text-white">Tổng số hoa hồng</span>
            </div>
            <div className="text-[40px] font-bold leading-tight tracking-normal text-white md:text-[40px]">
              {formatVnd(totalCommission)} <span className="text-[32px] font-medium">VNĐ</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {metricCards.map((metric) => {
            const delta = metric.trend?.delta ?? 0;
            const isDown = delta < 0;
            const isNeutral = delta === 0;

            return (
              <article key={metric.key} className="rounded-md bg-[#1f1f1f] p-6">
                <div className="mb-6 flex items-center gap-3">
                  <img
                    src={metricIconSrcs[metric.key as Exclude<KolDashboardMetricKey, "commission">]}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                  <h3 className="text-sm font-medium uppercase text-zinc-400">{metric.title}</h3>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="text-[32px] font-bold leading-none text-white">{formatMetricValue(metric)}</div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-normal",
                      isNeutral ? "text-zinc-400" : isDown ? "text-red-400" : "text-emerald-400",
                    )}
                  >
                    {!isNeutral ? (
                      <Triangle className={cn("h-3 w-3 fill-current", isDown && "rotate-180")} aria-hidden="true" />
                    ) : null}
                    {formatTrend(metric.trend)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
