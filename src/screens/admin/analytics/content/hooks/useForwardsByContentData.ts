import { useMemo } from 'react'
import { useGetAdminInsightDashboardForwardByContentTypeQuery } from '@/services/api/admin/insightDashboardApi'
import type { AdminInsightDashboardForwardByContentTypeQuery } from '@/types/api/adminInsightDashboard'
import type { ForwardContentItem } from '../constants'
import type { ContentAnalyticsDateRange } from './useContentOverviewMetricsData'

const DEFAULT_FORWARD_CONTENT_LIMIT = 10

function buildForwardByContentTypeQuery(dateRange: ContentAnalyticsDateRange): AdminInsightDashboardForwardByContentTypeQuery {
  if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
    return {
      limit: DEFAULT_FORWARD_CONTENT_LIMIT,
    }
  }

  return {
    startDate: dateRange.from,
    endDate: dateRange.to,
    limit: DEFAULT_FORWARD_CONTENT_LIMIT,
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)
}

function calculateProgress(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round((value / maxValue) * 100)))
}

export function useForwardsByContentData(dateRange: ContentAnalyticsDateRange) {
  const queryParams = useMemo(() => buildForwardByContentTypeQuery(dateRange), [dateRange])
  const query = useGetAdminInsightDashboardForwardByContentTypeQuery(queryParams)

  const items = useMemo<ForwardContentItem[]>(() => {
    const apiItems = query.data?.items ?? []
    const maxForwardCount = Math.max(...apiItems.map((item) => item.forwardCount), 0)

    return apiItems.map((item) => ({
      title: item.label,
      fwdCount: item.forwardCount,
      fwdText: `${formatNumber(item.forwardCount)} fwd`,
      progress: calculateProgress(item.forwardCount, maxForwardCount),
    }))
  }, [query.data])

  return {
    query,
    items,
    showEmpty: !query.isLoading && !query.isFetching && (query.isError || items.length === 0),
  }
}
