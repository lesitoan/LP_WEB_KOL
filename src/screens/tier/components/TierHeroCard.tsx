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
      <div className="rounded-[14px] bg-[#171717] p-5">
        <div className="grid grid-cols-3 divide-x divide-[#262626] mb-5">
          <div className="flex flex-col items-center justify-center px-4 py-3">
            <div className="text-[28px] font-bold text-foreground leading-none mb-2">
              {commissionRate}%
            </div>
            <div className="text-[13px] text-muted-foreground">Tỷ lệ hoa hồng</div>
          </div>

          <div className="flex flex-col items-center justify-center px-4 py-3">
            <div className="text-[40px] font-bold uppercase leading-[52px] mb-2 bg-gradient-to-r from-[#FFFBE5] to-[#FFEA74] bg-clip-text text-transparent">
              {currentTierName}
            </div>
            <div className="text-[13px] text-muted-foreground">Tier hiện tại</div>
          </div>

          <div className="flex items-center justify-center px-4 py-3">
            <img
              src="/images/tier_icons/tier_logo.png"
              alt="Tier"
              className="w-16 h-16 object-contain"
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
            <p className="text-[13px] text-foreground">
              Bạn còn{' '}
              <strong className="text-brand-bright font-semibold">{membersNeeded}</strong> active
              members để lên hạng{' '}
              <strong className="text-[#FFEA74] font-bold">{nextTier.name}</strong>
            </p>
          ) : (
            <p className="text-[13px] text-muted-foreground">Bạn đang ở tier cao nhất</p>
          )}
        </div>
      </div>
    </div>
  )
}
