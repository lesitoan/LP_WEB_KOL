import { useGetKolCurrentTierQuery, useGetKolTiersQuery } from '@/services/api/tierApi'
import { TierHeroCardSkeleton } from '@/components/skeletons/TierHeroCardSkeleton'

export default function TierHeroCard() {
  const { data, isLoading } = useGetKolCurrentTierQuery()
  const { data: tiers = [], isLoading: isTiersLoading } = useGetKolTiersQuery()

  if (isLoading || isTiersLoading) {
    return <TierHeroCardSkeleton />
  }

  const activeMemberCount = data?.activeMemberCount ?? 0
  const sortedTiers = [...tiers].sort((a, b) => a.minActiveMembers - b.minActiveMembers)

  const matchedTierByCount =
    sortedTiers
      .filter(
        (tier) =>
          activeMemberCount >= tier.minActiveMembers &&
          (tier.maxActiveMembers === null || activeMemberCount <= tier.maxActiveMembers),
      )
      .at(-1) ?? null

  const matchedTier = matchedTierByCount ?? data?.matchedTier ?? data?.currentTier ?? null
  const nextTier =
    data?.nextTier ?? sortedTiers.find((tier) => tier.minActiveMembers > activeMemberCount) ?? null

  const membersNeeded =
    data?.membersNeededForNextTier ??
    (nextTier ? Math.max(0, nextTier.minActiveMembers - activeMemberCount) : null)

  const commissionRate = matchedTier?.commissionRatePct ?? data?.kol.currentCommissionRate ?? '—'
  const currentTierName = matchedTier?.name ?? '—'
  const nextTierTarget = nextTier?.minActiveMembers ?? activeMemberCount

  const progressPercent =
    nextTier && nextTierTarget > 0
      ? Math.max(0, Math.min(100, (activeMemberCount / nextTierTarget) * 100))
      : 100

  return (
    <div
      className="rounded-2xl p-[2px] mb-6"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(255, 234, 116, 0.5) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0) 65%, rgba(255, 234, 116, 0.5) 100%)',
      }}
    >
      <div className="rounded-[14px] bg-[#171717] p-4 md:p-5">
        <div className="mb-5 grid grid-cols-3 divide-x divide-[#262626]">
          <div className="flex min-w-0 flex-col items-center justify-center px-2 py-2 md:px-4 md:py-3">
            <div className="mb-1.5 text-[clamp(0.875rem,4vw,1.25rem)] font-bold leading-tight text-foreground md:mb-2 md:text-[clamp(1.25rem,3vw,1.75rem)]">
              {commissionRate}%
            </div>
            <div className="text-center text-[11px] text-muted-foreground md:text-[13px]">Tỷ lệ hoa hồng</div>
          </div>

          <div className="flex min-w-0 flex-col items-center justify-center px-2 py-2 md:px-4 md:py-3">
            <div className="mb-1.5 max-w-full break-words text-center text-[clamp(0.875rem,4vw,1.25rem)] font-bold uppercase leading-tight bg-gradient-to-r from-[#FFFBE5] to-[#FFEA74] bg-clip-text text-transparent md:mb-2 md:text-[clamp(1.25rem,3vw,1.75rem)] md:leading-tight">
              {currentTierName}
            </div>
            <div className="text-center text-[11px] text-muted-foreground md:text-[13px]">Tier hiện tại</div>
          </div>

          <div className="flex items-center justify-center px-2 py-2 md:px-4 md:py-3">
            <img
              src="/images/tier_icons/tier_logo.png"
              alt="Tier"
              className="h-10 w-10 object-contain md:h-16 md:w-16"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white/[0.06] backdrop-blur-[20px] p-4">
          <div className="text-[13px] mb-3">
            <strong className="text-[#FFEA74] font-semibold">{activeMemberCount}</strong>
            {nextTier ? (
              <span className="text-foreground"> / {nextTierTarget} members</span>
            ) : (
              <span className="text-muted-foreground"> active members</span>
            )}
          </div>

          <div className="h-2 bg-[#262626] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#FFEA74] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {nextTier ? (
            <p className="text-[11px] leading-5 text-foreground md:text-[13px]">
              Bạn còn{' '}
              <strong className="text-brand-bright font-semibold">{membersNeeded}</strong> active
              members để lên hạng{' '}
              <strong className="text-[#FFEA74] font-bold">{nextTier.name}</strong>
            </p>
          ) : (
            <p className="text-[11px] leading-5 text-muted-foreground md:text-[13px]">Bạn đang ở tier cao nhất</p>
          )}
        </div>
      </div>
    </div>
  )
}
