"use client";

import { Triangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetKolDashboardSummaryQuery } from "@/services/api/dashboardApi";
import type { KolDashboardMetricCard, KolDashboardMetricKey } from "@/types/api";
import { defaultDateRange } from "../constants";
import { OverviewSkeleton } from "@/components/skeletons/dashboard/OverviewSkeleton";

const metricIconSrcs: Record<Exclude<KolDashboardMetricKey, "commission">, string> = {
  referral: "/images/dashboard/overview/refferal_icon.svg",
  deposit: "/images/dashboard/overview/deposit_icon.svg",
  trade: "/images/dashboard/overview/trade_icon.svg",
  kyc: "/images/dashboard/overview/kyc_icon.svg",
};

const fallbackMetricOrder: KolDashboardMetricKey[] = ["referral", "deposit", "trade", "kyc"];

function formatMetricValue(metric: KolDashboardMetricCard) {
  const value = Number(metric.value ?? 0);

  // if (metric.unit === "USD") {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     maximumFractionDigits: 0,
  //   }).format(value);
  // }

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatTrend(metric: KolDashboardMetricCard) {
  if (typeof metric.growthPercentage !== "number" || !metric.comparisonLabel) {
    return "Chưa có dữ liệu kỳ trước";
  }

  const sign = metric.growthPercentage > 0 ? "+" : "";
  const value = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
  }).format(metric.growthPercentage);

  return `${sign}${value}% ${metric.comparisonLabel}`;
}

export default function OverviewSection() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;
  const isInvalidRange = Boolean(from && to && to < from);
  const { data, isLoading, isFetching } = useGetKolDashboardSummaryQuery(
    {
      startDate: from,
      endDate: to,
    },
    { skip: isInvalidRange },
  );

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  const heroCard = data?.heroCard;
  const metricCards =
    data?.metricCards?.length
      ? [...data.metricCards].sort(
          (a, b) => fallbackMetricOrder.indexOf(a.key) - fallbackMetricOrder.indexOf(b.key),
        )
      : [];

  return (
    <section className={cn("mb-4 rounded-[14px] bg-surface-2 p-5 md:p-6", isFetching && "opacity-80")}>
      <h2 className="mb-5 text-base font-semibold text-foreground">Chỉ số tổng quan</h2>

      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <div className="min-h-[228px] rounded-md bg-[url('/images/dashboard/hero_bg_gradient.png')] bg-cover bg-center p-6">
          <div className="flex h-full flex-col justify-center">
            <div className="mb-7 flex items-center gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full">
                <img src="/images/bitcoin_logo.png" alt="" className="h-10 w-10 object-contain" />
              </span>
              <span className="text-sm font-medium uppercase text-white">{heroCard?.title ?? "Tổng số hoa hồng"}</span>
            </div>
            <div className="text-[40px] font-bold leading-tight tracking-normal text-white md:text-[40px]">
              {heroCard ? formatMetricValue(heroCard) : "0"}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {metricCards.map((metric) => {
            const isDown = metric.trend === "down";
            const isNeutral = metric.trend === "neutral" || metric.trend === null;

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
                    {formatTrend(metric)}
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
