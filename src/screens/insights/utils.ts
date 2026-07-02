import type { GroupItem } from '@/types/api'
import type { ContentTypeCode } from '@/types/api/adminInsight'
import type { KolInsight, KolInsightCustomizationBody } from '@/types/api/kolInsight'
import type { InsightBadge, InsightDetailView, InsightListItem, InsightTabId } from '@/types/insights'
import { contentTypeLabels, insightContentTypeOrder } from './constants'

const fallbackText = '-'

export function truncateText(value: string | null | undefined, maxLength: number) {
  const text = value?.trim() || fallbackText
  if (text.length <= maxLength) return text
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

export function isValidInsightTabId(value: string | null | undefined): value is InsightTabId {
  return value === 'ALL' || insightContentTypeOrder.includes(value as ContentTypeCode)
}

export function formatInsightDate(value: string | null | undefined) {
  if (!value) return fallbackText

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallbackText

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatInsightDateOnly(value: string | null | undefined) {
  if (!value) return fallbackText

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallbackText

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDeliveryStatus(status: string | null | undefined) {
  switch (status) {
    case 'VIEWED':
      return 'Đã xem'
    case 'PUBLISHED':
      return 'Đã đăng'
    case 'SKIPPED':
      return 'Đã bỏ qua'
    case 'DELIVERED':
      return 'Đã nhận'
    default:
      return 'Chưa xem'
  }
}

function isNewInsight(insight: KolInsight) {
  const rawDate = insight.publishedAt ?? insight.createdAt
  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return false

  const ageMs = Date.now() - date.getTime()
  return ageMs >= 0 && ageMs <= 1000 * 60 * 60 * 24 * 3
}

function buildInsightBadges(insight: KolInsight): InsightBadge[] {
  const badges: InsightBadge[] = []

  if (['ALERT', 'PRE_EVENT', 'WHALES_ALERT'].includes(insight.contentType)) {
    badges.push({ label: 'Tin tức khẩn', tone: 'danger' })
  }

  if (isNewInsight(insight)) {
    badges.push({ label: 'Tin mới', tone: 'success' })
  }

  if (!badges.length) {
    badges.push({ label: contentTypeLabels[insight.contentType], tone: 'neutral' })
  }

  return badges
}

export function normalizeSourcesText(sources: unknown) {
  if (!sources) return fallbackText

  if (typeof sources === 'string') return sources.trim() || fallbackText

  if (Array.isArray(sources)) {
    const lines = sources
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') {
          const source = item as { title?: string; name?: string; label?: string; url?: string; link?: string }
          return [source.title ?? source.name ?? source.label, source.url ?? source.link].filter(Boolean).join(': ')
        }
        return ''
      })
      .filter(Boolean)

    return lines.length ? lines.join('\n') : fallbackText
  }

  return JSON.stringify(sources, null, 2)
}

export function buildInsightListItem(insight: KolInsight): InsightListItem {
  const effectiveContent = insight.effectiveContent
  const contentTypeLabel = contentTypeLabels[insight.contentType]
  const publishedAtLabel = formatInsightDate(insight.publishedAt ?? insight.createdAt)
  const title = effectiveContent.title || insight.title
  const excerpt = effectiveContent.summary || effectiveContent.subtext || effectiveContent.body || insight.summary || insight.body

  return {
    id: insight.id,
    contentType: insight.contentType,
    contentTypeLabel,
    title,
    headline: `${contentTypeLabel} — ${publishedAtLabel} | ${title}`,
    excerpt,
    createdAtLabel: formatInsightDateOnly(insight.createdAt),
    publishedAtLabel,
    deliveryStatusLabel: formatDeliveryStatus(insight.delivery?.status),
    badges: buildInsightBadges(insight),
    source: insight,
  }
}

export function buildInsightDetailView(insight: KolInsight): InsightDetailView {
  const effectiveContent = insight.effectiveContent
  const sources = effectiveContent.sources ?? insight.sources

  return {
    id: insight.id,
    contentTypeLabel: contentTypeLabels[insight.contentType],
    title: effectiveContent.title || insight.title,
    subtext: effectiveContent.subtext || fallbackText,
    summary: effectiveContent.summary || fallbackText,
    body: effectiveContent.body || insight.body || fallbackText,
    historicalComparison: insight.historicalComparison || fallbackText,
    insightForKol: effectiveContent.insightForKol || insight.insightForKol || fallbackText,
    insightForInvestor: insight.insightForInvestor || fallbackText,
    insightForTrader: insight.insightForTrader || fallbackText,
    sourcesText: normalizeSourcesText(sources),
    createdAtLabel: formatInsightDateOnly(insight.createdAt),
    publishedAtLabel: formatInsightDate(insight.publishedAt),
    deliveryStatusLabel: formatDeliveryStatus(insight.delivery?.status),
    customizationBody: {
      customizedTitle: effectiveContent.title || insight.title,
      customizedSubtext: effectiveContent.subtext,
      customizedSummary: effectiveContent.summary,
      customizedBody: effectiveContent.body || insight.body,
      customizedInsightForKol: effectiveContent.insightForKol || insight.insightForKol,
      customizedSources: sources,
    },
    source: insight,
  }
}

export function buildCustomizationPayload(values: KolInsightCustomizationBody): KolInsightCustomizationBody {
  return {
    customizedTitle: values.customizedTitle?.trim() || null,
    customizedSubtext: values.customizedSubtext?.trim() || null,
    customizedSummary: values.customizedSummary?.trim() || null,
    customizedBody: values.customizedBody?.trim() || null,
    customizedInsightForKol: values.customizedInsightForKol?.trim() || null,
    customizedSources:
      typeof values.customizedSources === 'string'
        ? values.customizedSources.trim() || null
        : values.customizedSources,
  }
}

export function getGroupTooltip(group: GroupItem) {
  return [
    `Tên nhóm: ${group.title || fallbackText}`,
    `Telegram ID: ${group.telegramGroupId || fallbackText}`,
    `Tier: ${group.tierLabel || fallbackText}`,
    `Mô tả: ${group.description || fallbackText}`,
    `Trạng thái: ${group.status || fallbackText}`,
  ].join('\n')
}
