export type ContentItemStatus =
  | 'PENDING_REVIEW'
  | 'DRAFT'
  | 'SCHEDULED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'FLAGGED'
  | 'RECALLED'
  | 'SKIPPED'
  | 'REJECTED'

export type ContentTypeCode =
  | 'BAN_TIN_0630'
  | 'BAN_TIN_1300'
  | 'BAN_TIN_1900'
  | 'ALERT'
  | 'PRE_EVENT'
  | 'WEEKLY_CALENDAR'
  | 'WHALES_DAILY'
  | 'WHALES_ALERT'
  | 'MARKET_STRUCTURE'
  | 'SECTOR_DAILY'
  | 'SENTIMENT'
  | 'DEEP_DIVE'
  | 'LEGAL_VN'

export type ContentDistributionScheduleType =
  | 'FIXED_TIME'
  | 'REALTIME'
  | 'RELATIVE'
  | 'EVENT_BASED'

export interface AdminInsightDistributionPreviewPlan {
  kolTierId: string
  tierCode: string
  tierName: string
  offsetMinutes: number
  scheduledAt: string
  recipientCount: number
}

export interface AdminInsightDistributionPreview {
  contentItemId: string
  contentTypeCode: ContentTypeCode
  scheduleType: ContentDistributionScheduleType
  baseScheduledAt: string
  plans: AdminInsightDistributionPreviewPlan[]
}

export interface AdminInsightDistributionPreviewBody {
  contentType: ContentTypeCode
  scheduledAt?: string
}

export interface GetAdminInsightDistributionPreviewQuery {
  insightId: string
  scheduledAt?: string
}

export interface ScheduleAdminInsightBody {
  scheduledAt?: string
  pushlishNow?: boolean
}

export interface AdminInsightDistributionResult {
  insight: AdminInsightDetail
  distributionPreview: AdminInsightDistributionPreview
}

export interface AdminInsightRecallResult {
  insight: AdminInsightDetail
  telegramRevokeSummary: unknown
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface PaginatedData<TItem> {
  items: TItem[]
  pagination: PaginationMeta
}

export interface AdminInsight {
  id: string
  sourceType: string
  organizationScope: string | null
  contentType: ContentTypeCode
  title: string
  subtext: string | null
  summary: string | null
  body: string
  historicalComparison: string | null
  insightForKol: string | null
  insightForInvestor: string | null
  insightForTrader: string | null
  sources: unknown | null
  authorTask: string | null
  kolToolPosted: string | null
  distributionSnapshot: unknown | null
  status: ContentItemStatus
  createdByUserId: string | null
  reviewedByUserId: string | null
  publishedByUserId: string | null
  scheduledAt: string | null
  publishedAt: string | null
  recalledAt: string | null
  createdAt: string
  updatedAt: string
}

export type ContentActionRequestStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED'

export interface AdminContentActionRequest {
  id: string
  contentItemId: string
  requestedByUserId: string
  reason: string
  status: ContentActionRequestStatus
  resolvedByUserId: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
  contentItem?: {
    id: string
    title: string
    contentType: ContentTypeCode
    status: ContentItemStatus
    scheduledAt?: string | null
  }
}

export interface AdminInsightDistributionPlan {
  id: string
  contentItemId: string
  kolTierId: string
  scheduledAt: string
  recipientCount: number
  status: string
  createdAt: string
  updatedAt: string
  kolTier: {
    id: string
    code: string
    name: string
    sortOrder?: number
  }
}

export interface AdminInsightDetail extends AdminInsight {
  distributionPlans: AdminInsightDistributionPlan[]
}

export interface CreateAdminInsightBody {
  sourceType?: string
  organizationScope?: string | null
  contentType: ContentTypeCode
  title: string
  subtext?: string | null
  summary?: string | null
  body: string
  historicalComparison?: string | null
  insightForKol?: string | null
  insightForInvestor?: string | null
  insightForTrader?: string | null
  sources?: unknown
  authorTask?: string | null
  kolToolPosted?: string | null
  status?: Extract<ContentItemStatus, 'PENDING_REVIEW' | 'DRAFT'>
}

export type UpdateAdminInsightStatus = Extract<ContentItemStatus, 'PENDING_REVIEW' | 'DRAFT' | 'FLAGGED'>

export interface UpdateAdminInsightBody {
  sourceType?: string
  organizationScope?: string | null
  contentType?: ContentTypeCode
  title?: string
  subtext?: string | null
  summary?: string | null
  body?: string
  historicalComparison?: string | null
  insightForKol?: string | null
  insightForInvestor?: string | null
  insightForTrader?: string | null
  sources?: unknown | null
  authorTask?: string | null
  kolToolPosted?: string | null
  status?: UpdateAdminInsightStatus
}

export interface ListAdminInsightsQuery {
  page?: number
  limit?: number
  status?: ContentItemStatus
  contentType?: ContentTypeCode
  sourceType?: string
  organizationScope?: string
  fromDate?: string
  toDate?: string
  search?: string
}

export interface ListAdminContentActionRequestsQuery {
  page?: number
  limit?: number
  status?: ContentActionRequestStatus
  contentItemId?: string
  contentType?: ContentTypeCode
  requestedByUserId?: string
  fromDate?: string
  toDate?: string
}

export interface CreateAdminContentActionRequestBody {
  reason: string
}
