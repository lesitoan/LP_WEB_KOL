import type { LucideIcon } from 'lucide-react'
import { BarChart3, Coins, Crown, Send, ShieldCheck, Sparkles, Star, Trophy, Users } from 'lucide-react'

export type PartnerTier = {
  name: string
  members: string
  rate: string
  icon: LucideIcon
  isCurrent?: boolean
  features: string[]
  disabled: string[]
}

export type PartnerStep = {
  icon: LucideIcon
  title: string
  body: string
}

export type PartnerBenefit = {
  icon: LucideIcon
  title: string
  body: string
}

export const partnerTiers: PartnerTier[] = [
  {
    name: 'STARTER',
    members: '0 - 49 thành viên',
    rate: '30%',
    icon: Star,
    features: ['Phân tích trong ngày (Cơ bản)', 'Phân tích tin nóng (Cơ bản)', 'Cảnh báo thị trường (Cơ bản)', 'Whales Insights (Cơ bản)'],
    disabled: ['Sector & Narrative', 'Research Report'],
  },
  {
    name: 'PARTNER',
    members: '50 - 199 thành viên',
    rate: '40%',
    icon: Sparkles,
    features: ['Phân tích trong ngày (Nâng cao)', 'Phân tích tin nóng (Nâng cao)', 'Cảnh báo thị trường (Nâng cao)', 'Whales Insights (Nâng cao)', 'Sector & Narrative'],
    disabled: ['Research Report'],
  },
  {
    name: 'ELITE',
    members: '200 - 999 thành viên',
    rate: '50%',
    icon: Trophy,
    // isCurrent: true,
    features: ['Phân tích trong ngày (Sớm 15’)', 'Phân tích tin nóng (Sớm 15’)', 'Cảnh báo thị trường (Sớm 15’)', 'Whales Insights (Full)', 'Sector & Narrative', 'Research Report'],
    disabled: [],
  },
  {
    name: 'LEGEND',
    members: '1000+ thành viên',
    rate: '60%',
    icon: Crown,
    features: ['Phân tích trong ngày (Sớm nhất)', 'Phân tích tin nóng (Sớm nhất)', 'Cảnh báo thị trường (Sớm nhất)', 'Whales Insights (Full)', 'Sector & Narrative', 'Research Report (Sớm 24h)'],
    disabled: [],
  },
]

export const partnerSteps: PartnerStep[] = [
  { icon: Users, title: 'BƯỚC 1: Đăng ký miễn phí', body: 'Vào hạng Starter - 30% hoa hồng, không cần điều kiện.' },
  { icon: Send, title: 'BƯỚC 2: Kết nối & tạo nhóm Telegram', body: 'Công cụ tự động quản lý, cảnh báo, chăm sóc nhóm cho bạn.' },
  { icon: BarChart3, title: 'BƯỚC 3: Lên hạng - hoa hồng lên tới 60%', body: 'Vào hạng Starter - 30% hoa hồng, không cần điều kiện.' },
]

export const partnerBenefits: PartnerBenefit[] = [
  { icon: ShieldCheck, title: 'Tự động hoá', body: 'Quản lý xác thực ref, cảnh báo, kick & rejoin theo volume tuỳ chỉnh cho nhiều nhóm một cách tự động' },
  { icon: Users, title: 'Phân tích cộng đồng', body: 'Trạng thái hoạt động, cảnh báo, tỷ lệ chuyển đổi, dự phóng thu nhập để chăm sóc thành viên hiệu quả.' },
  { icon: Coins, title: 'Market Insight', body: 'Vĩ mô, dòng tiền, cá mập, On-chain, tâm lý thị trường & nhiều nội dung giá trị sẵn sàng cho cộng đồng' },
  { icon: BarChart3, title: 'Chiến dịch thi đua', body: 'Công cụ này tuỳ chỉnh tạo campaign thi đua cho các nhóm để tri ân và gia tăng gắn kết giữa các thành viên.' },
]
