export interface OverviewMetricItem {
  label: string
  value: string
  change: string
  isPositive: boolean
}

export const overviewMetrics: OverviewMetricItem[] = [
  {
    label: 'TỔNG KOL',
    value: '158',
    change: '+10 so với kỳ trước',
    isPositive: true,
  },
  {
    label: 'THÀNH VIÊN',
    value: '12,840',
    change: '+10% so với kỳ trước',
    isPositive: true,
  },
  {
    label: 'HOA HỒNG',
    value: '284 triệu VNĐ',
    change: '+9.2% so với kỳ trước',
    isPositive: true,
  },
  {
    label: 'TỐC ĐỘ TĂNG KOL',
    value: '+18.4%',
    change: '+9.2% so với kỳ trước',
    isPositive: true,
  },
]

export interface TopKolItem {
  stt: number
  name: string
  tier: 'STARTER' | 'PARTNER' | 'ELITE' | 'LEGEND'
  commission: string
}

export const topKols: TopKolItem[] = [
  { stt: 1, name: 'Nguyễn Minh A', tier: 'STARTER', commission: '42,000,000,000 VNĐ' },
  { stt: 2, name: 'Nguyễn Văn B', tier: 'PARTNER', commission: '32,000,000,000 VNĐ' },
  { stt: 3, name: 'Lê Văn C', tier: 'ELITE', commission: '22,000,000,000 VNĐ' },
  { stt: 4, name: 'Nguyễn Minh A', tier: 'LEGEND', commission: '12,000,000,000 VNĐ' },
  { stt: 5, name: 'Nguyễn Minh D', tier: 'LEGEND', commission: '2,000,000,000 VNĐ' },
]

export const tierDistribution = [
  { name: 'LEGEND', value: 16, color: '#FFC933' },
  { name: 'ELITE', value: 31, color: '#00A4FF' },
  { name: 'PARTNER', value: 23, color: '#D4A74A' },
  { name: 'STARTER', value: 88, color: '#C5D4DD' },
]

export interface TierCommissionItem {
  tier: 'LEGEND' | 'ELITE' | 'PARTNER' | 'STARTER'
  amount: string
  percentage: number
}

export const tierCommissions: TierCommissionItem[] = [
  { tier: 'LEGEND', amount: '142,000,000,000 VNĐ', percentage: 100 },
  { tier: 'ELITE', amount: '82,000,000,000 VNĐ', percentage: 57.5 },
  { tier: 'PARTNER', amount: '42,000,000,000 VNĐ', percentage: 49 },
  { tier: 'STARTER', amount: '22,000,000,000 VNĐ', percentage: 40.25 },
]

export const growthChartData = [
  { date: '2024/01/01', 'Thành viên': 40, KOL: 150 },
  { date: '2024/01/08', 'Thành viên': 60, KOL: 152 },
  { date: '2024/01/15', 'Thành viên': 120, KOL: 156 },
  { date: '2024/01/22', 'Thành viên': 100, KOL: 158 },
  { date: '2024/01/29', 'Thành viên': 140, KOL: 150 },
  { date: '2024/02/05', 'Thành viên': 130, KOL: 160 },
  { date: '2024/02/12', 'Thành viên': 180, KOL: 172 },
]
