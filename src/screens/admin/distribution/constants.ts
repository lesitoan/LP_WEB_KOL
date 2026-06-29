export type TierId = 'starter' | 'partner' | 'elite' | 'legend'

export interface TierConfig {
  id: TierId
  label: string
  range: string
  kolCount: number
  offsetMinutes: number  // null-like 0 = "Ngay"
  commission: number     // e.g. 30 = 30%
  icon: string           // public path
}

export const TIERS: TierConfig[] = [
  { id: 'starter', label: 'STARTER', range: '0–49',    kolCount: 88, offsetMinutes: 20, commission: 30, icon: '/images/tier_icons/STARTER_icon_active.svg' },
  { id: 'partner', label: 'PARTNER', range: '50–199',  kolCount: 23, offsetMinutes: 15, commission: 40, icon: '/images/tier_icons/PARTNER_icon_active.svg' },
  { id: 'elite',   label: 'ELITE',   range: '200–999', kolCount: 31, offsetMinutes: 10, commission: 50, icon: '/images/tier_icons/ELITE_icon_active.svg' },
  { id: 'legend',  label: 'LEGEND',  range: '1000+',   kolCount: 16, offsetMinutes: 0,  commission: 60, icon: '/images/tier_icons/LEGEND_icon_active.svg' },
]

export interface NewsTypeRow {
  id: string
  name: string
  subtext: string
  enabled: Record<TierId, boolean>
}

export interface NewsCategory {
  id: string
  label: string
  items: NewsTypeRow[]
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  {
    id: 'daily',
    label: 'A. Tin trong ngày',
    items: [
      { id: 'pulse_0630', name: 'Pulse sáng 6h30',      subtext: 'pulse_0630 · 06:30',      enabled: { starter: false, partner: true,  elite: false, legend: true  } },
      { id: 'pulse_1300', name: 'Pulse trưa 12h',        subtext: 'pulse_1300 · 13:00',      enabled: { starter: true,  partner: true,  elite: true,  legend: true  } },
      { id: 'pulse_1900', name: 'Pulse tối 19h',         subtext: 'pulse_1900 · 19:00',      enabled: { starter: true,  partner: true,  elite: true,  legend: true  } },
    ],
  },
  {
    id: 'alerts',
    label: 'B. Tin nóng & cảnh báo',
    items: [
      { id: 'alert',         name: 'Cảnh báo thị trường',    subtext: 'alert · Realtime',           enabled: { starter: true, partner: true, elite: true, legend: true } },
      { id: 'pre_event',     name: 'Cảnh báo trước sự kiện', subtext: 'pre_event · Trước 60–120\'', enabled: { starter: true, partner: true, elite: true, legend: true } },
      { id: 'weekly_calendar',name: 'Lịch tuần',              subtext: 'weekly_calendar · Thứ 2, 08:00', enabled: { starter: true, partner: true, elite: true, legend: true } },
    ],
  },
  {
    id: 'whales',
    label: 'C. Whales insights',
    items: [
      { id: 'whales_daily', name: 'Phân tích whales', subtext: 'whales_daily · 10:00', enabled: { starter: true, partner: true, elite: true, legend: true } },
    ],
  },
  {
    id: 'market',
    label: 'D. Phân tích thị trường',
    items: [
      { id: 'market_structure', name: 'Cấu trúc thị trường',  subtext: 'market_structure · 08:00', enabled: { starter: true, partner: true, elite: true, legend: true } },
      { id: 'sector_daily',     name: 'Sector & Narrative',    subtext: 'ector_daily · 12:00',      enabled: { starter: true, partner: true, elite: true, legend: true } },
    ],
  },
  {
    id: 'research',
    label: 'E. Research & báo cáo',
    items: [
      { id: 'deep_dive', name: 'Research Report',  subtext: 'deep_dive · Khi phát sinh', enabled: { starter: true, partner: true, elite: true, legend: true } },
      { id: 'legal_vn',  name: 'Pháp lý Việt Nam', subtext: 'legal_vn · Khi có văn bản', enabled: { starter: true, partner: true, elite: true, legend: true } },
    ],
  },
]
