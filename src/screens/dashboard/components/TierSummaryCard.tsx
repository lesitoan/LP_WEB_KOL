"use client";

import { TierSummaryCardSkeleton } from "@/components/skeletons/dashboard/TierSummaryCardSkeleton";
import { useGetKolCurrentTierQuery, useGetKolTiersQuery } from "@/services/api/tierApi";

function getTierIconSrc(code?: string | null, name?: string | null) {
  const iconKey = (code || name || "").trim().toUpperCase();

  return iconKey ? `/images/tier_icons/${iconKey}.png` : "/images/tier_icons/tier_logo.png";
}



export default function TierSummaryCard() {
  const { data, isLoading } = useGetKolCurrentTierQuery();
  const { data: tiers = [], isLoading: isTiersLoading } = useGetKolTiersQuery();

  if (isLoading || isTiersLoading) {
    return <TierSummaryCardSkeleton />;
  }

  const activeMemberCount = data?.activeMemberCount ?? 0;
  const sortedTiers = [...tiers].sort((a, b) => a.minActiveMembers - b.minActiveMembers);
  const matchedTierByCount =
    sortedTiers
      .filter(
        (tier) =>
          activeMemberCount >= tier.minActiveMembers &&
          (tier.maxActiveMembers === null || activeMemberCount <= tier.maxActiveMembers),
      )
      .at(-1) ?? null;

  const matchedTier = matchedTierByCount ?? data?.matchedTier ?? data?.currentTier ?? null;
  const nextTier = data?.nextTier ?? sortedTiers.find((tier) => tier.minActiveMembers > activeMemberCount) ?? null;
  const membersNeeded =
    data?.membersNeededForNextTier ??
    (nextTier ? Math.max(0, nextTier.minActiveMembers - activeMemberCount) : null);
  const commissionRate = matchedTier?.commissionRatePct ?? data?.kol.currentCommissionRate ?? "—";
  const currentTierName = matchedTier?.name ?? "—";
  const currentTierCode = matchedTier?.code ?? data?.currentTier?.code ?? data?.matchedTier?.code ?? null;
  const nextTierTarget = nextTier?.minActiveMembers ?? activeMemberCount;
  const progressPercent =
    nextTier && nextTierTarget > 0 ? Math.max(0, Math.min(100, (activeMemberCount / nextTierTarget) * 100)) : 100;

  return (
    <section className="relative mb-4 overflow-hidden rounded-[14px] border-2 border-yellow-200 bg-surface-2 p-5 shadow-[10px_0_24px_rgba(250,255,0,0.16)] md:p-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-black via-black/70 to-transparent" />

      <div className="relative z-[1]">
        <h2 className="mb-5 text-base font-normal text-foreground">Tier hiện tại & Tỷ lệ hoa hồng</h2>

        <div className="grid items-center gap-6 lg:grid-cols-[300px_1fr_124px] 2xl:grid-cols-[360px_1fr_124px]">
          <div className="flex items-center gap-5 border-border-strong lg:border-r lg:pr-7">
            <div className="relative grid h-[92px] w-[92px] shrink-0 place-items-center">
              <div className="absolute h-14 w-14 rounded-full bg-amber-500/30 blur-2xl" />
              <img
                src={getTierIconSrc(currentTierCode, currentTierName)}
                alt={currentTierName === "—" ? "Tier" : currentTierName}
                className="relative h-[78px] w-[78px] object-contain drop-shadow-[0_10px_26px_rgba(245,158,11,0.35)]"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[36px] font-bold uppercase leading-none tracking-normal text-yellow-100">
                {currentTierName}
              </div>
              <p className="mt-4 text-xl font-medium text-zinc-300">Tier hiện tại</p>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-4 text-xl font-semibold">
              <span className="text-yellow-300">{activeMemberCount}</span>
              {nextTier ? (
                <span className="text-foreground"> / {nextTierTarget} members</span>
              ) : (
                <span className="text-muted-foreground"> active members</span>
              )}
            </div>
            <div className="h-2 rounded-full bg-surface-4">
              <div
                className="h-full rounded-full bg-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.55)] transition-all duration-500"
                style={{ width: `${progressPercent}%`, minWidth: progressPercent > 0 ? 4 : 0 }}
              />
            </div>
            {nextTier ? (
              <p className="mt-4 text-lg font-medium text-zinc-200">
                Bạn còn <span className="text-sky-400">{membersNeeded}</span> active members để lên hạng{" "}
                <span className="font-bold text-yellow-300">{nextTier.name}</span>
              </p>
            ) : (
              <p className="mt-4 text-base font-medium text-zinc-300">Bạn đang ở tier cao nhất</p>
            )}
          </div>

          <div className="border-border-strong text-left lg:border-l lg:pl-6 lg:text-center">
            <div className="text-[40px] font-bold leading-none">{commissionRate}%</div>
            <div className="mt-5 text-xl font-medium text-zinc-300">Hoa hồng</div>
          </div>
        </div>
      </div>
    </section>
  );
}
