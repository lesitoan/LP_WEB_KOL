import { useMemo } from 'react'
import {
  CATEGORIES,
  CONTENT_STATUS_VALUES,
  mapInsightToReviewPost,
  type PostReviewTab,
  type ReviewPost,
} from '../constants'
import {
  useGetAdminInsightStatusStatsQuery,
  useListAdminInsightsQuery,
} from '@/services/api/admin/insightsApi'
import type { AdminInsightStatusCount, AdminInsightStatusStats, ContentItemStatus, ContentTypeCode } from '@/types/api/adminInsight'

const POST_REVIEW_PAGE_LIMIT = 50

interface UsePostReviewDataParams {
  activeTab: PostReviewTab
  page: number
  localDraft: ReviewPost | undefined
  contentType?: ContentTypeCode
  search?: string
}

const CONTENT_STATUS_SET = new Set<string>(CONTENT_STATUS_VALUES)

function emptyStatusCounts(): Record<PostReviewTab, number> {
  return CONTENT_STATUS_VALUES.reduce<Record<PostReviewTab, number>>(
    (acc, status) => {
      acc[status] = 0
      return acc
    },
    { ALL: 0 } as Record<PostReviewTab, number>
  )
}

function toCount(value: unknown): number {
  if (value && typeof value === 'object') {
    const countRecord = value as Record<string, unknown>
    return toCount(countRecord.count ?? countRecord.total ?? countRecord._all ?? countRecord.id ?? countRecord.status)
  }

  const count = Number(value)
  return Number.isFinite(count) && count > 0 ? count : 0
}

function isStatus(value: string): value is ContentItemStatus {
  return CONTENT_STATUS_SET.has(value)
}

function applyStatusCount(
  counts: Record<PostReviewTab, number>,
  status: string | undefined,
  count: unknown
) {
  if (status && isStatus(status)) {
    counts[status] = toCount(count)
  }
}

function applyStatusCountItems(
  counts: Record<PostReviewTab, number>,
  items: AdminInsightStatusCount[] | undefined
) {
  items?.forEach((item) => {
    applyStatusCount(counts, item.status, item.count ?? item.total ?? item._count)
  })
}

function normalizeStatusCounts(stats: AdminInsightStatusStats | undefined): Record<PostReviewTab, number> {
  const counts = emptyStatusCounts()

  if (Array.isArray(stats)) {
    applyStatusCountItems(counts, stats)
  } else if (stats && typeof stats === 'object') {
    const statsRecord = stats as Record<string, unknown> & {
      counts?: AdminInsightStatusCount[]
      byStatus?: AdminInsightStatusCount[]
      items?: AdminInsightStatusCount[]
      statuses?: AdminInsightStatusCount[]
    }

    applyStatusCountItems(counts, statsRecord.counts)
    applyStatusCountItems(counts, statsRecord.byStatus)
    applyStatusCountItems(counts, statsRecord.items)
    applyStatusCountItems(counts, statsRecord.statuses)

    Object.entries(statsRecord).forEach(([status, value]) => {
      if (isStatus(status)) {
        counts[status] = toCount(value)
      } else if (value && typeof value === 'object' && 'status' in value) {
        const item = value as AdminInsightStatusCount
        applyStatusCount(counts, item.status, item.count ?? item.total ?? item._count)
      }
    })
  }

  counts.ALL = CONTENT_STATUS_VALUES.reduce((total, status) => total + counts[status], 0)

  return counts
}

function normalizeSearchValue(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase('vi-VN') ?? ''
}

function localDraftMatchesFilters(
  localDraft: ReviewPost | undefined,
  activeTab: PostReviewTab,
  contentType: ContentTypeCode | undefined,
  search: string | undefined
): boolean {
  if (!localDraft) return false
  if (activeTab !== 'ALL' && localDraft.status !== activeTab) return false
  if (contentType && localDraft.contentType !== contentType) return false

  const normalizedSearch = normalizeSearchValue(search)
  if (!normalizedSearch) return true

  const categoryLabel = CATEGORIES[localDraft.contentType]?.label ?? localDraft.contentType
  return [
    localDraft.title,
    localDraft.mainContent,
    localDraft.historyComparison,
    localDraft.kolInsight,
    localDraft.investorInsight,
    localDraft.traderInsight,
    categoryLabel,
  ].some((value) => value.toLocaleLowerCase('vi-VN').includes(normalizedSearch))
}

export function usePostReviewData({ activeTab, page, localDraft, contentType, search }: UsePostReviewDataParams) {
  const statusStatsQuery = useGetAdminInsightStatusStatsQuery()
  const activeInsightsQuery = useListAdminInsightsQuery({
    page,
    limit: POST_REVIEW_PAGE_LIMIT,
    ...(activeTab === 'ALL' ? {} : { status: activeTab }),
    ...(contentType ? { contentType } : {}),
    ...(search?.trim() ? { search: search.trim() } : {}),
  })

  const activeItems = activeInsightsQuery.data?.items ?? []
  const localDraftVisible = localDraftMatchesFilters(localDraft, activeTab, contentType, search)
  const showLocalDraftOnPage = localDraftVisible && page === 1

  const activePosts = useMemo(() => {
    const apiPosts = activeItems.map(mapInsightToReviewPost)
    return showLocalDraftOnPage && localDraft ? [localDraft, ...apiPosts] : apiPosts
  }, [activeItems, localDraft, showLocalDraftOnPage])

  const statusCounts = useMemo(() => {
    const counts = normalizeStatusCounts(statusStatsQuery.data)

    if (localDraft) {
      counts.DRAFT += 1
      counts.ALL += 1
    }

    return counts
  }, [statusStatsQuery.data, localDraft])

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
    statusStatsQuery,
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
