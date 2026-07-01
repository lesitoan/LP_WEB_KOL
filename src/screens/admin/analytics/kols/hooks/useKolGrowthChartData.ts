import { useMemo } from 'react'
import { useGetAdminDashboardGrowthChartQuery } from '@/services/api/admin/dashboardApi'
import type { AdminDashboardGrowthChartQuery } from '@/types/api/adminDashboard'

export interface KolAnalyticsDateRange {
  from: string
  to: string
  isGetAllTime: boolean
}

export interface KolGrowthChartPoint {
  date: string
  members: number | null
  kols: number | null
}

function buildGrowthChartQuery(dateRange: KolAnalyticsDateRange): AdminDashboardGrowthChartQuery {
  if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
    return {}
  }

  return {
    startDate: dateRange.from,
    endDate: dateRange.to,
  }
}

function formatChartDate(point: string) {
  const date = new Date(point)

  if (Number.isNaN(date.getTime())) {
    return point
  }

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function useKolGrowthChartData(dateRange: KolAnalyticsDateRange) {
  const query = useMemo(() => buildGrowthChartQuery(dateRange), [dateRange])
  const chartQuery = useGetAdminDashboardGrowthChartQuery(query)

  const data = useMemo<KolGrowthChartPoint[]>(() => {
    const chart = chartQuery.data

    if (!chart) {
      return []
    }

    const kols = chart.series.find((series) => series.key === 'totalKols')?.values ?? []
    const members = chart.series.find((series) => series.key === 'totalMembers')?.values ?? []

    return chart.points.map((point, index) => ({
      date: formatChartDate(point),
      members: members[index] ?? null,
      kols: kols[index] ?? null,
    }))
  }, [chartQuery.data])

  return {
    query: chartQuery,
    data,
    isEmpty: !chartQuery.isLoading && !chartQuery.isFetching && data.length === 0,
  }
}
