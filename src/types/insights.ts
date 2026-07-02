import type { ContentTypeCode } from './api/adminInsight'
import type { KolInsight, KolInsightCustomizationBody } from './api/kolInsight'

export type InsightTabId = 'ALL' | ContentTypeCode

export type InsightModalMode = 'view' | 'edit'

export type InsightBadgeTone = 'danger' | 'success' | 'neutral'

export interface InsightTab {
  id: InsightTabId
  label: string
  count?: number
}

export interface InsightBadge {
  label: string
  tone: InsightBadgeTone
}

export interface InsightListItem {
  id: string
  contentType: ContentTypeCode
  contentTypeLabel: string
  title: string
  headline: string
  excerpt: string
  createdAtLabel: string
  publishedAtLabel: string
  deliveryStatusLabel: string
  badges: InsightBadge[]
  source: KolInsight
}

export interface InsightDetailView {
  id: string
  contentTypeLabel: string
  title: string
  subtext: string
  summary: string
  body: string
  historicalComparison: string
  insightForKol: string
  insightForInvestor: string
  insightForTrader: string
  sourcesText: string
  createdAtLabel: string
  publishedAtLabel: string
  deliveryStatusLabel: string
  customizationBody: KolInsightCustomizationBody
  source: KolInsight
}
