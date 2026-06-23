import Image from 'next/image'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PartnerTier, PartnerTierFeature } from '../constants'

type PartnerTierCardProps = {
  tier: PartnerTier
}

const getTierIconSrc = (tierName: string) => `/images/tier_icons/${tierName.toUpperCase()}.png`

function normalizeFeature(feature: PartnerTierFeature) {
  if (typeof feature !== 'string') {
    return feature
  }

  return {
    id: feature,
    label: feature,
    note: null,
    highlightNote: null,
  }
}

function formatFeatureNote(value?: string | null) {
  const normalizedValue = value?.trim() ?? ''

  if (!normalizedValue) {
    return ''
  }

  return normalizedValue.startsWith('(') ? normalizedValue : `(${normalizedValue})`
}

export default function PartnerTierCard({ tier }: PartnerTierCardProps) {
  const isActive = Boolean(tier.isCurrent)

  const gradientBorder =
    'linear-gradient(135deg, #FCF19D 0%, rgba(252,241,157,0.3) 30%, rgba(252,241,157,0.3) 70%, #FCF19D 100%)'

  return (
    <div
      className="h-full rounded-xl p-px transition-all duration-300 hover:-translate-y-1"
      style={{ background: gradientBorder }}
    >
      <article
        className={cn(
          'group relative flex h-full flex-col rounded-[11px] p-5 max-sm:px-3 max-sm:py-4 shadow-[0_0_15px_rgba(247,240,161,0.03)] transition-all duration-300 hover:bg-[#28271f] hover:shadow-[0_0_20px_rgba(247,240,161,0.15)]',
          isActive ? 'bg-[#28271f]' : 'bg-surface-card',
        )}
      >
      <div className="border-b border-[#d8cf73]/25 pb-4 transition-colors duration-300 group-hover:border-[#d8cf73]/45">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-300',
              isActive ? 'bg-brand' : 'bg-surface-control',
            )}
          >
            <Image
              src={getTierIconSrc(tier.name)}
              alt={`${tier.name} icon`}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </span>
          <div>
            <h3 className="text-2xl font-bold leading-6 uppercase text-[#FFFFFF] transition-colors duration-300">{tier.name}</h3>
            <p className="text-sm font-medium italic leading-5 text-[#D7D8D9] transition-colors duration-300">{tier.members}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-[#d8cf73]/25 py-4 transition-colors duration-300 group-hover:border-[#d8cf73]/45 [&>span:last-child]:text-sm">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-control transition-colors duration-300">
          <img src="/images/partner/commission_icon.svg" alt="" className="h-[18px] w-[16px] object-contain" />
        </span>
        <span className="text-2xl font-bold text-[#FFFFFF] transition-colors duration-300">{tier.rate}</span>
        <span className="text-xs font-medium text-[#D7D8D9] transition-colors duration-300">Hoa hồng</span>
      </div>

      <div className="space-y-2.5 pt-4">
        {tier.features.map((feature) => {
          const normalizedFeature = normalizeFeature(feature)
          const note = formatFeatureNote(normalizedFeature.note)
          const highlightNote = formatFeatureNote(normalizedFeature.highlightNote)

          return (
            <div key={normalizedFeature.id} className="flex gap-2.5">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors duration-300">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="flex min-w-0 flex-col text-base font-semibold leading-5 text-[#FFFFFF] transition-colors duration-300">
                <span>{normalizedFeature.label}</span>
                {note ? <span className="mt-0.5 text-base font-normal text-[#D7D8D9]">{note}</span> : null}
                {highlightNote ? <span className="mt-0.5 text-base font-medium text-[#F7F0A1]">{highlightNote}</span> : null}
              </span>
            </div>
          )
        })}
        {tier.disabled.map((feature) => {
          const normalizedFeature = normalizeFeature(feature)
          const note = formatFeatureNote(normalizedFeature.note)
          const highlightNote = formatFeatureNote(normalizedFeature.highlightNote)

          return (
            <div key={normalizedFeature.id} className="flex gap-2.5">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-surface-control text-muted-foreground transition-colors duration-300">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="flex min-w-0 flex-col text-base font-medium leading-5 text-[#D7D8D9] transition-colors duration-300">
                <span>{normalizedFeature.label}</span>
                {note ? <span className="mt-0.5 text-base font-normal text-[#D7D8D9]">{note}</span> : null}
                {highlightNote ? <span className="mt-0.5 text-base font-medium text-[#D7D8D9]">{highlightNote}</span> : null}
              </span>
            </div>
          )
        })}
      </div>
    </article>
    </div>
  )
}
