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
  BAN_TIN_0630: 'Pulse sáng',
  BAN_TIN_1300: 'Pulse trưa',
  BAN_TIN_1900: 'Pulse tối',
  ALERT: 'Cảnh báo thị trường',
  PRE_EVENT: 'Cảnh báo trước sự kiện',
  WEEKLY_CALENDAR: 'Lịch tuần',
  WHALES_DAILY: 'Phân tích whales',
  WHALES_ALERT: 'Cảnh báo whales',
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
