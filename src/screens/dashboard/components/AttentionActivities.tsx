"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGetKolRecentActivitiesQuery } from "@/services/api/dashboardApi";
import { AttentionActivitiesSkeleton } from "@/components/skeletons/dashboard/AttentionActivitiesSkeleton";
import { getAttentionActivityConfig, getAttentionActivityHref } from "../constants";

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
  const router = useRouter();
  const { data: activities = [], isLoading, isFetching, error } = useGetKolRecentActivitiesQuery({ limit: 5 });

  return (
    <section className={cn("rounded-card bg-surface-2 p-5 lg:p-4 xl:p-6", isFetching && "opacity-80")}>
      <h2 className="mb-6 text-base font-semibold text-foreground lg:mb-5 lg:text-sm xl:mb-6 xl:text-base">
        Hoạt động cần chú ý
      </h2>

      <div className="grid grid-cols-[48px_1fr_54px] gap-2 border-b border-transparent pb-3 text-[11px] text-zinc-400 md:grid-cols-[64px_1fr_64px] md:gap-3 md:text-xs lg:grid-cols-[52px_1fr_58px] xl:grid-cols-[64px_1fr_64px]">
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
            const activityConfig = getAttentionActivityConfig(activity.type);
            const Icon = activityConfig.icon;

            return (
              <div
                key={`${activity.occurredAt}-${activity.type}-${activity.title}`}
                className="grid grid-cols-[48px_1fr_54px] items-center gap-2 border-b border-border py-3 last:border-b-0 md:grid-cols-[64px_1fr_64px] md:gap-3 lg:grid-cols-[52px_1fr_58px] lg:gap-2 xl:grid-cols-[64px_1fr_64px] xl:gap-3"
              >
                <div className="text-xs text-zinc-300 md:text-base lg:text-sm xl:text-base">
                  {formatActivityTime(activity.occurredAt)}
                </div>
                <div className="flex min-w-0 items-center gap-2 md:gap-3 lg:gap-2 xl:gap-3">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full md:h-7 md:w-7 ${activityConfig.iconClassName}`}
                  >
                    <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <p className="truncate text-xs font-normal text-zinc-100 md:text-base lg:text-sm xl:text-base">
                    {activity.title}
                  </p>
                </div>
                <button
                  type="button"
                  title={activity.description}
                  onClick={() => router.push(getAttentionActivityHref(activity.type, activity.metadata))}
                  className="inline-flex h-7 items-center justify-center gap-1 rounded-full bg-surface-3 px-2 text-[11px] text-zinc-100 transition-colors hover:bg-surface-4 md:px-3 md:text-xs lg:px-2 xl:px-3"
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
