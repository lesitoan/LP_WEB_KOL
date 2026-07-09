import type { ContentTypeCode } from '@/types/api/adminInsight'

export const MANUAL_NEWS_TYPES: { id: string; label: string; contentType: ContentTypeCode }[] = [
  { id: 'pulse-morning', label: 'Pulse sáng', contentType: 'BAN_TIN_0630' },
  { id: 'pulse-noon', label: 'Pulse trưa', contentType: 'BAN_TIN_1300' },
  { id: 'pulse-evening', label: 'Pulse tối', contentType: 'BAN_TIN_1900' },
  { id: 'market-alert', label: 'Cảnh báo thị trường', contentType: 'ALERT' },
  { id: 'event-alert', label: 'Cảnh báo trước sự kiện', contentType: 'PRE_EVENT' },
  { id: 'weekly-calendar', label: 'Lịch tuần', contentType: 'WEEKLY_CALENDAR' },
  { id: 'whale-analysis', label: 'Phân tích whales', contentType: 'WHALES_DAILY' },
  { id: 'whale-alert', label: 'Cảnh báo whales', contentType: 'WHALES_ALERT' },
  { id: 'market-structure', label: 'Cấu trúc thị trường', contentType: 'MARKET_STRUCTURE' },
  { id: 'sector-narrative', label: 'Sector & Narrative', contentType: 'SECTOR_DAILY' },
  { id: 'market-sentiment', label: 'Sentiment', contentType: 'SENTIMENT' },
  { id: 'research-report', label: 'Research Report', contentType: 'DEEP_DIVE' },
  { id: 'vietnam-legal', label: 'Pháp lý Việt Nam', contentType: 'LEGAL_VN' },
]
