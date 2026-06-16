'use client'

import { useEffect, useMemo } from 'react'
import { useGetKolCurrentTierQuery, useGetKolTiersQuery } from '@/services/api/tierApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { toast } from '@/hooks/useToast'
import { TierComparisonTableSkeleton } from '@/components/skeletons/TierComparisonTableSkeleton'
import type { KolTier } from '@/types/api'
import TierColumn, { getTierColumnLayout } from './TierColumn'

export default function TierComparisonTable() {
  const { data, isLoading, error } = useGetKolTiersQuery()
  const { data: currentTierData } = useGetKolCurrentTierQuery()

  useEffect(() => {
    if (!error) return
    toast({
      variant: 'destructive',
      title: 'Không tải được bảng tier',
      description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra'),
    })
  }, [error])

  const tiers = useMemo(() => {
    if (!data) return []
    return [...data].sort((a, b) => a.minActiveMembers - b.minActiveMembers)
  }, [data])

  const currentTierCode = (
    currentTierData?.matchedTier?.code ||
    currentTierData?.currentTier?.code ||
    ''
  ).toUpperCase()

  const currentTierName = (
    currentTierData?.matchedTier?.name ||
    currentTierData?.currentTier?.name ||
    ''
  ).toUpperCase()

  const isCurrentTier = (tier: KolTier) =>
    tier.code.toUpperCase() === currentTierCode || tier.name.toUpperCase() === currentTierName

  if (isLoading) {
    return <TierComparisonTableSkeleton />
  }

  if (!tiers.length) {
    return (
      <div className="mb-6 rounded-xl bg-[#171717] p-6 text-sm text-muted-foreground">
        Chưa có dữ liệu tier.
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-xl bg-[#171717] p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, index) => (
          <TierColumn
            key={tier.id}
            tier={tier}
            isCurrent={isCurrentTier(tier)}
            layout={getTierColumnLayout(index, tiers.length)}
          />
        ))}
      </div>
    </div>
  )
}
