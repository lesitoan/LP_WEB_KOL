"use client";

import { Bell, DollarSign, Eye, Gift, TrendingUp, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetKolRecentActivitiesQuery } from "@/services/api/dashboardApi";
import type { KolRecentActivityIcon, KolRecentActivitySeverity } from "@/types/api";
import { AttentionActivitiesSkeleton } from "@/components/skeletons/dashboard/AttentionActivitiesSkeleton";

const activityIcons: Record<KolRecentActivityIcon, LucideIcon> = {
  up: TrendingUp,
  warning: Bell,
  dollar: DollarSign,
  gift: Gift,
};

const severityClassNames: Record<KolRecentActivitySeverity, string> = {
  info: "bg-sky-500/15 text-sky-400",
  warning: "bg-yellow-400/15 text-yellow-300",
  success: "bg-emerald-500/15 text-emerald-400",
};

function formatActivityTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AttentionActivities() {
  const { data: activities = [], isLoading, isFetching, error } = useGetKolRecentActivitiesQuery({ limit: 5 });

  return (
    <section className={cn("rounded-[14px] bg-surface-2 p-5 lg:p-4 xl:p-6", isFetching && "opacity-80")}>
      <h2 className="mb-6 text-base font-semibold text-foreground lg:mb-5 lg:text-sm xl:mb-6 xl:text-base">
        Hoạt động cần chú ý
      </h2>

      <div className="grid grid-cols-[64px_1fr_64px] gap-3 border-b border-transparent pb-3 text-xs text-zinc-400 lg:grid-cols-[52px_1fr_58px] xl:grid-cols-[64px_1fr_64px]">
        <span>Thời gian</span>
        <span>Chi tiết hoạt động</span>
        <span className="sr-only">Hành động</span>
      </div>

      {isLoading ? (
        <AttentionActivitiesSkeleton />
      ) : error ? (
        <p className="py-6 text-sm text-red-400">Không thể tải hoạt động gần đây</p>
      ) : activities.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">Chưa có hoạt động gần đây.</p>
      ) : (
        <div>
          {activities.map((activity) => {
            const Icon = activityIcons[activity.icon];

            return (
              <div
                key={`${activity.occurredAt}-${activity.type}-${activity.title}`}
                className="grid grid-cols-[64px_1fr_64px] items-center gap-3 border-b border-border py-3 last:border-b-0 lg:grid-cols-[52px_1fr_58px] lg:gap-2 xl:grid-cols-[64px_1fr_64px] xl:gap-3"
              >
                <div className="text-base text-zinc-300 lg:text-sm xl:text-base">
                  {formatActivityTime(activity.occurredAt)}
                </div>
                <div className="flex min-w-0 items-center gap-3 lg:gap-2 xl:gap-3">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${severityClassNames[activity.severity]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="truncate text-base font-normal text-zinc-100 lg:text-sm xl:text-base">
                    {activity.title}
                  </p>
                </div>
                <button
                  type="button"
                  title={activity.description}
                  className="inline-flex h-7 items-center justify-center gap-1 rounded-full bg-surface-3 px-3 text-xs text-zinc-100 transition-colors hover:bg-surface-4 lg:px-2 xl:px-3"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Xem
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
