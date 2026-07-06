import { useMemo } from 'react'
import {
  useListAdminContentActionRequestsQuery,
  useListAdminInsightsQuery,
} from '@/services/api/admin/insightsApi'
import type { AdminInsight, ContentTypeCode, PaginationMeta } from '@/types/api/adminInsight'
import type { PublishedPost } from '../constants'

const PUBLISHED_POST_LIMIT = 8

const CONTENT_TYPE_LABELS: Partial<Record<ContentTypeCode, string>> = {
  BAN_TIN_0630: 'Bản tin 06:30',
  BAN_TIN_1300: 'Bản tin 13:00',
  BAN_TIN_1900: 'Bản tin 19:00',
  ALERT: 'Cảnh báo',
  PRE_EVENT: 'Pre-event',
  WEEKLY_CALENDAR: 'Lịch tuần',
  WHALES_DAILY: 'Whales Daily',
  WHALES_ALERT: 'Whales Alert',
  MARKET_STRUCTURE: 'Market Structure',
  SECTOR_DAILY: 'Sector Daily',
  SENTIMENT: 'Sentiment',
  DEEP_DIVE: 'Deep Dive',
  LEGAL_VN: 'Legal VN',
}

const ALL_TIER_CODES = ['STARTER', 'PARTNER', 'ELITE', 'LEGEND']

function getCategoryColor(contentType: ContentTypeCode): PublishedPost['categoryColor'] {
  if (contentType === 'ALERT' || contentType === 'WHALES_ALERT') return 'error'
  if (contentType === 'PRE_EVENT' || contentType === 'MARKET_STRUCTURE') return 'warning'
  if (contentType === 'BAN_TIN_1900' || contentType === 'WEEKLY_CALENDAR') return 'success'
  return 'blue-light'
}

function formatDateTime(value: string | null) {
  if (!value) return '---'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '---'

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function formatSources(value: unknown) {
  if (!value) return ''

  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'name' in item) return String(item.name)
        if (item && typeof item === 'object' && 'url' in item) return String(item.url)
        return ''
      })
      .filter(Boolean)
      .join(', ')
  }

  return ''
}

function resolveTierLabel(distributionSnapshot: unknown) {
  if (!distributionSnapshot || typeof distributionSnapshot !== 'object') {
    return '---'
  }

  const maybePlans = 'plans' in distributionSnapshot ? distributionSnapshot.plans : undefined
  if (!Array.isArray(maybePlans) || maybePlans.length === 0) {
    return '---'
  }

  const tierCodes = maybePlans
    .map((plan) => {
      if (!plan || typeof plan !== 'object') return ''
      if ('tierCode' in plan) return String(plan.tierCode)
      if ('kolTierCode' in plan) return String(plan.kolTierCode)
      return ''
    })
    .filter(Boolean)

  const uniqueTierCodes = Array.from(new Set(tierCodes))
  const hasAllTiers = ALL_TIER_CODES.every((tierCode) => uniqueTierCodes.includes(tierCode))

  if (hasAllTiers) {
    return 'Tất cả'
  }

  return uniqueTierCodes.length > 0 ? uniqueTierCodes.join(' - ') : '---'
}

function mapPublishedPost(insight: AdminInsight, openRequestByContentId: Map<string, string>): PublishedPost {
  const requestId = openRequestByContentId.get(insight.id)
  const categoryLabel = CONTENT_TYPE_LABELS[insight.contentType] ?? insight.contentType

  return {
    id: insight.id,
    title: insight.title,
    category: insight.contentType,
    categoryColor: getCategoryColor(insight.contentType),
    categoryLabel,
    adminName: insight.reviewedByUserId ? 'Admin' : '---',
    adminAvatarColor: '#9B692C',
    publishTime: formatDateTime(insight.publishedAt),
    tier: resolveTierLabel(insight.distributionSnapshot),
    status: insight.status === 'PUBLISHED' ? 'Đang hiển thị' : insight.status,
    actionType: requestId ? 'sent' : 'request',
    actionStatusText: requestId ? 'Chờ admin duyệt' : undefined,
    requestId,
    mainContent: insight.body,
    sources: formatSources(insight.sources),
  }
}

export function usePublishedPostData(page: number) {
  const insightsQuery = useListAdminInsightsQuery({
    status: 'SCHEDULED',
    page,
    limit: PUBLISHED_POST_LIMIT,
  })
  const actionRequestsQuery = useListAdminContentActionRequestsQuery({
    status: 'OPEN',
    page: 1,
    limit: 100,
  })

  const openRequestByContentId = useMemo(() => {
    return new Map(
      (actionRequestsQuery.data?.items ?? []).map((request) => [request.contentItemId, request.id]),
    )
  }, [actionRequestsQuery.data?.items])

  const posts = useMemo(() => {
    return (insightsQuery.data?.items ?? []).map((insight) => mapPublishedPost(insight, openRequestByContentId))
  }, [insightsQuery.data?.items, openRequestByContentId])

  const pagination: PaginationMeta = insightsQuery.data?.pagination ?? {
    page,
    limit: PUBLISHED_POST_LIMIT,
    totalItems: 0,
    totalPages: 1,
  }

  return {
    posts,
    pagination,
    isLoading: insightsQuery.isLoading || insightsQuery.isFetching || actionRequestsQuery.isLoading || actionRequestsQuery.isFetching,
    isError: insightsQuery.isError || actionRequestsQuery.isError,
    refetch: () => {
      insightsQuery.refetch()
      actionRequestsQuery.refetch()
    },
  }
}
