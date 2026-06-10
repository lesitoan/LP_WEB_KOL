import { CircleCheck, Coins, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KolTier } from '@/types/api'

const TIER_BORDER_GRADIENT =
  'linear-gradient(135deg, rgba(255, 187, 0, 0.75) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0) 65%, rgba(153, 112, 0, 0.75) 100%)'

const TIER_CURRENT_BG =
  'linear-gradient(180deg, rgba(255, 234, 116, 0.14) 0%, rgba(255, 187, 0, 0.1) 45%, rgba(26, 22, 14, 0) 100%), #1a1810'

function splitDescription(description: string | null) {
  if (!description || !description.trim()) {
    return []
  }

  return description
    .split('+')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getTierIconSrc(code: string) {
  return `/images/tier_icons/${code.toUpperCase()}.png`
}

function formatActiveMembers(tier: KolTier) {
  if (tier.maxActiveMembers === null) {
    return `${tier.minActiveMembers.toLocaleString('en-US')}+`
  }

  return `${tier.minActiveMembers.toLocaleString('en-US')} - ${tier.maxActiveMembers.toLocaleString('en-US')}`
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

export default function TierColumn({ tier, isCurrent, layout }: TierColumnProps) {
  const benefits = splitDescription(tier.description)

  const content = (
    <div className="flex h-full flex-col p-5">
      <div className="mb-5 border-b border-[#333333] pb-5">
        <div className="flex items-center gap-3">
          <img
            src={getTierIconSrc(tier.code)}
            alt={tier.name}
            className={`h-10 w-10 object-contain ${isCurrent ? '' : 'opacity-40'}`}
          />
          <span
            className={`text-sm font-bold uppercase tracking-wide ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {tier.name}
          </span>
        </div>
      </div>

      <div className="mb-5 flex items-start gap-3">
        <Coins className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div>
          <div className={`text-[28px] font-bold leading-none ${isCurrent ? 'text-[#FFEA74]' : 'text-foreground'}`}>
            {tier.commissionRatePct}%
          </div>
          <div className="mt-1.5 text-[13px] text-muted-foreground">Commission rate</div>
        </div>
      </div>

      <div className="mb-5 flex items-start gap-3">
        <Users className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div>
          <div className="text-base font-medium text-foreground">{formatActiveMembers(tier)}</div>
          <div className="mt-1 text-[13px] text-muted-foreground">Active members</div>
        </div>
      </div>

      {benefits.length > 0 ? (
        <div className="mt-auto space-y-2.5">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2.5 text-[13px]">
              <CircleCheck
                className="size-[18px] shrink-0 fill-brand text-brand stroke-white"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className={isCurrent ? 'text-foreground' : 'text-muted-foreground'}>{benefit}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <div className={`relative h-full ${isCurrent ? 'z-10' : ''}`}>
      {layout.showBottomMobile ? (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#333333]/70 md:hidden" />
      ) : null}
      {layout.showBottomMd ? (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#333333]/70 hidden md:block lg:hidden" />
      ) : null}
      {layout.showRightMd ? (
        <div className="absolute bottom-0 right-0 top-0 z-0 hidden w-px bg-[#333333]/70 md:block lg:hidden" />
      ) : null}
      {layout.showRightLg ? (
        <div className="absolute bottom-0 right-0 top-0 z-0 hidden w-px bg-[#333333]/70 lg:block" />
      ) : null}

      {isCurrent ? (
        <div
          className={cn(
            'relative z-10 h-full w-full overflow-hidden rounded-[10px] p-[2px]',
            layout.extendRightMd && 'md:w-[calc(100%+1px)]',
            layout.extendRightLg && 'lg:w-[calc(100%+1px)]',
          )}
          style={{ backgroundImage: TIER_BORDER_GRADIENT }}
        >
          <div className="h-full rounded-[8px]" style={{ background: TIER_CURRENT_BG }}>
            {content}
          </div>
        </div>
      ) : (
        content
      )}
    </div>
  )
}
