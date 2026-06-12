"use client";

import { Eye } from "lucide-react";
import { attentionActivities } from "../constants";

export default function AttentionActivities() {
  return (
    <section className="rounded-[14px] bg-surface-2 p-5 lg:p-4 xl:p-6">
      <h2 className="mb-6 text-base font-semibold text-foreground lg:mb-5 lg:text-sm xl:mb-6 xl:text-base">
        Hoạt động cần chú ý
      </h2>

      <div className="grid grid-cols-[64px_1fr_64px] gap-3 border-b border-transparent pb-3 text-xs text-zinc-400 lg:grid-cols-[52px_1fr_58px] xl:grid-cols-[64px_1fr_64px]">
        <span>Thời gian</span>
        <span>Chi tiết hoạt động</span>
        <span className="sr-only">Hành động</span>
      </div>

      <div>
        {attentionActivities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={`${activity.time}-${activity.content}`}
              className="grid grid-cols-[64px_1fr_64px] items-center gap-3 border-b border-border py-3 last:border-b-0 lg:grid-cols-[52px_1fr_58px] lg:gap-2 xl:grid-cols-[64px_1fr_64px] xl:gap-3"
            >
              <div className="text-base text-zinc-300 lg:text-sm xl:text-base">{activity.time}</div>
              <div className="flex min-w-0 items-center gap-3 lg:gap-2 xl:gap-3">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${activity.iconClassName}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <p className="truncate text-base font-semibold text-zinc-100 lg:text-sm xl:text-base">
                  {activity.content}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-7 items-center justify-center gap-1 rounded-full bg-surface-3 px-3 text-xs text-zinc-100 transition-colors hover:bg-surface-4 lg:px-2 xl:px-3"
              >
                <Eye className="h-3.5 w-3.5" />
                Xem
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
