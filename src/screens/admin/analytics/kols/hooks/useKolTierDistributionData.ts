import { useMemo } from 'react'
import { useGetAdminDashboardKolTierDistributionQuery } from '@/services/api/admin/dashboardApi'

const TIER_COLOR_BY_CODE: Record<string, string> = {
  LEGEND: '#FFC933',
  ELITE: '#00A4FF',
  PARTNER: '#D4A74A',
  STARTER: '#C5D4DD',
  UNASSIGNED: '#828283',
}

const FALLBACK_TIER_COLORS = ['#FFC933', '#00A4FF', '#D4A74A', '#C5D4DD', '#828283']

export interface KolTierDistributionChartItem {
  code: string
  name: string
  value: number
  color: string
}

export function useKolTierDistributionData() {
  const query = useGetAdminDashboardKolTierDistributionQuery()

  const data = useMemo<KolTierDistributionChartItem[]>(() => {
    const tiers = query.data?.tiers ?? []

    return tiers.map((tier, index) => {
      const code = tier.code.toUpperCase()

      return {
        code,
        name: tier.name,
        value: tier.count,
        color: TIER_COLOR_BY_CODE[code] ?? FALLBACK_TIER_COLORS[index % FALLBACK_TIER_COLORS.length],
      }
    })
  }, [query.data?.tiers])

  return {
    query,
    data,
    totalKols: query.data?.totalKols ?? data.reduce((total, item) => total + item.value, 0),
    isEmpty: !query.isLoading && !query.isFetching && data.length === 0,
  }
}
