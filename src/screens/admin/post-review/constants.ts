import type {
  AdminInsight,
  AdminInsightDetail,
  AdminInsightDistributionPreview,
  ContentItemStatus,
  ContentTypeCode,
  UpdateAdminInsightBody,
} from '@/types/api/adminInsight'

export interface CategoryConfig {
  id: ContentTypeCode
  label: string
  bgClass: string
  textClass: string
  iconColor: string
}

export const CONTENT_STATUS_VALUES: ContentItemStatus[] = [
  'PENDING_REVIEW',
  'DRAFT',
  'SCHEDULED',
  'PUBLISHING',
  'PUBLISHED',
  'FLAGGED',
  'RECALLED',
  'SKIPPED',
  'REJECTED',
]

export const PUBLISHABLE_INSIGHT_STATUSES: ContentItemStatus[] = []
export const APPROVABLE_INSIGHT_STATUSES = ['DRAFT'] as const
export const SCHEDULABLE_INSIGHT_STATUSES = ['PENDING_REVIEW'] as const
export const RECALLABLE_INSIGHT_STATUSES = ['SCHEDULED', 'PUBLISHING', 'PUBLISHED'] as const

export function isPublishableInsightStatus(status: ContentItemStatus): boolean {
  return PUBLISHABLE_INSIGHT_STATUSES.includes(status)
}

export function isApprovableInsightStatus(status: ContentItemStatus): boolean {
  return APPROVABLE_INSIGHT_STATUSES.includes(status as (typeof APPROVABLE_INSIGHT_STATUSES)[number])
}

export function isSchedulableInsightStatus(status: ContentItemStatus): boolean {
  return SCHEDULABLE_INSIGHT_STATUSES.includes(status as (typeof SCHEDULABLE_INSIGHT_STATUSES)[number])
}

export function isRecallableInsightStatus(status: ContentItemStatus): boolean {
  return RECALLABLE_INSIGHT_STATUSES.includes(status as (typeof RECALLABLE_INSIGHT_STATUSES)[number])
}

export type PostReviewTab = 'ALL' | ContentItemStatus

export const POST_REVIEW_TABS: { id: PostReviewTab; label: string }[] = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'DRAFT', label: 'Bản nháp' },
  { id: 'PENDING_REVIEW', label: 'Chờ duyệt' },
  { id: 'SCHEDULED', label: 'Đã lên lịch' },
  // { id: 'PUBLISHING', label: 'Đang đăng' },
  { id: 'PUBLISHED', label: 'Đã đăng' },
  // { id: 'FLAGGED', label: 'Cần xử lý' },
  { id: 'RECALLED', label: 'Đã thu hồi' },
  // { id: 'SKIPPED', label: 'Đã bỏ qua' },
  { id: 'REJECTED', label: 'Từ chối' },
]

export const CATEGORIES: Record<ContentTypeCode, CategoryConfig> = {
  ALERT: {
    id: 'ALERT',
    label: 'Tin tức khẩn',
    bgClass: 'bg-[#5C120C]',
    textClass: 'text-[#F5827A]',
    iconColor: '#F5827A',
  },
  PRE_EVENT: {
    id: 'PRE_EVENT',
    label: 'Trước sự kiện',
    bgClass: 'bg-[#5C120C]',
    textClass: 'text-[#F5827A]',
    iconColor: '#F5827A',
  },
  LEGAL_VN: {
    id: 'LEGAL_VN',
    label: 'Pháp lý Việt Nam',
    bgClass: 'bg-[#5C120C]',
    textClass: 'text-[#F5827A]',
    iconColor: '#F5827A',
  },
  WHALES_DAILY: {
    id: 'WHALES_DAILY',
    label: 'On-chain Insight',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#54C2FF',
  },
  WHALES_ALERT: {
    id: 'WHALES_ALERT',
    label: 'Whales Alert',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#54C2FF',
  },
  MARKET_STRUCTURE: {
    id: 'MARKET_STRUCTURE',
    label: 'Cấu trúc thị trường',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#54C2FF',
  },
  SECTOR_DAILY: {
    id: 'SECTOR_DAILY',
    label: 'Sector & Narrative',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#54C2FF',
  },
  SENTIMENT: {
    id: 'SENTIMENT',
    label: 'Sentiment',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#54C2FF',
  },
  DEEP_DIVE: {
    id: 'DEEP_DIVE',
    label: 'Research Report',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#54C2FF',
  },
  BAN_TIN_0630: {
    id: 'BAN_TIN_0630',
    label: 'Bản tin thị trường sáng',
    bgClass: 'bg-[#F0F9FF]',
    textClass: 'text-[#0074B5]',
    iconColor: '#0074B5',
  },
  BAN_TIN_1300: {
    id: 'BAN_TIN_1300',
    label: 'Tổng kết giữa ngày',
    bgClass: 'bg-[#06301C]',
    textClass: 'text-[#60CF9B]',
    iconColor: '#60CF9B',
  },
  BAN_TIN_1900: {
    id: 'BAN_TIN_1900',
    label: 'Tổng kết cuối ngày',
    bgClass: 'bg-[#06301C]',
    textClass: 'text-[#60CF9B]',
    iconColor: '#60CF9B',
  },
  WEEKLY_CALENDAR: {
    id: 'WEEKLY_CALENDAR',
    label: 'Lịch tuần',
    bgClass: 'bg-[#F0F9FF]',
    textClass: 'text-[#0074B5]',
    iconColor: '#0074B5',
  },
}

export const STATUS_CONFIGS: Record<ContentItemStatus, {
  label: string
  bgClass: string
  textClass: string
  iconColor: string
}> = {
  PENDING_REVIEW: {
    label: 'Chờ duyệt',
    bgClass: 'bg-[#4D2C03]',
    textClass: 'text-[#FAB55A]',
    iconColor: '#FAB55A',
  },
  DRAFT: {
    label: 'Bản nháp',
    bgClass: 'bg-[#282828]',
    textClass: 'text-[#D7D8D9]',
    iconColor: '#D7D8D9',
  },
  SCHEDULED: {
    label: 'Đã lên lịch',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#549BF8',
  },
  PUBLISHING: {
    label: 'Đang đăng',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#549BF8',
  },
  PUBLISHED: {
    label: 'Đã đăng',
    bgClass: 'bg-[#06301C]',
    textClass: 'text-[#60CF9B]',
    iconColor: '#60CF9B',
  },
  FLAGGED: {
    label: 'Cần xử lý',
    bgClass: 'bg-[#4D2C03]',
    textClass: 'text-[#FAB55A]',
    iconColor: '#FAB55A',
  },
  RECALLED: {
    label: 'Đã thu hồi',
    bgClass: 'bg-[#282828]',
    textClass: 'text-[#D7D8D9]',
    iconColor: '#D7D8D9',
  },
  SKIPPED: {
    label: 'Đã bỏ qua',
    bgClass: 'bg-[#282828]',
    textClass: 'text-[#D7D8D9]',
    iconColor: '#D7D8D9',
  },
  REJECTED: {
    label: 'Từ chối',
    bgClass: 'bg-[#5C120C]',
    textClass: 'text-[#F5827A]',
    iconColor: '#F5827A',
  },
}

export interface ReviewPost {
  id: string
  contentType: ContentTypeCode
  time?: string
  title: string
  mainContent: string
  historyComparison: string
  kolInsight: string
  investorInsight: string
  sources: string
  authorTask: string
  traderInsight: string
  kolToolPosted: string
  status: ContentItemStatus
  scheduledAt: string | null
  distributionPlans?: AdminInsightDetail['distributionPlans']
  distributionPreview?: AdminInsightDistributionPreview
  createdByUserId?: string | null
  reviewedByUserId?: string | null
  publishedByUserId?: string | null
  isLocalDraft?: boolean
}

function formatDisplayTime(value: string | null): string | undefined {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatSources(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

function normalizeRequiredText(value: string): string {
  return value.trim()
}

function normalizeNullableText(value: string): string | null {
  const nextValue = value.trim()
  return nextValue.length > 0 ? nextValue : null
}

function parseSources(value: string): unknown | null {
  const nextValue = value.trim()

  if (nextValue.length === 0) return null

  try {
    return JSON.parse(nextValue)
  } catch {
    return nextValue
  }
}

function areApiValuesEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

function assignIfChanged<TValue>(
  body: UpdateAdminInsightBody,
  key: keyof UpdateAdminInsightBody,
  originalValue: TValue,
  updatedValue: TValue
) {
  if (!areApiValuesEqual(originalValue, updatedValue)) {
    body[key] = updatedValue as never
  }
}

export function buildUpdateAdminInsightBody(original: ReviewPost, updated: ReviewPost): UpdateAdminInsightBody | null {
  const body: UpdateAdminInsightBody = {}

  assignIfChanged(body, 'title', normalizeRequiredText(original.title), normalizeRequiredText(updated.title))
  assignIfChanged(body, 'body', normalizeRequiredText(original.mainContent), normalizeRequiredText(updated.mainContent))
  assignIfChanged(body, 'historicalComparison', normalizeNullableText(original.historyComparison), normalizeNullableText(updated.historyComparison))
  assignIfChanged(body, 'insightForKol', normalizeNullableText(original.kolInsight), normalizeNullableText(updated.kolInsight))
  assignIfChanged(body, 'insightForInvestor', normalizeNullableText(original.investorInsight), normalizeNullableText(updated.investorInsight))
  assignIfChanged(body, 'insightForTrader', normalizeNullableText(original.traderInsight), normalizeNullableText(updated.traderInsight))
  assignIfChanged(body, 'sources', parseSources(original.sources), parseSources(updated.sources))
  assignIfChanged(body, 'authorTask', normalizeNullableText(original.authorTask), normalizeNullableText(updated.authorTask))
  assignIfChanged(body, 'kolToolPosted', normalizeNullableText(original.kolToolPosted), normalizeNullableText(updated.kolToolPosted))

  return Object.keys(body).length > 0 ? body : null
}

export function mapInsightToReviewPost(insight: AdminInsight | AdminInsightDetail): ReviewPost {
  return {
    id: insight.id,
    contentType: insight.contentType,
    time: formatDisplayTime(insight.scheduledAt),
    title: insight.title,
    mainContent: insight.body,
    historyComparison: insight.historicalComparison ?? '',
    kolInsight: insight.insightForKol ?? '',
    investorInsight: insight.insightForInvestor ?? '',
    sources: formatSources(insight.sources),
    authorTask: insight.authorTask ?? '',
    traderInsight: insight.insightForTrader ?? '',
    kolToolPosted: insight.kolToolPosted ?? '',
    status: insight.status,
    scheduledAt: insight.scheduledAt,
    distributionPlans: 'distributionPlans' in insight ? insight.distributionPlans : undefined,
    createdByUserId: insight.createdByUserId,
    reviewedByUserId: insight.reviewedByUserId,
    publishedByUserId: insight.publishedByUserId,
  }
}
