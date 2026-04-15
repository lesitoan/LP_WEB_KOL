'use client'

import { useEffect, useMemo } from 'react'
import { useGetKolCurrentTierQuery, useGetKolTiersQuery } from '@/services/api/tierApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { toast } from '@/hooks/useToast'
import { TierComparisonTableSkeleton } from '@/components/skeletons/TierComparisonTableSkeleton'

type TierFeatureRow = {
  feature: string
  values: Array<string | string[]>
}

function splitDescription(description: string | null) {
  if (!description || !description.trim()) {
    return ['—']
  }

  const parts = description
    .split('+')
    .map((item) => item.trim())
    .filter(Boolean)

  return parts.length > 0 ? parts : ['—']
}

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

  const currentTierCode = (currentTierData?.matchedTier?.code || currentTierData?.currentTier?.code || '').toUpperCase()
  const currentIdx = tiers.findIndex((tier) => tier.code.toUpperCase() === currentTierCode)

  const headers = tiers.map((tier) => (tier.code.toUpperCase() === currentTierCode ? `${tier.code} ✓` : tier.code))

  const tableRows = useMemo<TierFeatureRow[]>(() => {
    if (!tiers.length) return []

    return [
      {
        feature: 'Active members',
        values: tiers.map((tier) =>
          tier.maxActiveMembers === null ? `${tier.minActiveMembers.toLocaleString('en-US')}+` : `${tier.minActiveMembers}-${tier.maxActiveMembers}`,
        ),
      },
      {
        feature: 'Commission rate',
        values: tiers.map((tier) => `${tier.commissionRatePct}%`),
      },
      {
        feature: 'Quyền lợi',
        values: tiers.map((tier) => splitDescription(tier.description)),
      },
    ]
  }, [tiers])

  if (isLoading) {
    return <TierComparisonTableSkeleton />
  }

  if (!tiers.length) {
    return (
      <div className="bg-surface-1 border border-border rounded-[14px] p-6 mb-6 text-sm text-muted-foreground">
        Chưa có dữ liệu tier.
      </div>
    )
  }

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] overflow-hidden mb-6">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border" />
            {headers.map((title, idx) => (
              <th
                key={title}
                className={`text-center p-3 px-5 text-[11px] font-semibold uppercase tracking-wider bg-surface-2 border-b border-border ${
                  idx === currentIdx
                    ? 'text-brand bg-[hsl(40_78%_55%/0.05)]'
                    : 'text-muted-foreground'
                }`}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr key={row.feature}>
              <td className="p-4 px-5 border-b border-border text-[13.5px]">
                <strong>{row.feature}</strong>
              </td>
              {row.values.map((value, idx) => {
                const isListValue = Array.isArray(value)

                return (
                  <td
                    key={`${row.feature}-${idx}`}
                    className={`p-4 px-5 border-b border-border text-[13.5px] text-center ${
                      idx === currentIdx
                        ? 'bg-[hsl(40_78%_55%/0.05)]'
                        : ''
                    }`}
                  >
                    {isListValue ? (
                      <div className="inline-flex flex-col items-start space-y-1 text-left">
                        {value.map((item, lineIndex) => (
                          <div
                            key={`${row.feature}-${idx}-${lineIndex}`}
                            className={idx === currentIdx ? 'text-foreground font-medium' : 'text-muted-foreground'}
                          >
                            - {item}
                          </div>
                        ))}
                      </div>
                    ) : idx === currentIdx ? (
                      <strong>{value}</strong>
                    ) : idx === tiers.length - 1 && row.feature === 'Commission rate' ? (
                      <strong className="text-tier-legend">{value}</strong>
                    ) : (
                      <span className="text-muted-foreground">{value}</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
