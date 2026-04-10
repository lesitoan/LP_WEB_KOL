export type DistributionCycle = 'weekly' | 'monthly'
export type CashbackConfigStatus = 'active' | 'inactive'

export type CashbackCycleStatus =
  | 'PENDING'
  | 'CALCULATING'
  | 'READY'
  | 'DISTRIBUTING'
  | 'COMPLETED'
  | 'FAILED'

export type CashbackPayoutStatus =
  | 'pending'
  | 'split_requested'
  | 'paid'
  | 'failed'
  | 'skipped_min_amount'

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface PaginatedData<T> {
  items: T[]
  pagination: PaginationMeta
}

export interface CashbackSummaryData {
  totalCommissionUsd: number
  totalCashbackPaidUsd: number
  totalMembersReceivedCashback: number
  successfulPayouts: number
  failedPayouts: number
  pendingPayouts: number
  totalPayouts: number
  kolRetainedUsd: number
}

export interface MemberBrief {
  id: string
  lpexUid: string | null
  telegramUsername: string | null
  telegramFirstName: string | null
  telegramLastName: string | null
}

export interface TelegramGroupBrief {
  id: string
  title: string
  telegramGroupId: string
}

export interface AppliedConfigBrief {
  id: string
  cashbackRatePct: number
  distributionCycle: DistributionCycle
  effectiveFrom: string
  effectiveTo: string | null
}

export interface CashbackConfigData {
  id: string
  kolId: string
  telegramGroupId: string
  cashbackRatePct: number
  distributionCycle: DistributionCycle
  minPayoutUsd: number
  effectiveFrom: string
  effectiveTo: string | null
  status: CashbackConfigStatus
  createdAt: string
  updatedAt: string
}

export interface CashbackCycleData {
  id: string
  kolId: string
  cycleType: DistributionCycle
  periodStart: string
  periodEnd: string
  status: CashbackCycleStatus
  totalCommissionUsd: number
  totalCashbackUsd: number
  createdAt: string
  updatedAt: string
  _count?: {
    payouts: number
  }
}

export interface CashbackPayoutData {
  id: string
  kolId: string
  memberId: string
  telegramGroupId: string
  cashbackCycleId: string
  appliedConfigId: string
  kolCommissionUsd: number
  cashbackAmountUsd: number
  payoutStatus: CashbackPayoutStatus
  createdAt: string
  updatedAt: string
  member?: MemberBrief
  telegramGroup?: TelegramGroupBrief
  cashbackCycle?: Pick<CashbackCycleData, 'id' | 'cycleType' | 'periodStart' | 'periodEnd' | 'status'>
  appliedConfig?: AppliedConfigBrief
}

export interface ListCashbackConfigsQuery {
  page?: number
  limit?: number
  telegramGroupId?: string
  status?: CashbackConfigStatus
  distributionCycle?: DistributionCycle
}

export interface ListCashbackCyclesQuery {
  page?: number
  limit?: number
  cycleType?: DistributionCycle
  status?: CashbackCycleStatus
  periodStartFrom?: string
  periodEndTo?: string
}

export interface ListCashbackPayoutsQuery {
  page?: number
  limit?: number
  memberId?: string
  cycleId?: string
  telegramGroupId?: string
  payoutStatus?: CashbackPayoutStatus
}

export interface ListCashbackCyclePayoutsQuery {
  page?: number
  limit?: number
  memberId?: string
  telegramGroupId?: string
  payoutStatus?: CashbackPayoutStatus
}

export interface CreateCashbackConfigBody {
  telegramGroupId: string
  cashbackRatePct: number
  distributionCycle: DistributionCycle
  minPayoutUsd: number
  effectiveFrom: string
  effectiveTo?: string | null
  status: CashbackConfigStatus
}

export type UpdateCashbackConfigBody = Partial<CreateCashbackConfigBody>

// Dashboard cashback & commission daily chart

export interface CashbackChartQuery {
  days?: 7 | 30 | 90 // default 30
}

export interface CashbackChartCurrentDate {
  year: number
  month: number // 1-12
  day: number // 1-31
}

export interface CashbackChartPoint {
  date: string // YYYY-MM-DD
  cashbackUsd: number
  commissionUsd: number
}

export interface CashbackChartData {
  days: number
  currentDate: CashbackChartCurrentDate
  totalCashbackPaidUsd: number
  totalCommissionUsd: number
  dailyChart: CashbackChartPoint[]
}
