import { useGetKolCurrentTierQuery } from '@/services/api/tierApi'
import { PageLoading } from '@/components/ui/pageLoading'

function formatTierCode(code: string | undefined) {
  if (!code) return '---'
  return code.toUpperCase()
}

export default function TierHeroCard() {
  const { data, isLoading } = useGetKolCurrentTierQuery()

  if (isLoading) {
    return <PageLoading className="min-h-[30vh] mb-6" />
  }

  const activeMemberCount = data?.activeMemberCount ?? 0
  const matchedTier = data?.matchedTier
  const nextTier = data?.nextTier
  const membersNeeded = data?.membersNeededForNextTier

  const currentTierName = formatTierCode(matchedTier?.code || data?.currentTier?.code)

  const min = matchedTier?.minActiveMembers ?? 0
  const max = matchedTier?.maxActiveMembers ?? null
  const progressPercent =
    max === null || max <= min
      ? 100
      : Math.max(0, Math.min(100, ((activeMemberCount - min) / (max - min + 1)) * 100))

  const splitBenefits = (matchedTier?.description || '')
    .split('+')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <div className="bg-[radial-gradient(ellipse_at_center_top,hsl(40_78%_55%/0.15),transparent_60%),linear-gradient(180deg,hsl(var(--surface-2)),hsl(var(--surface-1)))] border border-border rounded-[20px] px-8 py-10 text-center mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(40_78%_55%/0.08),transparent_40%),radial-gradient(circle_at_80%_60%,hsl(28_88%_60%/0.05),transparent_40%)] pointer-events-none" />
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-4 rounded-[14px] bg-gradient-to-br from-[hsl(40_78%_55%/0.25)] to-[hsl(40_78%_55%/0.05)] border border-[hsl(40_78%_55%/0.4)] grid place-items-center shadow-[0_0_40px_hsl(var(--brand-glow))]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="hsl(var(--brand))">
            <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5L12 16l-5.5 3.5L8 13 3 8.5 9.5 8z" />
          </svg>
        </div>
        <div className="text-[11px] text-muted-foreground tracking-[0.04em] uppercase font-medium mb-1">
          TIER HIỆN TẠI
        </div>
        <div className="text-4xl font-bold tracking-tight bg-gradient-to-br from-brand to-foreground bg-clip-text text-transparent mb-2">
          {currentTierName}
        </div>

        <div className="max-w-[480px] mx-auto my-5 mb-4">
          <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-dim to-brand rounded-full shadow-[0_0_12px_hsl(var(--brand-glow))]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-[13px]">
            <span>
              <strong className="text-foreground font-semibold">{activeMemberCount}</strong>{' '}
              <span className="text-muted-foreground">active members</span>
            </span>
            <span className="text-muted-foreground">
              {Math.round(progressPercent)}% {'→'} <strong className="text-tier-legend font-semibold">{nextTier ? formatTierCode(nextTier.code) : 'MAX'}</strong>
            </span>
          </div>
        </div>

        <div className="text-[13px] text-muted-foreground mb-4">
          💪 Còn <strong className="text-foreground font-semibold">{membersNeeded ?? 0} active members</strong> nữa{nextTier ? ` để lên ${formatTierCode(nextTier.code)}` : ' để đạt tier cao nhất'}
        </div>

        <div className="inline-flex flex-col gap-2 text-left mx-auto mt-5 p-4 px-5 bg-surface-2 border border-border rounded-lg text-[13px]">
          <div className="text-[11px] text-muted-foreground tracking-[0.04em] uppercase font-medium mb-1">
            {nextTier ? `Lên ${formatTierCode(nextTier.code)}, bạn sẽ unlock` : 'Bạn đang ở tier cao nhất'}
          </div>
          {nextTier ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-brand">✨</span> Commission{' '}
              <strong className="text-foreground">{matchedTier?.commissionRatePct ?? data?.kol.currentCommissionRate ?? '-'}% {'→'} {nextTier.commissionRatePct}%</strong>
            </div>
          ) : null}
          {(nextTier?.description || splitBenefits.join(' + '))
            .split('+')
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 3)
            .map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-muted-foreground">
                <span className="text-brand">✨</span>
                <strong className="text-foreground">{benefit}</strong>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
