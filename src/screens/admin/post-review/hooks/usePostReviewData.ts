import { useMemo } from 'react'
import {
  CONTENT_STATUS_VALUES,
  mapInsightToReviewPost,
  type PostReviewTab,
  type ReviewPost,
} from '../constants'
import { useListAdminInsightsQuery } from '@/services/api/admin/insightsApi'

interface UsePostReviewDataParams {
  activeTab: PostReviewTab
  localDraft: ReviewPost | undefined
}

export function usePostReviewData({ activeTab, localDraft }: UsePostReviewDataParams) {
  const allInsightsQuery = useListAdminInsightsQuery({ page: 1, limit: 100 })
  const activeInsightsQuery = useListAdminInsightsQuery(
    activeTab === 'ALL'
      ? { page: 1, limit: 100 }
      : { page: 1, limit: 100, status: activeTab }
  )

  const allItems = allInsightsQuery.data?.items ?? []
  const activeItems = activeInsightsQuery.data?.items ?? []
  const localDraftVisible = Boolean(localDraft && (activeTab === 'DRAFT' || activeTab === 'ALL'))

  const activePosts = useMemo(() => {
    const apiPosts = activeItems.map(mapInsightToReviewPost)
    return localDraftVisible && localDraft ? [localDraft, ...apiPosts] : apiPosts
  }, [activeItems, localDraft, localDraftVisible])

  const statusCounts = useMemo(() => {
    const counts = CONTENT_STATUS_VALUES.reduce<Record<PostReviewTab, number>>(
      (acc, status) => {
        acc[status] = 0
        return acc
      },
      { ALL: (allInsightsQuery.data?.pagination.totalItems ?? allItems.length) + (localDraft ? 1 : 0) } as Record<PostReviewTab, number>
    )

    allItems.forEach((item) => {
      counts[item.status] += 1
    })

    if (localDraft) {
      counts.DRAFT += 1
    }

    return counts
  }, [allInsightsQuery.data?.pagination.totalItems, allItems, localDraft])

  const listIsLoading = activeInsightsQuery.isLoading || activeInsightsQuery.isFetching
  const showListEmpty = !listIsLoading && activePosts.length === 0

  return {
    allInsightsQuery,
    activeInsightsQuery,
    allItems,
    activeItems,
    activePosts,
    statusCounts,
    localDraftVisible,
    listIsLoading,
    showListEmpty,
  }
}
