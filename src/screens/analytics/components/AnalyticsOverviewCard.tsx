"use client";

import AnalyticsOverviewCardSkeleton from "@/components/skeletons/analytics/AnalyticsOverviewCardSkeleton"
import { cn } from "@/lib/utils";
import { useGetKolDashboardGroupSummaryQuery } from "@/services/api/dashboardApi";
import { useSearchParams } from "next/navigation";

const defaultDateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
  to: new Date().toISOString().split("T")[0],
};

function formatCount(value: number | undefined) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatCommission(value: number | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value ?? 0));
}

function StatCard({
  iconSrc,
  label,
  value,
}: {
  iconSrc: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg bg-[#28282880] p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium uppercase text-muted-foreground">
        <img src={iconSrc} alt="" className="h-8 w-8 object-contain" />
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-foreground sm:text-[32px]">{value}</div>
    </div>
  );
}

export default function AnalyticsOverviewCard() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;
  const isInvalidRange = Boolean(from && to && to < from);
  const requestedGroupId = searchParams.get("groupId");
  const { data, isLoading, isFetching } = useGetKolDashboardGroupSummaryQuery(
    {
      startDate: from,
      endDate: to,
      groupId: requestedGroupId ?? undefined,
    },
    { skip: isInvalidRange },
  );

  if (isLoading) {
    return <AnalyticsOverviewCardSkeleton />;
  }

  const cards = data?.cards;

  return (
    <section className={cn("mb-5 rounded-[14px] border border-border bg-[#171717] p-4 sm:p-5", isFetching && "opacity-80")}>
      <h2 className="mb-4 text-base font-medium">Chỉ số tổng quan nhóm</h2>
      <div className="grid gap-3 lg:grid-cols-[1.05fr_2.15fr]">
        <div className="relative overflow-hidden rounded-lg bg-[#28282880] bg-[url('/images/analytics/hero_bg_gradient.png')] bg-cover bg-center p-6">
          <div className="relative flex min-h-[220px] flex-col items-start justify-center">
            <div className="mb-8 flex items-center gap-3">
              <img
                src="/images/bitcoin_logo.png"
                alt=""
                aria-hidden="true"
                className="h-10 w-10 shrink-0 object-contain"
              />
              <span className="text-base font-medium uppercase text-foreground">
                Tổng số hoa hồng
              </span>
            </div>
            <div className="text-[36px] font-bold leading-none tracking-tight text-foreground sm:text-[40px]">
              {formatCommission(cards?.totalCommission.value)}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard iconSrc="/images/analytics/warning_icon.svg" label="Số đang bị cảnh báo" value={formatCount(cards?.warningCount.value)} />
          <StatCard iconSrc="/images/analytics/total_members_icon.svg" label="Số lượng members" value={formatCount(cards?.memberCount.value)} />
          <StatCard iconSrc="/images/analytics/kick_member_icon.svg" label="Số bị kick" value={formatCount(cards?.kickedCount.value)} />
          <StatCard iconSrc="/images/analytics/join_icon.svg" label="Số tham gia mới" value={formatCount(cards?.newJoinCount.value)} />
        </div>
      </div>
    </section>
  );
}
