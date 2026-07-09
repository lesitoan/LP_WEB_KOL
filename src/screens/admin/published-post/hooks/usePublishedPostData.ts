import { useMemo } from 'react'
import {
  useListAdminContentActionRequestsQuery,
  useListAdminInsightsQuery,
} from '@/services/api/admin/insightsApi'
import type { AdminInsight, ContentItemStatus, ContentTypeCode, PaginationMeta } from '@/types/api/adminInsight'
import type { PublishedPost, PublishedPostTier } from '../constants'

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
const TIER_SORT_ORDER = new Map(ALL_TIER_CODES.map((tierCode, index) => [tierCode, index]))
const CURRENT_CONFIG_TIER_STATUSES = new Set<ContentItemStatus>([
  'DRAFT',
  'PENDING_REVIEW',
  'FLAGGED',
  'REJECTED',
])

const STATUS_LABELS: Partial<Record<ContentItemStatus, string>> = {
  PENDING_REVIEW: 'Chờ duyệt',
  SCHEDULED: 'Đã lên lịch',
  PUBLISHING: 'Đang đăng',
  PUBLISHED: 'Đã đăng',
  FLAGGED: 'Cần xử lý',
  // RECALLING: 'Đang thu hồi',
  RECALLED: 'Đã thu hồi',
  SKIPPED: 'Đã bỏ qua',
  REJECTED: 'Từ chối',
  DRAFT: 'Bản nháp',
  
}

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

function readString(source: Record<string, unknown>, key: string) {
  const value = source[key]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readNumber(source: Record<string, unknown>, key: string) {
  const value = source[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value)
  return undefined
}

function normalizeTierPlan(plan: unknown): PublishedPostTier | null {
  if (!plan || typeof plan !== 'object') return null

  const planRecord = plan as Record<string, unknown>
  const kolTier = planRecord.kolTier && typeof planRecord.kolTier === 'object'
    ? planRecord.kolTier as Record<string, unknown>
    : null

  const code = (
    readString(planRecord, 'tierCode') ||
    readString(planRecord, 'kolTierCode') ||
    (kolTier ? readString(kolTier, 'code') : undefined) ||
    ''
  ).toUpperCase()

  if (!code) return null

  const name =
    readString(planRecord, 'tierName') ||
    (kolTier ? readString(kolTier, 'name') : undefined) ||
    code

  const scheduledAt = readString(planRecord, 'scheduledAt') ?? null
  const recipientCount = readNumber(planRecord, 'recipientCount') ?? null

  return {
    code,
    name,
    scheduledAt,
    scheduledAtLabel: scheduledAt ? formatDateTime(scheduledAt) : undefined,
    recipientCount,
    status: readString(planRecord, 'status') ?? null,
  }
}

function getDistributionSnapshotPlans(distributionSnapshot: unknown) {
  if (!distributionSnapshot || typeof distributionSnapshot !== 'object') return []

  const maybePlans = 'plans' in distributionSnapshot
    ? (distributionSnapshot as { plans?: unknown }).plans
    : undefined

  return Array.isArray(maybePlans) ? maybePlans : []
}

function getCurrentConfigTierPlans(insight: AdminInsight) {
  return insight.distribution?.tiers && insight.distribution.tiers.length > 0
    ? insight.distribution.tiers
    : []
}

function getPersistedDistributionPlans(insight: AdminInsight) {
  return insight.distributionPlans && insight.distributionPlans.length > 0
    ? insight.distributionPlans
    : []
}

function getTierPlanSources(insight: AdminInsight) {
  const currentConfigPlans = getCurrentConfigTierPlans(insight)
  const persistedPlans = getPersistedDistributionPlans(insight)
  const snapshotPlans = getDistributionSnapshotPlans(insight.distributionSnapshot)

  if (CURRENT_CONFIG_TIER_STATUSES.has(insight.status)) {
    return [currentConfigPlans, persistedPlans, snapshotPlans]
  }

  return [persistedPlans, snapshotPlans, currentConfigPlans]
}

function resolveTiers(insight: AdminInsight): PublishedPostTier[] {
  const plans = getTierPlanSources(insight).find((source) => source.length > 0) ?? []

  const tiersByCode = new Map<string, PublishedPostTier>()

  for (const plan of plans) {
    const tier = normalizeTierPlan(plan)
    if (tier && !tiersByCode.has(tier.code)) {
      tiersByCode.set(tier.code, tier)
    }
  }

  return Array.from(tiersByCode.values()).sort((left, right) => {
    return (TIER_SORT_ORDER.get(left.code) ?? 99) - (TIER_SORT_ORDER.get(right.code) ?? 99)
  })
}

function resolveTierLabel(tiers: PublishedPostTier[]) {
  if (tiers.length === 0) return '---'

  const tierCodes = tiers.map((tier) => tier.code)
  const hasAllTiers = ALL_TIER_CODES.every((tierCode) => tierCodes.includes(tierCode))

  if (hasAllTiers) {
    return 'Tất cả'
  }

  return tiers.map((tier) => tier.name || tier.code).join(' - ')
}

function mapPublishedPost(insight: AdminInsight, openRequestByContentId: Map<string, string>): PublishedPost {
  const requestId = openRequestByContentId.get(insight.id)
  const categoryLabel = CONTENT_TYPE_LABELS[insight.contentType] ?? insight.contentType
  const statusLabel = STATUS_LABELS[insight.status] ?? insight.status
  const tiers = resolveTiers(insight)
  const imageUrls = insight.imageUrls && insight.imageUrls.length > 0
    ? insight.imageUrls
    : insight.imageUrl
      ? [insight.imageUrl]
      : []

  return {
    id: insight.id,
    title: insight.title,
    category: insight.contentType,
    categoryColor: getCategoryColor(insight.contentType),
    categoryLabel,
    adminName: insight.reviewedByUserId ? 'Admin' : '---',
    adminAvatarColor: '#9B692C',
    publishTime: formatDateTime(insight.createdAt || insight.publishedAt),
    tier: resolveTierLabel(tiers),
    tiers,
    status: statusLabel,
    statusCode: insight.status,
    actionType: requestId ? 'sent' : 'request',
    actionStatusText: requestId ? 'Chờ admin duyệt' : undefined,
    requestId,
    imageUrls,
    summary: insight.summary ?? undefined,
    mainContent: insight.body,
    sources: formatSources(insight.sources),
  }
}

export function usePublishedPostData(page: number) {
  const insightsQuery = useListAdminInsightsQuery({
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
    return (insightsQuery.data?.items ?? [])
      .map((insight) => mapPublishedPost(insight, openRequestByContentId))
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
