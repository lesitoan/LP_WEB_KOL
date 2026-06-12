"use client";

import { Triangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { commissionTotal, overviewMetrics } from "../constants";

export default function OverviewSection() {
  const CommissionIcon = commissionTotal.icon;

  return (
    <section className="mb-4 rounded-[14px] bg-surface-2 p-5 md:p-6">
      <h2 className="mb-5 text-base font-semibold text-foreground">Chỉ số tổng quan</h2>

      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <div className="min-h-[228px] rounded-md bg-[linear-gradient(135deg,#0f2945_0%,#12385b_46%,#0ea5e9_140%)] p-6 shadow-[inset_-28px_-28px_70px_rgba(14,165,233,0.18)]">
          <div className="flex h-full flex-col justify-center">
            <div className="mb-7 flex items-center gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-yellow-400 text-white">
                <CommissionIcon className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold uppercase text-white">{commissionTotal.label}</span>
            </div>
            <div className="text-[38px] font-bold leading-tight tracking-normal text-white md:text-[40px]">
              {commissionTotal.value}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {overviewMetrics.map((metric) => {
            const Icon = metric.icon;
            const isUp = metric.trendDirection === "up";

            return (
              <article key={metric.label} className="rounded-md bg-[#1f1f1f] p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Icon className="h-7 w-7 text-sky-400" />
                  <h3 className="text-sm font-bold uppercase text-zinc-400">{metric.label}</h3>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="text-[32px] font-bold leading-none text-white">{metric.value}</div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium",
                      isUp ? "text-emerald-400" : "text-red-400",
                    )}
                  >
                    <Triangle
                      className={cn("h-3 w-3 fill-current", !isUp && "rotate-180")}
                      aria-hidden="true"
                    />
                    {metric.trend}
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
