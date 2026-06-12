"use client";

import { tierSummary } from "../constants";

export default function TierSummaryCard() {
  const progressPercent = Math.min(100, (tierSummary.currentMembers / tierSummary.targetMembers) * 100);

  return (
    <section className="relative mb-4 overflow-hidden rounded-[14px] border-2 border-yellow-200 bg-surface-2 p-5 shadow-[10px_0_24px_rgba(250,255,0,0.16)] md:p-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-black via-black/70 to-transparent" />

      <div className="relative z-[1]">
        <h2 className="mb-5 text-base font-semibold text-foreground">Tier hiện tại & Tỷ lệ hoa hồng</h2>

        <div className="grid items-center gap-6 lg:grid-cols-[300px_1fr_124px]">
          <div className="flex items-center gap-5 border-border-strong lg:border-r lg:pr-7">
            <div className="relative grid h-[92px] w-[92px] shrink-0 place-items-center">
              <div className="absolute h-14 w-14 rounded-full bg-amber-500/30 blur-2xl" />
              <div className="relative grid h-[66px] w-[66px] place-items-center rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-200 via-amber-600 to-yellow-950 text-3xl shadow-[0_10px_30px_rgba(245,158,11,0.35)]">
                ★
              </div>
              <div className="absolute top-1 h-9 w-14 rounded-b-[18px] border-x-[12px] border-t-[18px] border-x-transparent border-t-amber-950/70" />
            </div>

            <div className="min-w-0">
              <div className="text-[36px] font-bold leading-none tracking-normal text-yellow-100">
                {tierSummary.tierName}
              </div>
              <p className="mt-4 text-lg font-semibold text-zinc-300">Tier hiện tại</p>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-4 text-lg font-semibold">
              <span className="text-yellow-300">{tierSummary.currentMembers}</span>
              <span className="text-foreground"> / {tierSummary.targetMembers} members</span>
            </div>
            <div className="h-2 rounded-full bg-surface-4">
              <div
                className="h-full rounded-full bg-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.55)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-4 text-base font-medium text-zinc-200">
              Bạn còn <span className="text-sky-400">{tierSummary.neededMembers}</span> active members để lên hạng{" "}
              <span className="font-bold text-yellow-300">{tierSummary.nextTier}</span>
            </p>
          </div>

          <div className="border-border-strong text-left lg:border-l lg:pl-6 lg:text-center">
            <div className="text-[42px] font-bold leading-none">{tierSummary.commissionRate}</div>
            <div className="mt-5 text-lg font-semibold text-zinc-300">Hoa hồng</div>
          </div>
        </div>
      </div>
    </section>
  );
}
