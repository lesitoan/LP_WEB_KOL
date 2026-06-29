export interface ContentOverviewMetric {
  label: string
  value: string
  change: string
  isSuccessChange?: boolean
}

export const overviewMetrics: ContentOverviewMetric[] = [
  { label: 'TIN ĐÃ ĐĂNG', value: '3,580', change: '+6 % so với kỳ trước', isSuccessChange: true },
  { label: 'LƯỢT KOL ĐĂNG', value: '3,580', change: '+14% so với kỳ trước', isSuccessChange: true },
  { label: 'TỶ LỆ SỬ DỤNG TIN', value: '71%', change: '+3% forward / nhận', isSuccessChange: true },
  { label: 'LOẠI TIN HIỆU QUẢ NHẤT', value: 'Whales', change: 'Tỷ lệ forward 88%', isSuccessChange: false },
]

export interface ForwardContentItem {
  title: string
  fwdCount: number
  fwdText: string
  progress: number // percentage 0-100
}

export const forwardsByContent: ForwardContentItem[] = [
  { title: 'Whales Insights', fwdCount: 1240, fwdText: '1.240 fwd', progress: 100 },
  { title: 'Pulse 19h', fwdCount: 980, fwdText: '980 fwd', progress: 80 },
  { title: 'Cảnh báo (Alert)', fwdCount: 760, fwdText: '760 fwd', progress: 60 },
  { title: 'Market Structure', fwdCount: 420, fwdText: '420 fwd', progress: 30 },
  { title: 'Pulse sáng', fwdCount: 360, fwdText: '360 fwd', progress: 20 },
  { title: 'Legal VN', fwdCount: 180, fwdText: '180 fwd', progress: 10 },
]

export interface ForwardRateItem {
  title: string
  rate: number
  rateText: string
  progress: number // percentage 0-100
  color: 'green' | 'gold' | 'orange'
}

export const forwardRatesByContent: ForwardRateItem[] = [
  { title: 'Whales Insights', rate: 88, rateText: '88%', progress: 80, color: 'green' },
  { title: 'Cảnh báo (Alert)', rate: 82, rateText: '82%', progress: 70, color: 'green' },
  { title: 'Pulse 19h', rate: 74, rateText: '74%', progress: 60, color: 'gold' },
  { title: 'Market Structure', rate: 61, rateText: '61%', progress: 30, color: 'gold' },
  { title: 'Pulse sáng', rate: 58, rateText: '58%', progress: 20, color: 'gold' },
  { title: 'Legal VN', rate: 32, rateText: '32%', progress: 10, color: 'orange' },
]

export interface StrategySuggestionItem {
  title: string
  description: string
  highlight?: string
}

export const strategySuggestions: StrategySuggestionItem[] = [
  {
    title: 'Whales Insights',
    description: ' tỷ lệ forward cao nhất (88%) dù lượng đăng vừa phải → KOL rất ưa chuộng, nên ',
    highlight: 'tăng tần suất & độ sâu.',
  },
  {
    title: 'Pulse 19h',
    description: ' dẫn đầu về số tuyệt đối → giữ ổn định, là nội dung trụ cột.',
  },
  {
    title: 'Legal VN',
    description: ' ít forward (32%) nhưng giá trị compliance cao → giữ cho tier cao, không cần mở rộng.',
  },
]
