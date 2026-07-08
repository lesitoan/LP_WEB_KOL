import { useMemo } from 'react'
import { useGetAdminInsightDashboardForwardByContentTypeQuery } from '@/services/api/admin/insightDashboardApi'
import type { AdminInsightDashboardForwardByContentTypeQuery } from '@/types/api/adminInsightDashboard'
import type { ForwardContentItem } from '../constants'
import { MANUAL_NEWS_TYPES } from '../manualNewsTypes'
import type { ContentAnalyticsDateRange } from './useContentOverviewMetricsData'

const DEFAULT_FORWARD_CONTENT_LIMIT = MANUAL_NEWS_TYPES.length

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
    const itemByContentType = new Map(apiItems.map((item) => [item.contentType, item]))
    const normalizedItems = MANUAL_NEWS_TYPES.map((newsType, index) => {
      const apiItem = itemByContentType.get(newsType.contentType)

      return {
        index,
        label: apiItem?.label ?? newsType.label,
        forwardCount: apiItem?.forwardCount ?? 0,
      }
    }).sort((left, right) => {
      if (right.forwardCount !== left.forwardCount) {
        return right.forwardCount - left.forwardCount
      }

      return left.index - right.index
    })
    const maxForwardCount = Math.max(...normalizedItems.map((item) => item.forwardCount), 0)

    return normalizedItems.map((item) => ({
      title: item.label,
      fwdCount: item.forwardCount,
      fwdText: `${formatNumber(item.forwardCount)} fwd`,
      progress: calculateProgress(item.forwardCount, maxForwardCount),
    }))
  }, [query.data])

  return {
    query,
    items,
    showEmpty: !query.isLoading && !query.isFetching && query.isError,
  }
}
