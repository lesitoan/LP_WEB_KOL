import type { ContentItemStatus, ContentTypeCode, PaginatedData } from './adminInsight'

export type KolInsightDeliveryStatus = 'DELIVERED' | 'VIEWED' | 'PUBLISHED' | 'SKIPPED'

export interface KolInsightPublication {
  id: string
  kolInsightDeliveryId: string
  kolId: string
  targetTelegramGroupId: string
  telegramMessageId: string | null
  postUrl: string | null
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface KolInsightDelivery {
  id: string
  contentItemId: string
  kolId: string
  contentDistributionPlanId: string | null
  status: KolInsightDeliveryStatus
  deliveredAt?: string
  viewedAt: string | null
  publishedAt: string | null
  skippedAt: string | null
  customizedTitle: string | null
  customizedSubtext: string | null
  customizedSummary: string | null
  customizedBody: string | null
  customizedInsightForKol: string | null
  customizedSources: unknown | null
  contentEditedAt?: string | null
  createdAt: string
  updatedAt: string
  publications?: KolInsightPublication[]
}

export interface KolInsightDistributionPlan {
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
  }
}

export interface KolInsightEffectiveContent {
  title: string
  subtext: string | null
  summary: string | null
  body: string
  insightForKol: string | null
  sources: unknown | null
}

export interface KolInsight {
  id: string
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
  status: ContentItemStatus
  scheduledAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  distributionPlan: KolInsightDistributionPlan | null
  delivery: KolInsightDelivery | null
  effectiveContent: KolInsightEffectiveContent
}

export interface ListKolInsightsQuery {
  page?: number
  limit?: number
  contentType?: ContentTypeCode
  status?: KolInsightDeliveryStatus
  fromDate?: string
  toDate?: string
  search?: string
}

export interface KolInsightCustomizationBody {
  customizedTitle?: string | null
  customizedSubtext?: string | null
  customizedSummary?: string | null
  customizedBody?: string | null
  customizedInsightForKol?: string | null
  customizedSources?: unknown
}

export interface PublishKolInsightTarget {
  targetTelegramGroupId: string
  telegramMessageId?: string
  postUrl?: string
}

export interface PublishKolInsightBody extends KolInsightCustomizationBody {
  targetTelegramGroupId?: string
  telegramMessageId?: string
  postUrl?: string
  targets?: PublishKolInsightTarget[]
}

export type KolInsightsData = PaginatedData<KolInsight>
