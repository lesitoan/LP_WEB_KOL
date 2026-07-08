import type { PostReviewTab, ReviewPost } from './constants'
import type { AdminInsightDistributionPreview, ContentTypeCode } from '@/types/api/adminInsight'
import moment from 'moment'

const POST_REVIEW_TAB_VALUES: PostReviewTab[] = [
  'ALL',
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

const API_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/

function getApiDateTimeParts(value: string | null | undefined) {
  if (!value) return null

  const match = value.match(API_DATE_TIME_PATTERN)
  if (!match) return null

  const [, year, month, day, hour, minute] = match
  return { year, month, day, hour, minute }
}

export function formatApiDateForPostReview(value: string | null | undefined): string | undefined {
  const parts = getApiDateTimeParts(value)
  if (!parts) return undefined

  return `${parts.day}/${parts.month}/${parts.year}`
}

export function formatApiTimeForPostReview(value: string | null | undefined): string | undefined {
  return moment(value).format('HH:mm')
}

export function formatApiDateTimeForPostReview(value: string | null | undefined): string | undefined {
  if (!value) return undefined

  return moment(value).format('DD/MM/YYYY HH:mm')
}

export function isLocalDraftId(postId: string | undefined): boolean {
  return Boolean(postId?.startsWith('local-draft-'))
}

export function isValidPostReviewTab(value: string | undefined): value is PostReviewTab {
  return POST_REVIEW_TAB_VALUES.includes(value as PostReviewTab)
}

export function buildLocalDraft(payload: {
  contentType: ContentTypeCode
  title: string
  scheduledAt?: string
  distributionPreview?: AdminInsightDistributionPreview
}): ReviewPost {
  return {
    id: `local-draft-${Date.now()}`,
    contentType: payload.contentType,
    time: formatApiTimeForPostReview(payload.scheduledAt),
    title: payload.title,
    mainContent: '',
    historyComparison: '',
    kolInsight: '',
    investorInsight: '',
    sources: '',
    authorTask: '',
    traderInsight: '',
    kolToolPosted: '',
    status: 'DRAFT',
    scheduledAt: payload.scheduledAt ?? null,
    distributionPlans: [],
    distributionPreview: payload.distributionPreview,
    isLocalDraft: true,
    imageUrls: [],
  }
}
