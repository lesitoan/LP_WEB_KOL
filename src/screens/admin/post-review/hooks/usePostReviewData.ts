import { useEffect, useMemo, useState } from 'react'
import {
  CONTENT_STATUS_VALUES,
  mapInsightToReviewPost,
  type PostReviewTab,
  type ReviewPost,
} from '../constants'
import { useListAdminInsightsQuery } from '@/services/api/admin/insightsApi'

const POST_REVIEW_PAGE_LIMIT = 50

interface UsePostReviewDataParams {
  activeTab: PostReviewTab
  page: number
  localDraft: ReviewPost | undefined
}

export function usePostReviewData({ activeTab, page, localDraft }: UsePostReviewDataParams) {
  const activeInsightsQuery = useListAdminInsightsQuery({
    page,
    limit: POST_REVIEW_PAGE_LIMIT,
  })

  const activeItems = activeInsightsQuery.data?.items ?? []
  const localDraftVisible = Boolean(localDraft && (activeTab === 'DRAFT' || activeTab === 'ALL'))
  const showLocalDraftOnPage = localDraftVisible && page === 1

  const activePosts = useMemo(() => {
    const apiPosts = activeItems.map(mapInsightToReviewPost)
    const filtered = activeTab === 'ALL'
      ? apiPosts
      : apiPosts.filter((post) => post.status === activeTab)
    return showLocalDraftOnPage && localDraft ? [localDraft, ...filtered] : filtered
  }, [activeItems, activeTab, localDraft, showLocalDraftOnPage])

  const statusCounts = useMemo(() => {
    const counts = CONTENT_STATUS_VALUES.reduce<Record<PostReviewTab, number>>(
      (acc, status) => {
        acc[status] = 0
        return acc
      },
      { ALL: activeItems.length + (localDraft ? 1 : 0) } as Record<PostReviewTab, number>
    )

    activeItems.forEach((item) => {
      counts[item.status] += 1
    })

    if (localDraft) {
      counts.DRAFT += 1
    }

    return counts
  }, [activeItems, localDraft])

  const listIsLoading = activeInsightsQuery.isLoading || activeInsightsQuery.isFetching
  const showListEmpty = !listIsLoading && activePosts.length === 0
  const activePaginationMeta = activeInsightsQuery.data?.pagination
  const activeTotalItems = (activePaginationMeta?.totalItems ?? 0) + (localDraftVisible ? 1 : 0)
  const activePagination = {
    page: activePaginationMeta?.page ?? page,
    limit: POST_REVIEW_PAGE_LIMIT,
    totalItems: activeTotalItems,
    totalPages: Math.max(1, Math.ceil(activeTotalItems / POST_REVIEW_PAGE_LIMIT)),
  }

  return {
    activeInsightsQuery,
    activeItems,
    activePosts,
    statusCounts,
    localDraftVisible,
    activePagination,
    listIsLoading,
    showListEmpty,
  }
}
