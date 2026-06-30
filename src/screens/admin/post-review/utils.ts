import { CONTENT_STATUS_VALUES, type PostReviewTab, type ReviewPost } from './constants'
import type { AdminInsightDistributionPreview, ContentItemStatus, ContentTypeCode } from '@/types/api/adminInsight'

export function isLocalDraftId(postId: string | undefined): boolean {
  return Boolean(postId?.startsWith('local-draft-'))
}

export function isValidPostReviewTab(value: string | undefined): value is PostReviewTab {
  return value === 'ALL' || CONTENT_STATUS_VALUES.includes(value as ContentItemStatus)
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
    time: payload.scheduledAt
      ? new Date(payload.scheduledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
      : undefined,
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
  }
}
