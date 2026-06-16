import Image from 'next/image'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PartnerTier } from '../constants'

type PartnerTierCardProps = {
  tier: PartnerTier
}

const getTierIconSrc = (tierName: string) => `/images/tier_icons/${tierName.toUpperCase()}.png`

export default function PartnerTierCard({ tier }: PartnerTierCardProps) {
  const isActive = Boolean(tier.isCurrent)

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-xl border p-5 max-sm:px-3 max-sm:py-4 shadow-[0_0_15px_rgba(247,240,161,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b7ad61] hover:bg-[#28271f] hover:shadow-[0_0_20px_rgba(247,240,161,0.15)]',
        isActive ? 'border-[#7f7948] bg-[#28271f]' : 'border-[#d8cf73] bg-[#151515]',
      )}
    >
      <div className="border-b border-[#d8cf73]/25 pb-4 transition-colors duration-300 group-hover:border-[#d8cf73]/45">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-300',
              isActive ? 'bg-[#FFD000]' : 'bg-[#292929]',
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
            <h3 className="text-2xl font-bold leading-6 text-white transition-colors duration-300">{tier.name}</h3>
            <p className="text-sm font-medium italic leading-5 text-[#bdbdbd] transition-colors duration-300">{tier.members}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-[#d8cf73]/25 py-4 transition-colors duration-300 group-hover:border-[#d8cf73]/45 [&>span:last-child]:text-sm">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#303030] transition-colors duration-300">
          <img src="/images/partner/commission_icon.svg" alt="" className="h-[18px] w-[16px] object-contain" />
        </span>
        <span className="text-2xl font-bold text-white transition-colors duration-300">{tier.rate}</span>
        <span className="text-xs font-medium text-[#bdbdbd] transition-colors duration-300">Hoa hồng</span>
      </div>

      <div className="space-y-2.5 pt-4">
        {tier.features.map((feature) => (
          <div key={feature} className="flex gap-2.5">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#DAA440] text-white transition-colors duration-300">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-base font-semibold leading-5 text-white transition-colors duration-300">{feature}</span>
          </div>
        ))}
        {tier.disabled.map((feature) => (
          <div key={feature} className="flex gap-2.5">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#2b2b2b] text-[#a7a7a7] transition-colors duration-300">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-base font-medium leading-5 text-[#bdbdbd] transition-colors duration-300">{feature}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
