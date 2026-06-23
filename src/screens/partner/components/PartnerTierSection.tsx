'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { TierComparisonTableSkeleton } from '@/components/skeletons/TierComparisonTableSkeleton'
import { useGetKolTiersQuery } from '@/services/api/tierApi'
import type { KolTier } from '@/types/api'
import type { PartnerTier } from '../constants'
import PartnerTierCard from './PartnerTierCard'

type PartnerTierSectionProps = {
  tiers: PartnerTier[]
}

function formatMembersRange(tier: KolTier) {
  if (tier.maxActiveMembers === null) {
    return `${tier.minActiveMembers}+ thành viên`
  }

  return `${tier.minActiveMembers} - ${tier.maxActiveMembers} thành viên`
}

function formatCommissionRate(value: string) {
  const rate = Number(value)

  if (Number.isNaN(rate)) {
    return value
  }

  return `${rate.toLocaleString('vi-VN', { maximumFractionDigits: 2 })}%`
}

function mapApiTierToPartnerTier(tier: KolTier, staticTiers: PartnerTier[]): PartnerTier {
  const fallbackTier = staticTiers.find(
    (item) => item.name.toUpperCase() === tier.name.toUpperCase() || item.name.toUpperCase() === tier.code.toUpperCase(),
  )
  const features = [...(tier.features ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)

  return {
    name: tier.name,
    members: formatMembersRange(tier),
    rate: formatCommissionRate(tier.commissionRatePct),
    icon: fallbackTier?.icon ?? staticTiers[0].icon,
    isCurrent: fallbackTier?.isCurrent,
    features: features.filter((feature) => feature.isIncluded),
    disabled: features.filter((feature) => !feature.isIncluded),
  }
}

export default function PartnerTierSection({ tiers }: PartnerTierSectionProps) {
  const { data: apiTiers, isLoading, error } = useGetKolTiersQuery()
  const displayTiers = useMemo(() => {
    if (!apiTiers?.length) return []

    return [...apiTiers]
      .sort((a, b) => a.minActiveMembers - b.minActiveMembers)
      .map((tier) => mapApiTierToPartnerTier(tier, tiers))
  }, [apiTiers, tiers])

  return (
    <section className="relative overflow-hidden bg-[url('/images/partner/Benefit_bg.png')] bg-cover bg-center px-5 py-10 animate-fade-in">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="mb-8 text-center">
          <Image src="/images/partner/Logo.png" alt="SCEX" width={132} height={36} className="mx-auto h-12 w-auto object-contain" />
          <p className="mt-6 text-2xl font-normal text-white/85 max-md:text-lg max-sm:text-base">
            Công cụ quản lý & phát triển cộng đồng affiliate tối ưu dành cho Partner của SCEX
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-card p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] max-sm:p-4">
          <h2 className="mb-8 text-center text-4xl font-medium max-md:text-2xl max-sm:text-xl">
            Các đặc quyền của{' '}
            <span className="bg-[linear-gradient(90deg,#FFF6B8_0%,#FFFFFF_58%,#E8C878_100%)] bg-clip-text text-transparent">
              đối tác
            </span>
          </h2>
          {isLoading ? (
            <TierComparisonTableSkeleton />
          ) : error || displayTiers.length === 0 ? (
            <div className="rounded-xl bg-surface-card px-6 py-12 text-center text-xl font-medium text-muted-foreground max-sm:text-lg">
              Không có dữ liệu
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {displayTiers.map((tier) => (
                <PartnerTierCard key={tier.name} tier={tier} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
