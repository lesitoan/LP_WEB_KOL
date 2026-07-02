import type { ContentTypeCode } from '@/types/api/adminInsight'
import type { InsightTab } from '@/types/insights'

export const insightContentTypeOrder: ContentTypeCode[] = [
  'BAN_TIN_0630',
  'BAN_TIN_1300',
  'BAN_TIN_1900',
  'ALERT',
  'PRE_EVENT',
  'WEEKLY_CALENDAR',
  'WHALES_DAILY',
  'WHALES_ALERT',
  'MARKET_STRUCTURE',
  'SECTOR_DAILY',
  'SENTIMENT',
  'DEEP_DIVE',
  'LEGAL_VN',
]

export const contentTypeLabels: Record<ContentTypeCode, string> = {
  BAN_TIN_0630: 'Bản tin 06:30',
  BAN_TIN_1300: 'Bản tin 13:00',
  BAN_TIN_1900: 'Bản tin 19:00',
  ALERT: 'Tin nóng',
  PRE_EVENT: 'Trước sự kiện',
  WEEKLY_CALENDAR: 'Lịch tuần',
  WHALES_DAILY: 'On-chain Insight',
  WHALES_ALERT: 'Whales Alert',
  MARKET_STRUCTURE: 'Cấu trúc thị trường',
  SECTOR_DAILY: 'Sector & Narrative',
  SENTIMENT: 'Sentiment',
  DEEP_DIVE: 'Research Report',
  LEGAL_VN: 'Pháp lý Việt Nam',
}

export const insightTabs: InsightTab[] = [
  { id: 'ALL', label: 'Tất cả' },
  ...insightContentTypeOrder.map((contentType) => ({
    id: contentType,
    label: contentTypeLabels[contentType],
  })),
]
