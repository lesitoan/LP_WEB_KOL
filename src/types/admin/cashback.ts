export type AdminCashbackDistributionCycle = 'weekly' | 'monthly'
export type AdminCashbackConfigStatus = 'active' | 'inactive'

export type AdminCashbackCycleStatus =
  | 'PENDING'
  | 'CALCULATING'
  | 'READY'
  | 'DISTRIBUTING'
  | 'COMPLETED'
  | 'FAILED'

export type AdminCashbackPayoutStatus =
  | 'pending'
  | 'ready_to_claim'
  | 'paid'
  | 'failed'
  | 'skipped_min_amount'

export interface AdminCashbackPagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface AdminCashbackPaginatedData<TItem> {
  items: TItem[]
  pagination: AdminCashbackPagination
}

export interface AdminCashbackKolRef {
  id: string
  code: string
  displayName: string
}

export interface AdminCashbackTelegramGroupRef {
  id: string
  title: string
  telegramGroupId: string
}

export interface AdminCashbackCreatorRef {
  id: string
  email: string
  fullName?: string | null
}

export interface AdminCashbackMemberRef {
  id: string
  lpexUid?: string | null
  telegramUsername?: string | null
  telegramFirstName?: string | null
  telegramLastName?: string | null
}

export interface AdminCashbackAppliedConfigRef {
  id: string
  cashbackRatePct: number | string
  distributionCycle: AdminCashbackDistributionCycle
  minPayoutUsd: number | string
  effectiveFrom: string
  effectiveTo?: string | null
}

export interface AdminCashbackConfig {
  id: string
  kolId: string
  telegramGroupId: string
  cashbackRatePct: number | string
  distributionCycle: AdminCashbackDistributionCycle
  minPayoutUsd: number | string
  effectiveFrom: string
  effectiveTo?: string | null
  status: AdminCashbackConfigStatus
  createdBy?: string | null
  createdAt: string
  updatedAt: string
  kol?: AdminCashbackKolRef | null
  telegramGroup?: AdminCashbackTelegramGroupRef | null
  creator?: AdminCashbackCreatorRef | null
}

export interface AdminCashbackCycle {
  id: string
  kolId: string
  cycleType: AdminCashbackDistributionCycle
  periodStart: string
  periodEnd: string
  status: AdminCashbackCycleStatus
  totalCommissionUsd: number | string
  totalCashbackUsd: number | string
  createdAt: string
  updatedAt: string
  kol?: AdminCashbackKolRef | null
  _count?: {
    payouts: number
  }
}

export interface AdminCashbackPayout {
  id: string
  kolId: string
  memberId: string
  cashbackCycleId: string
  telegramGroupId: string
  appliedConfigId: string
  volumeUsd?: number | string | null
  grossFeeUsd?: number | string | null
  kolCommissionUsd: number | string
  cashbackAmountUsd: number | string
  cashbackRatePct?: number | string | null
  payoutStatus: AdminCashbackPayoutStatus
  notifiedAt?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
  kol?: AdminCashbackKolRef | null
  member?: AdminCashbackMemberRef | null
  cashbackCycle?: AdminCashbackCycle | null
  telegramGroup?: AdminCashbackTelegramGroupRef | null
  appliedConfig?: AdminCashbackAppliedConfigRef | null
}

export interface ListAdminCashbackConfigsQuery {
  page: number
  limit: number
  kolId?: string
  telegramGroupId?: string
  status?: AdminCashbackConfigStatus
  distributionCycle?: AdminCashbackDistributionCycle
}

export interface ListAdminCashbackCyclesQuery {
  page: number
  limit: number
  kolId?: string
  cycleType?: AdminCashbackDistributionCycle
  status?: AdminCashbackCycleStatus
  periodStartFrom?: string
  periodEndTo?: string
}

export interface ListAdminCashbackPayoutsQuery {
  page: number
  limit: number
  kolId?: string
  memberId?: string
  cycleId?: string
  telegramGroupId?: string
  payoutStatus?: AdminCashbackPayoutStatus
}

export interface ListAdminCashbackCyclePayoutsQuery {
  page: number
  limit: number
  memberId?: string
  telegramGroupId?: string
  payoutStatus?: AdminCashbackPayoutStatus
}
