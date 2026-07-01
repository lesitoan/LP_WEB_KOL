import { useMemo } from 'react'
import { useGetAdminDashboardOverviewStatsQuery } from '@/services/api/admin/dashboardApi'
import { overviewMetrics, type OverviewMetricItem } from '../constants'
import type { KolAnalyticsDateRange } from './useKolGrowthChartData'

function buildOverviewStatsQuery(dateRange: KolAnalyticsDateRange) {
  if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
    return {}
  }

  return {
    startDate: dateRange.from,
    endDate: dateRange.to,
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatSignedNumber(value: number) {
  if (value > 0) return `+${formatNumber(value)}`
  return formatNumber(value)
}

function formatSignedPercent(value: number) {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)

  return value > 0 ? `+${formatted}%` : `${formatted}%`
}

export function useKolOverviewMetricsData(dateRange: KolAnalyticsDateRange) {
  const queryParams = useMemo(() => buildOverviewStatsQuery(dateRange), [dateRange])
  const query = useGetAdminDashboardOverviewStatsQuery(queryParams)

  const metrics = useMemo<OverviewMetricItem[]>(() => {
    const stats = query.data

    if (!stats) {
      return overviewMetrics
    }

    return overviewMetrics.map((metric, index) => {
      if (index === 0) {
        return {
          ...metric,
          value: formatNumber(stats.metrics.totalKols.current),
          change: `${formatSignedNumber(stats.metrics.totalKols.delta)} so với kỳ trước`,
          isPositive: stats.metrics.totalKols.delta >= 0,
        }
      }

      if (index === 1) {
        return {
          ...metric,
          value: formatNumber(stats.metrics.totalMembers.current),
          change: `${formatSignedPercent(stats.metrics.totalMembers.growthPercentage)} so với kỳ trước`,
          isPositive: stats.metrics.totalMembers.delta >= 0,
        }
      }

      return metric
    })
  }, [query.data])

  return {
    query,
    metrics,
  }
}
