import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KolTier, KolTierFeature } from '@/types/api'

const TIER_CARD_BORDER = '#FCF19D'

const TIER_CHECK = '#DAA440'
const TIER_CURRENT_BG =
  'linear-gradient(180deg, rgba(252, 241, 157, 0.12) 0%, rgba(252, 241, 157, 0.07) 100%), #29291f'

function splitDescription(description: string | null) {
  if (!description || !description.trim()) {
    return []
  }

  return description
    .split('+')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getTierOptions(tier: KolTier): KolTierFeature[] {
  if (tier.features?.length) {
    return [...tier.features].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  return splitDescription(tier.description).map((label, index) => ({
    id: label,
    label,
    sortOrder: index + 1,
    isIncluded: true,
  }))
}

function getTierIconSrc(code: string) {
  return `/images/tier_icons/${code.toUpperCase()}.png`
}

function formatFeatureNote(value?: string | null) {
  const normalizedDetail = value?.trim() ?? ''

  if (!normalizedDetail) {
    return ''
  }

  return normalizedDetail.startsWith('(') ? normalizedDetail : `(${normalizedDetail})`
}

function formatActiveMembers(tier: KolTier) {
  if (tier.maxActiveMembers === null) {
    return `${tier.minActiveMembers.toLocaleString('en-US')}+ thành viên`
  }

  return `${tier.minActiveMembers.toLocaleString('en-US')} - ${tier.maxActiveMembers.toLocaleString('en-US')} thành viên`
}

export function getTierColumnLayout(index: number, total: number) {
  const isLast = index === total - 1
  const hasRightNeighborOnMd = index % 2 === 0 && index + 1 < total
  const lastRowStartOnMd = total % 2 === 0 ? total - 2 : total - 1

  return {
    showBottomMobile: !isLast,
    showBottomMd: index < lastRowStartOnMd,
    showRightMd: hasRightNeighborOnMd,
    showRightLg: !isLast,
    extendRightMd: hasRightNeighborOnMd,
    extendRightLg: !isLast,
  }
}

export type TierColumnLayout = ReturnType<typeof getTierColumnLayout>

type TierColumnProps = {
  tier: KolTier
  isCurrent: boolean
  layout: TierColumnLayout
}

export default function TierColumn({ tier, isCurrent }: TierColumnProps) {
  const options = getTierOptions(tier)

  const gradientBorder =
    'linear-gradient(135deg, #FCF19D 0%, rgba(252,241,157,0.3) 30%, rgba(252,241,157,0.3) 70%, #FCF19D 100%)'

  const innerBg = isCurrent ? TIER_CURRENT_BG : 'hsl(var(--surface-card))'

  return (
    <div
      className="h-full rounded-xl p-px"
      style={{ background: gradientBorder }}
    >
      <article
        className={cn(
          'flex h-full flex-col rounded-[11px] p-4 sm:p-5',
          isCurrent ? 'shadow-[0_0_0_1px_rgba(252,241,157,0.18)]' : '',
        )}
        style={{ background: innerBg }}
      >
      <div className="border-b border-white/20 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={getTierIconSrc(tier.code)}
            alt={tier.name}
            className={cn('h-11 w-11 shrink-0 object-contain', isCurrent ? '' : 'opacity-85')}
          />

          <div className="min-w-0">
            <div className="truncate text-xl font-bold uppercase leading-6 tracking-normal text-[#FFFFFF]">
              {tier.name}
            </div>
            <div className="text-sm font-medium italic leading-5 text-[#D7D8D9]">
              {formatActiveMembers(tier)}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/20 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10">
            <img
              src="/images/partner/commission_icon.svg"
              alt="Hoa hồng"
              className="h-[18px] w-4"
            />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-2xl font-bold leading-none text-[#FFFFFF]">
                {tier.commissionRatePct}%
              </span>
              <span className="text-sm font-medium text-[#D7D8D9]">Hoa hồng</span>
            </div>
          </div>
        </div>
      </div>

      {options.length > 0 ? (
        <div className="space-y-3 pt-4">
          {options.map((option) => {
            const note = formatFeatureNote(option.note)
            const highlightNote = formatFeatureNote(option.highlightNote)

            return (
              <div key={option.id} className="flex items-start gap-2.5">
                {option.isIncluded ? (
                  <span
                    className="mt-0.5 flex size-[17px] shrink-0 items-center justify-center rounded-full border text-white"
                    style={{ backgroundColor: TIER_CHECK, borderColor: TIER_CARD_BORDER }}
                  >
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="mt-0.5 flex size-[17px] shrink-0 items-center justify-center rounded-full bg-surface-control text-muted-foreground border border-border-strong">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
                <span
                  className={cn(
                    'flex min-w-0 flex-col text-base leading-5',
                    option.isIncluded ? 'font-semibold text-[#FFFFFF]' : 'font-medium text-[#D7D8D9]',
                  )}
                >
                  <span>{option.label}</span>
                  {note ? (
                    <span className="mt-0.5 text-base font-normal text-[#D7D8D9]">
                      {note}
                    </span>
                  ) : null}
                  {highlightNote ? (
                    <span
                      className={cn('mt-0.5 text-base font-medium', !option.isIncluded && 'text-[#D7D8D9]')}
                      style={option.isIncluded ? { color: '#F7F0A1' } : undefined}
                    >
                      {highlightNote}
                    </span>
                  ) : null}
                </span>
              </div>
            )
          })}
        </div>
      ) : null}
    </article>
    </div>
  )
}
