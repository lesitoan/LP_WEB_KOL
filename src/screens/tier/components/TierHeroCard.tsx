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
      className="mb-6 rounded-2xl p-[2px]"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(255, 234, 116, 0.5) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0) 65%, rgba(255, 234, 116, 0.5) 100%)',
      }}
    >
      <div className="rounded-[14px] bg-[#171717] p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3 xl:gap-5">
          <div className="grid shrink-0 grid-cols-[0.9fr_1.35fr_0.75fr] divide-x divide-[#262626] md:w-auto lg:max-w-[46%] xl:max-w-none">
            <div className="flex min-w-0 flex-col items-center justify-center px-1.5 py-2 md:px-2 md:py-3 lg:px-1.5 lg:py-2 xl:px-6 xl:py-4">
              <div className="mb-1.5 text-xl font-bold leading-none text-foreground md:mb-2 md:text-[28px] lg:text-2xl xl:text-[28px]">
                {commissionRate}%
              </div>
              <div className="text-center text-[11px] text-muted-foreground md:text-[13px]">Tỷ lệ hoa hồng</div>
            </div>

            <div className="flex min-w-0 flex-col items-center justify-center px-1 py-2 md:px-1.5 md:py-3 lg:px-1.5 lg:py-2 xl:px-6 xl:py-4">
              <div className="mb-1.5 max-w-full whitespace-nowrap text-center text-[20px] font-bold uppercase leading-tight bg-gradient-to-r from-[#FFFBE5] to-[#FFEA74] bg-clip-text text-transparent sm:text-[24px] md:mb-2 md:text-[28px] md:leading-[36px] lg:text-2xl lg:leading-tight xl:text-[40px] xl:leading-[52px]">
                {currentTierName}
              </div>
              <div className="text-center text-[11px] text-muted-foreground md:text-[13px]">Tier hiện tại</div>
            </div>

            <div className="flex items-center justify-center px-1.5 py-2 md:px-2 md:py-3 lg:px-1.5 lg:py-2 xl:px-6 xl:py-4">
              <img
                src="/images/tier_icons/tier_logo.png"
                alt="Tier"
                className="h-10 w-10 object-contain md:h-16 md:w-16 lg:h-12 lg:w-12 xl:h-16 xl:w-16"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center rounded-lg bg-white/[0.06] p-4 backdrop-blur-[20px]">
            <div className="mb-3 shrink-0 text-[13px]">
              <strong className="font-semibold text-[#FFD000]">{activeMemberCount}</strong>
              {nextTier ? (
                <span className="text-foreground"> / {nextTierTarget} members</span>
              ) : (
                <span className="text-muted-foreground"> active members</span>
              )}
            </div>

            <div className="mb-3 h-2 w-full shrink-0 overflow-hidden rounded-full bg-[#262626]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  minWidth: progressPercent > 0 ? 4 : 0,
                  backgroundColor: '#FFD000',
                }}
              />
            </div>

            {nextTier ? (
              <p className="text-[11px] leading-5 text-foreground md:text-[13px]">
                Bạn còn{' '}
                <strong className="font-semibold text-brand-bright">{membersNeeded}</strong> active members để lên
                hạng <strong className="font-bold text-[#FFD000]">{nextTier.name}</strong>
              </p>
            ) : (
              <p className="text-[11px] leading-5 text-muted-foreground md:text-[13px]">
                Bạn đang ở tier cao nhất
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
