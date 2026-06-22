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

export interface KolDashboardSummaryQuery {
  startDate?: string
  endDate?: string
}

export type KolDashboardMetricKey = 'commission' | 'referral' | 'deposit' | 'trade' | 'kyc'
export type KolDashboardMetricTrend = 'up' | 'down' | 'neutral'

export interface KolDashboardMetricCard {
  key: KolDashboardMetricKey
  title: string
  value: number
  unit: string | null
  growthPercentage: number | null
  trend: KolDashboardMetricTrend | null
  comparisonLabel: string | null
  currentPeriodValue: number | null
  previousPeriodValue: number | null
}

export interface KolDashboardPeriodComparison {
  selectedPeriod:
    | { type: 'all_time' }
    | { type: 'range'; startDate: string; endDate: string; days: number | null }
  previousPeriod:
    | { type: 'all_time' }
    | { type: 'range'; startDate: string; endDate: string; days: number | null }
    | null
}

export interface KolDashboardComparisonRange {
  startDate: string
  endDate: string
}

export interface KolDashboardTrendSummary {
  current: number
  previous: number
  delta: number
  growthPercentage: number
}

export interface KolDashboardSummary {
  commission: number
  comparisonPeriod: {
    current: KolDashboardComparisonRange
    previous: KolDashboardComparisonRange
  }
  referralTrend: KolDashboardTrendSummary
  kycTrend: KolDashboardTrendSummary
  depositTrend: KolDashboardTrendSummary
  tradeTrend: KolDashboardTrendSummary
}

export interface KolDashboardGroupSummaryQuery extends KolDashboardSummaryQuery {
  groupId?: string
}

export interface KolDashboardStats {
  referralCount: number
  commission: number
  warningMemberCount: number
  kickedMemberCount: number
  newJoinCount: number
}

export interface KolDashboardStatsGroup {
  id: string
  telegramGroupId?: string | null
  title: string
  iconKey?: string | null
  tierLabel?: string | null
  minVolumeRequired?: string | number | null
  maxVolumeRequired?: string | number | null
  status: string
}

export interface KolDashboardGroupStatsItem extends KolDashboardStats {
  group: KolDashboardStatsGroup
}

export interface KolDashboardGroupSummaryPeriod {
  type: 'range'
  startDate: string
  endDate: string
  days: number | null
}

export interface KolDashboardGroupSummaryGroup {
  id: string
  kolId: string
  telegramGroupId?: string | null
  title: string
  status: string
  minVolumeRequired?: string | number | null
  maxVolumeRequired?: string | number | null
}

export interface KolDashboardGroupSummaryCard {
  value: number
  calculation: string
}

export interface KolDashboardGroupSummary {
  period: KolDashboardGroupSummaryPeriod
  scope: {
    mode: 'single_group' | 'all_groups'
    group: KolDashboardGroupSummaryGroup | null
  }
  cards: {
    totalCommission: KolDashboardGroupSummaryCard
    warningCount: KolDashboardGroupSummaryCard
    memberCount: KolDashboardGroupSummaryCard
    kickedCount: KolDashboardGroupSummaryCard
    newJoinCount: KolDashboardGroupSummaryCard
  }
}

export interface KolRecentActivitiesQuery {
  limit?: number
}

export type KolRecentActivityType =
  | 'member_registrations_today'
  | 'member_join_group'
  | 'member_rejoin_group'
  | 'member_low_volume_warning'
  | 'member_kicked_low_volume'
  | 'member_rejoin_eligible'
  | 'member_rejoin_blocked'
  | 'commission_cycle_summary'
  | 'cashback_ready_to_claim'
  | 'group_created'
  | 'group_updated'
  | 'group_status_updated'
  | 'group_deleted'
  | 'group_benefit_created'
  | 'group_benefit_updated'
  | 'group_benefit_deleted'
  | 'campaign_created'
  | 'campaign_updated'

export type KolRecentActivityIcon = 'up' | 'warning' | 'dollar' | 'gift'
export type KolRecentActivitySeverity = 'info' | 'warning' | 'success'

export interface KolRecentActivityItem {
  type: KolRecentActivityType
  icon: KolRecentActivityIcon
  severity: KolRecentActivitySeverity
  title: string
  description: string
  occurredAt: string
  metadata?: Record<string, unknown>
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
