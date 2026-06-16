import Image from 'next/image'
import type { PartnerTier } from '../constants'
import PartnerTierCard from './PartnerTierCard'

type PartnerTierSectionProps = {
  tiers: PartnerTier[]
}

export default function PartnerTierSection({ tiers }: PartnerTierSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[url('/images/partner/Benefit_bg.png')] bg-cover bg-center px-5 py-12 animate-fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-black" />
      <div className="relative mx-auto max-w-[1320px]">
        <div className="mb-8 text-center">
          <Image src="/images/partner/Logo.png" alt="SCEX" width={132} height={36} className="mx-auto h-8 w-auto object-contain" />
          <p className="mt-3 text-2xl font-normal text-white/85">Công cụ quản lý & phát triển cộng đồng affiliate tối ưu dành cho Partner của SCEX</p>
        </div>
        <div className="rounded-[20px] bg-[#0c0c0c] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <h2 className="mb-6 text-center text-4xl font-medium">Các đặc quyền của đối tá<span className="text-brand">c</span></h2>
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
