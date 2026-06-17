import Image from 'next/image'
import type { PartnerTier } from '../constants'
import PartnerTierCard from './PartnerTierCard'

type PartnerTierSectionProps = {
  tiers: PartnerTier[]
}

export default function PartnerTierSection({ tiers }: PartnerTierSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[url('/images/partner/Benefit_bg.png')] bg-cover bg-center px-5 py-10 animate-fade-in">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="mb-8 text-center">
          <Image src="/images/partner/Logo.png" alt="SCEX" width={132} height={36} className="mx-auto h-12 w-auto object-contain" />
          <p className="mt-6 text-2xl font-normal text-white/85 max-md:text-lg max-sm:text-base">
            Công cụ quản lý & phát triển cộng đồng affiliate tối ưu dành cho Partner của SCEX
          </p>
        </div>
        <div className="rounded-[20px] bg-[#0c0c0c] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] max-sm:p-4">
          <h2 className="mb-8 text-center text-4xl font-medium max-md:text-2xl max-sm:text-xl">
            Các đặc quyền của{' '}
            <span className="bg-[linear-gradient(90deg,#FFF6B8_0%,#FFFFFF_58%,#E8C878_100%)] bg-clip-text text-transparent">
              đối tác
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <PartnerTierCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
