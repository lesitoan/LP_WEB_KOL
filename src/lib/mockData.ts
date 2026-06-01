// Mock data for Partner Dashboard

export interface Referral {
  id: string
  name: string
  email: string
  registeredAt: Date
  status: 'active' | 'pending' | 'inactive'
  tradingVolume: number
  commission: number
  avatar?: string
}

export interface Commission {
  id: string
  date: Date
  type: 'commission' | 'cashback'
  source: string
  amount: number
  status: 'pending' | 'paid' | 'processing'
}

export interface DashboardStats {
  totalReferrals: number
  activeReferrals: number
  pendingReferrals: number
  totalCommission: number
  totalCashback: number
  conversionRate: number
  pendingCommission: number
  availableForWithdrawal: number
  thisMonthEarnings: number
}

export interface ChartDataPoint {
  date: string
  commission: number
  cashback: number
  referrals: number
}

// Generate chart data for the last 30 days
export function generateChartData(days: number = 30): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      commission: Math.floor(Math.random() * 500000) + 100000,
      cashback: Math.floor(Math.random() * 200000) + 50000,
      referrals: Math.floor(Math.random() * 10) + 1,
    })
  }
  
  return data
}

// Mock referrals data
export const mockReferrals: Referral[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    registeredAt: new Date('2024-01-15'),
    status: 'active',
    tradingVolume: 15000000,
    commission: 450000,
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    registeredAt: new Date('2024-01-20'),
    status: 'active',
    tradingVolume: 8500000,
    commission: 255000,
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    email: 'cuong.le@email.com',
    registeredAt: new Date('2024-02-01'),
    status: 'pending',
    tradingVolume: 0,
    commission: 0,
  },
  {
    id: '4',
    name: 'Phạm Hồng Dung',
    email: 'dung.pham@email.com',
    registeredAt: new Date('2024-02-10'),
    status: 'active',
    tradingVolume: 25000000,
    commission: 750000,
  },
  {
    id: '5',
    name: 'Hoàng Văn Em',
    email: 'em.hoang@email.com',
    registeredAt: new Date('2024-02-15'),
    status: 'inactive',
    tradingVolume: 2000000,
    commission: 60000,
  },
  {
    id: '6',
    name: 'Võ Thị Phương',
    email: 'phuong.vo@email.com',
    registeredAt: new Date('2024-02-20'),
    status: 'active',
    tradingVolume: 12000000,
    commission: 360000,
  },
  {
    id: '7',
    name: 'Đặng Quốc Gia',
    email: 'gia.dang@email.com',
    registeredAt: new Date('2024-03-01'),
    status: 'pending',
    tradingVolume: 0,
    commission: 0,
  },
  {
    id: '8',
    name: 'Bùi Thị Hương',
    email: 'huong.bui@email.com',
    registeredAt: new Date('2024-03-05'),
    status: 'active',
    tradingVolume: 18000000,
    commission: 540000,
  },
  {
    id: '9',
    name: 'Ngô Văn Khang',
    email: 'khang.ngo@email.com',
    registeredAt: new Date('2024-03-10'),
    status: 'active',
    tradingVolume: 9500000,
    commission: 285000,
  },
  {
    id: '10',
    name: 'Lý Thị Lan',
    email: 'lan.ly@email.com',
    registeredAt: new Date('2024-03-15'),
    status: 'pending',
    tradingVolume: 0,
    commission: 0,
  },
]

// Mock commissions data
export const mockCommissions: Commission[] = [
  {
    id: '1',
    date: new Date('2024-03-20'),
    type: 'commission',
    source: 'Nguyễn Văn An',
    amount: 150000,
    status: 'paid',
  },
  {
    id: '2',
    date: new Date('2024-03-19'),
    type: 'cashback',
    source: 'Giao dịch cá nhân',
    amount: 50000,
    status: 'paid',
  },
  {
    id: '3',
    date: new Date('2024-03-18'),
    type: 'commission',
    source: 'Trần Thị Bình',
    amount: 85000,
    status: 'processing',
  },
  {
    id: '4',
    date: new Date('2024-03-17'),
    type: 'commission',
    source: 'Phạm Hồng Dung',
    amount: 250000,
    status: 'paid',
  },
  {
    id: '5',
    date: new Date('2024-03-16'),
    type: 'cashback',
    source: 'Giao dịch cá nhân',
    amount: 75000,
    status: 'pending',
  },
  {
    id: '6',
    date: new Date('2024-03-15'),
    type: 'commission',
    source: 'Võ Thị Phương',
    amount: 120000,
    status: 'paid',
  },
  {
    id: '7',
    date: new Date('2024-03-14'),
    type: 'commission',
    source: 'Bùi Thị Hương',
    amount: 180000,
    status: 'paid',
  },
  {
    id: '8',
    date: new Date('2024-03-13'),
    type: 'cashback',
    source: 'Giao dịch cá nhân',
    amount: 35000,
    status: 'paid',
  },
  {
    id: '9',
    date: new Date('2024-03-12'),
    type: 'commission',
    source: 'Ngô Văn Khang',
    amount: 95000,
    status: 'pending',
  },
  {
    id: '10',
    date: new Date('2024-03-11'),
    type: 'commission',
    source: 'Nguyễn Văn An',
    amount: 200000,
    status: 'paid',
  },
]

// Dashboard stats
export const dashboardStats: DashboardStats = {
  totalReferrals: 156,
  activeReferrals: 89,
  pendingReferrals: 23,
  totalCommission: 12500000,
  totalCashback: 3200000,
  conversionRate: 57.1,
  pendingCommission: 850000,
  availableForWithdrawal: 4500000,
  thisMonthEarnings: 2800000,
}

// User profile
export const userProfile = {
  name: 'Trần Minh Đức',
  email: 'duc.tran@kol.com',
  tier: 'Gold',
  referralCode: 'KOL-MINHDUC-2024',
  referralLink: 'https://platform.com/ref/KOL-MINHDUC-2024',
  joinedAt: new Date('2023-06-15'),
  avatar: null,
}

// Format currency in USD
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format number with thousand separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num)
}

// Format percentage
export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`
}

// Format date in Vietnamese
export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Partner Settings Types
export interface GroupSettings {
  id: string
  name: string
  volumeThreshold: number
  warningCount: number
  gracePeriodDays: number
  autoKickEnabled: boolean
  allowRejoin: boolean
}

export interface PartnerSettings {
  groups: GroupSettings[]
}

// Default values for partner settings
export const defaultGroupSettings: Omit<GroupSettings, 'id' | 'name'> = {
  volumeThreshold: 1000,
  warningCount: 2,
  gracePeriodDays: 7,
  autoKickEnabled: true,
  allowRejoin: true,
}

// Mock partner settings data
export const mockPartnerSettings: PartnerSettings = {
  groups: [
    {
      id: '1',
      name: 'Nhóm VIP',
      volumeThreshold: 5000,
      warningCount: 3,
      gracePeriodDays: 14,
      autoKickEnabled: true,
      allowRejoin: true,
    },
    {
      id: '2',
      name: 'Nhóm Thường',
      volumeThreshold: 1000,
      warningCount: 2,
      gracePeriodDays: 7,
      autoKickEnabled: true,
      allowRejoin: true,
    },
    {
      id: '3',
      name: 'Nhóm Mới',
      volumeThreshold: 500,
      warningCount: 2,
      gracePeriodDays: 10,
      autoKickEnabled: false,
      allowRejoin: true,
    },
  ],
}
