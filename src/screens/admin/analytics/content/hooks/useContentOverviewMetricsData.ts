import { useMemo } from 'react'
import { useGetAdminInsightDashboardSummaryQuery } from '@/services/api/admin/insightDashboardApi'
import type { AdminInsightDashboardDateRangeQuery } from '@/types/api/adminInsightDashboard'
import { overviewMetrics, type ContentOverviewMetric } from '../constants'

export interface ContentAnalyticsDateRange {
  from: string
  to: string
  isGetAllTime: boolean
}

function buildSummaryQuery(dateRange: ContentAnalyticsDateRange): AdminInsightDashboardDateRangeQuery {
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

function formatPercent(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)
}

function formatSignedPercent(value: number) {
  const formatted = formatPercent(value)

  return value > 0 ? `+${formatted}%` : `${formatted}%`
}

function buildGrowthChange(growthPercentage: number) {
  return `${formatSignedPercent(growthPercentage)} so với kỳ trước`
}

function buildUsageRateChange(delta: number) {
  return `${formatSignedPercent(delta)} forward / nhận`
}

export function useContentOverviewMetricsData(dateRange: ContentAnalyticsDateRange) {
  const queryParams = useMemo(() => buildSummaryQuery(dateRange), [dateRange])
  const query = useGetAdminInsightDashboardSummaryQuery(queryParams)

  const metrics = useMemo<ContentOverviewMetric[]>(() => {
    const summary = query.data

    if (!summary) {
      return overviewMetrics
    }

    const bestContentType = summary.metrics.bestContentType

    return overviewMetrics.map((metric, index) => {
      if (index === 0) {
        const trend = summary.metrics.publishedContents

        return {
          ...metric,
          value: formatNumber(trend.current),
          change: buildGrowthChange(trend.growthPercentage),
          isSuccessChange: trend.delta >= 0,
        }
      }

      if (index === 1) {
        const trend = summary.metrics.kolPublishedActions

        return {
          ...metric,
          value: formatNumber(trend.current),
          change: buildGrowthChange(trend.growthPercentage),
          isSuccessChange: trend.delta >= 0,
        }
      }

      if (index === 2) {
        const trend = summary.metrics.usageRate

        return {
          ...metric,
          value: `${formatPercent(trend.current)}%`,
          change: buildUsageRateChange(trend.delta),
          isSuccessChange: trend.delta >= 0,
        }
      }

      if (index === 3) {
        return {
          ...metric,
          value: bestContentType?.label ?? '-',
          change: bestContentType ? `Tỷ lệ forward ${formatPercent(bestContentType.usageRate)}%` : 'Chưa có dữ liệu',
          isSuccessChange: (bestContentType?.usageRateDelta ?? 0) >= 0,
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
