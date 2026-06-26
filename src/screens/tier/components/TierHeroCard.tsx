import { useGetKolCurrentTierQuery, useGetKolTiersQuery } from '@/services/api/tierApi'
import { TierHeroCardSkeleton } from '@/components/skeletons/TierHeroCardSkeleton'

function getTierIconSrc(code?: string | null, name?: string | null) {
  const iconKey = (code || name || '').trim().toUpperCase()

  return iconKey ? `/images/tier_icons/${iconKey}_icon_active.svg` : '/images/tier_icons/tier_logo.png'
}

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
  const currentTierCode = matchedTier?.code ?? data?.currentTier?.code ?? data?.matchedTier?.code ?? null
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
      <div className="rounded-card bg-surface-card p-3 sm:p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3 xl:gap-5">
          <div className="grid shrink-0 grid-cols-[0.8fr_1.25fr_0.58fr] divide-x divide-border-strong sm:grid-cols-[0.9fr_1.35fr_0.75fr] md:w-auto lg:max-w-[46%] xl:max-w-none">
            <div className="flex min-w-0 flex-col items-center justify-center px-1 py-2 sm:px-1.5 md:px-2 md:py-3 lg:px-1.5 lg:py-2 xl:px-6 xl:py-4">
              <div className="mb-1 text-[30px] font-bold leading-none text-foreground sm:mb-1.5 sm:text-[40px] md:mb-2 lg:text-[30px] xl:text-[34px] 2xl:text-[36px]">
                {commissionRate}%
              </div>
              <div className="text-center text-sm text-muted-foreground sm:text-[20px] lg:text-base xl:text-lg 2xl:text-lg">Hoa hồng</div>
            </div>

            <div className="flex min-w-0 flex-col items-center justify-center px-1 py-2 md:px-1.5 md:py-3 lg:px-1.5 lg:py-2 xl:px-6 xl:py-4">
              <div className="mb-1 max-w-full whitespace-nowrap bg-[linear-gradient(90deg,#FCF19D_0%,#DAA440_100%)] bg-clip-text text-center text-[30px] font-bold uppercase leading-[38px] text-transparent sm:mb-1.5 sm:text-[40px] sm:leading-[52px] md:mb-2 lg:text-[30px] lg:leading-[38px] xl:text-[34px] xl:leading-[44px] 2xl:text-[36px] 2xl:leading-[46px]">
                {currentTierName}
              </div>
              <div className="text-center text-sm text-muted-foreground sm:text-[20px] lg:text-base xl:text-lg 2xl:text-lg">Tier hiện tại</div>
            </div>

            <div className="flex items-center justify-center px-1 py-2 sm:px-1.5 md:px-2 md:py-3 lg:px-1.5 lg:py-2 xl:px-6 xl:py-4">
              <img
                src={getTierIconSrc(currentTierCode, currentTierName)}
                alt={currentTierName === '—' ? 'Tier' : currentTierName}
                className="h-9 w-9 object-contain sm:h-10 sm:w-10 md:h-16 md:w-16 lg:h-12 lg:w-12 xl:h-16 xl:w-16"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center rounded-lg bg-white/[0.06] p-3 backdrop-blur-[20px] sm:p-4">
            <div className="mb-3 flex shrink-0 items-start justify-between gap-4 text-base sm:text-xl">
              <div>
                <strong className="font-semibold text-brand">{activeMemberCount}</strong>
                {nextTier ? (
                  <span className="text-sm text-foreground sm:text-base"> / {nextTierTarget} members</span>
                ) : (
                  <span className="text-sm text-muted-foreground sm:text-base"> active members</span>
                )}
              </div>
              <span className="text-sm font-medium leading-none text-foreground sm:text-base">{Math.round(progressPercent)}%</span>
            </div>

            <div className="mb-3 h-2 w-full shrink-0 overflow-hidden rounded-full bg-surface-4">
              <div
                className="h-full rounded-full transition-all duration-500 bg-brand"
                style={{
                  width: `${progressPercent}%`,
                  minWidth: progressPercent > 0 ? 4 : 0,
                }}
              />
            </div>

            {nextTier ? (
              <p className="text-sm font-medium leading-[18px] text-foreground sm:text-base sm:leading-5">
                Bạn còn{' '}
                <span className="font-medium text-brand-bright">{membersNeeded}</span> active members để lên
                hạng{' '}
                <span className="font-bold text-brand">
                  {nextTier.name?.toUpperCase()}
                  {nextTier.commissionRatePct ? ` - ${nextTier.commissionRatePct}% HOA HỒNG` : ''}
                </span>
              </p>
            ) : (
              <p className="text-sm leading-[18px] text-muted-foreground sm:text-base sm:leading-5">
                Bạn đang ở tier cao nhất
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
