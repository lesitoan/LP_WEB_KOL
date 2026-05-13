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

export interface ChartPoint {
  date: string
  commission: number
  cashback: number
  referrals: number
}

// Member statistics overview (dashboard tile)

export interface MemberOverviewMonthInfo {
  year: number
  month: number // 1-12
}

export interface MemberOverviewStats {
  totalMembers: number
  currentMonthMembers: number
  previousMonthMembers: number
  growthPercentage: number
  currentMonth: MemberOverviewMonthInfo
  previousMonth: MemberOverviewMonthInfo
}

// Member monthly joins statistics (for dashboard)

export interface MemberMonthlyJoinsQuery {
  months?: number // 1-36, default 12
}

export interface MemberMonthlyJoinPoint {
  year: number
  month: number // 1-12
  count: number // new members in that month
}

export interface MemberMonthlyJoinsData {
  months: number
  currentMonth: {
    year: number
    month: number
  }
  monthlyJoins: MemberMonthlyJoinPoint[]
}

// Cashback monthly growth summary (dashboard tile)

export interface CashbackMonthInfo {
  year: number
  month: number // 1-12
}

export interface CommissionGrowthSummary {
  totalCommissionUsd: number
  currentMonthCommissionUsd: number
  previousMonthCommissionUsd: number
  commissionGrowthPercentage: number
  currentMonth: CashbackMonthInfo
  previousMonth: CashbackMonthInfo
}

export interface CashbackGrowthSummary {
  totalCommissionUsd: number
  totalCashbackPaidUsd: number
  currentMonthCashbackPaidUsd: number
  previousMonthCashbackPaidUsd: number
  cashbackGrowthPercentage: number // % growth vs previous month
  currentMonth: CashbackMonthInfo
  previousMonth: CashbackMonthInfo
}

export interface ReferralItem {
  id: string
  name: string
  email: string
  registeredAt: string
  status: 'active' | 'pending' | 'inactive'
  tradingVolume: number
  commission: number
  avatar?: string | null
}

export interface CommissionTransaction {
  id: string
  date: string
  type: 'commission' | 'cashback'
  source: string
  amount: number
  status: 'pending' | 'paid' | 'processing'
}

export interface WithdrawalRequest {
  id: string
  date: string
  amount: number
  status: 'completed' | 'pending'
  method: string
}

export interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  pendingReferrals: number
  conversionRate: number
}

export interface PartnerGroupSettings {
  id: string
  name: string
  volumeThreshold: number
  warningCount: number
  gracePeriodDays: number
  autoKickEnabled: boolean
  allowRejoin: boolean
}

export interface PartnerSettings {
  groups: PartnerGroupSettings[]
}
