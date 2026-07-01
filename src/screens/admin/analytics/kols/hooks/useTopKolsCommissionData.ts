import { useMemo } from 'react'
import { formatVnd } from '@/lib/formatMoney'
import { useGetAdminDashboardKolCommissionsQuery } from '@/services/api/admin/dashboardApi'
import type { KolAnalyticsDateRange } from './useKolGrowthChartData'

export interface KolCommissionRow {
  id: string
  stt: number
  name: string
  commission: string
}

function toUnixSecondAtStartOfDay(value: string) {
  return Math.floor(new Date(`${value}T00:00:00.000Z`).getTime() / 1000)
}

function toUnixSecondAtEndOfDay(value: string) {
  return Math.floor(new Date(`${value}T23:59:59.999Z`).getTime() / 1000)
}

function getDisplayName(fullName: string, username: string, refCode: string) {
  return fullName.trim() || username.trim() || refCode.trim() || '---'
}

export function useTopKolsCommissionData(dateRange: KolAnalyticsDateRange) {
  const queryParams = useMemo(() => {
    const params = {
      page: 1,
      limit: 5,
      sortBy: 'totalCommission' as const,
      sortOrder: 'desc' as const,
    }

    if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
      return params
    }

    return {
      ...params,
      startDate: toUnixSecondAtStartOfDay(dateRange.from),
      endDate: toUnixSecondAtEndOfDay(dateRange.to),
    }
  }, [dateRange])

  const query = useGetAdminDashboardKolCommissionsQuery(queryParams)

  const rows = useMemo<KolCommissionRow[]>(() => {
    return (query.data?.items ?? []).map((item, index) => ({
      id: item.lpexUid,
      stt: index + 1,
      name: getDisplayName(item.fullName, item.username, item.refCode),
      commission: `${formatVnd(item.total.commission)} VNĐ`,
    }))
  }, [query.data?.items])

  return {
    query,
    rows,
    isEmpty: !query.isLoading && !query.isFetching && rows.length === 0,
  }
}
