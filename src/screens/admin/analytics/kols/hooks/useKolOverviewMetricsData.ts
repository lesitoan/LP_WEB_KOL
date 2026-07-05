import { useMemo } from 'react'
import { formatVnd } from '@/lib/formatMoney'
import {
  useGetAdminDashboardCommissionQuery,
  useGetAdminDashboardOverviewStatsQuery,
} from '@/services/api/admin/dashboardApi'
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

function toUnixSecondAtStartOfDay(value: string) {
  return Math.floor(new Date(`${value}T00:00:00.000Z`).getTime() / 1000)
}

function toUnixSecondAtEndOfDay(value: string) {
  return Math.floor(new Date(`${value}T23:59:59.999Z`).getTime() / 1000)
}

function buildCommissionQuery(dateRange: KolAnalyticsDateRange) {
  if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
    return {}
  }

  return {
    startDate: toUnixSecondAtStartOfDay(dateRange.from),
    endDate: toUnixSecondAtEndOfDay(dateRange.to),
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
  const overviewStatsQueryParams = useMemo(() => buildOverviewStatsQuery(dateRange), [dateRange])
  const commissionQueryParams = useMemo(() => buildCommissionQuery(dateRange), [dateRange])
  const overviewStatsQuery = useGetAdminDashboardOverviewStatsQuery(overviewStatsQueryParams)
  const commissionQuery = useGetAdminDashboardCommissionQuery(commissionQueryParams)

  const metrics = useMemo<OverviewMetricItem[]>(() => {
    const stats = overviewStatsQuery.data
    const commission = commissionQuery.data

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

      if (index === 2 && commission) {
        return {
          ...metric,
          value: `${formatVnd(commission.total.commission)} VNĐ`,
          change: `${formatSignedPercent(commission.total.growthRate)} so với kỳ trước`,
          isPositive: commission.total.growthRate >= 0,
        }
      }

      if (index === 3) {
        const growthPercentage = stats.metrics.totalKols.growthPercentage

        return {
          ...metric,
          value: formatSignedPercent(growthPercentage),
          change: '',
          isPositive: growthPercentage >= 0,
        }
      }

      return metric
    })
  }, [commissionQuery.data, overviewStatsQuery.data])

  return {
    query: {
      ...overviewStatsQuery,
      isLoading: overviewStatsQuery.isLoading || commissionQuery.isLoading,
      isFetching: overviewStatsQuery.isFetching || commissionQuery.isFetching,
      isError: overviewStatsQuery.isError || commissionQuery.isError,
    },
    metrics,
  }
}
