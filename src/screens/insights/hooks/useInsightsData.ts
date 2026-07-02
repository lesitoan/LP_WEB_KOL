import { useMemo } from 'react'

import { useListKolInsightsQuery } from '@/services/api/kolInsightsApi'
import type { ContentTypeCode } from '@/types/api/adminInsight'
import type { InsightTab, InsightTabId } from '@/types/insights'
import { insightTabs } from '../constants'
import { buildInsightListItem } from '../utils'

type UseInsightsDataInput = {
  activeTab: InsightTabId
}

export function useInsightsData({ activeTab }: UseInsightsDataInput) {
  const listQuery = useListKolInsightsQuery({
    page: 1,
    limit: 100,
    contentType: activeTab === 'ALL' ? undefined : activeTab,
  })
  const countsQuery = useListKolInsightsQuery({ page: 1, limit: 100 })

  const insights = useMemo(
    () => (listQuery.data?.items ?? []).map(buildInsightListItem),
    [listQuery.data?.items],
  )

  const tabs = useMemo<InsightTab[]>(
    () =>
      insightTabs.map((tab) => ({
        ...tab,
        count:
          tab.id === 'ALL'
            ? countsQuery.data?.pagination.totalItems ?? 0
            : (countsQuery.data?.items ?? []).filter(
              (insight) => insight.contentType === (tab.id as ContentTypeCode),
            ).length,
      })),
    [countsQuery.data?.items, countsQuery.data?.pagination.totalItems],
  )

  return {
    listQuery,
    tabs,
    insights,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    showEmpty: !listQuery.isLoading && insights.length === 0,
  }
}
