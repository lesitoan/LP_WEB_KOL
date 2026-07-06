import { useMemo } from 'react'
import { useGetAdminInsightDashboardReceivedForwardRateByContentTypeQuery } from '@/services/api/admin/insightDashboardApi'
import type { AdminInsightDashboardForwardByContentTypeQuery } from '@/types/api/adminInsightDashboard'
import type { ForwardRateItem } from '../constants'
import type { ContentAnalyticsDateRange } from './useContentOverviewMetricsData'

const DEFAULT_FORWARD_RATE_LIMIT = 10

function buildForwardRateByContentTypeQuery(dateRange: ContentAnalyticsDateRange): AdminInsightDashboardForwardByContentTypeQuery {
  if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
    return {
      limit: DEFAULT_FORWARD_RATE_LIMIT,
    }
  }

  return {
    startDate: dateRange.from,
    endDate: dateRange.to,
    limit: DEFAULT_FORWARD_RATE_LIMIT,
  }
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)
}

function getForwardRateColor(rate: number): ForwardRateItem['color'] {
  if (rate >= 80) return 'green'
  if (rate >= 50) return 'gold'
  return 'orange'
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function useForwardRateByContentData(dateRange: ContentAnalyticsDateRange) {
  const queryParams = useMemo(() => buildForwardRateByContentTypeQuery(dateRange), [dateRange])
  const query = useGetAdminInsightDashboardReceivedForwardRateByContentTypeQuery(queryParams)

  const items = useMemo<ForwardRateItem[]>(() => {
    const apiItems = query.data?.items ?? []

    return apiItems.map((item) => ({
      title: item.label,
      rate: item.forwardRate,
      rateText: `${formatPercent(item.forwardRate)}%`,
      progress: clampProgress(item.forwardRate),
      color: getForwardRateColor(item.forwardRate),
    }))
  }, [query.data])

  return {
    query,
    items,
    showEmpty: !query.isLoading && !query.isFetching && (query.isError || items.length === 0),
  }
}
