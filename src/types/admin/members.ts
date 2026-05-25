import type { AdminKolStatus } from './kols'

export interface AdminMemberKolRef {
  id: string
  code: string
  displayName: string
  status: AdminKolStatus
}

export interface AdminMemberItem {
  id: string
  lpexUid: string
  lpexUserStatus: string
  registeredAtLpex?: string | null
  telegramUserId: string
  telegramUsername?: string | null
  telegramFirstName?: string | null
  telegramLastName?: string | null
  telegramStatus: string
  referrerKolId?: string | null
  referrerKolCode?: string | null
  countryCode?: string | null
  usdVolume: number | string
  createdAt: string
  updatedAt: string
  referrerKol?: AdminMemberKolRef | null
}

export interface AdminMembersPagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface AdminMembersData {
  items: AdminMemberItem[]
  pagination: AdminMembersPagination
}

export interface ListAdminMembersQuery {
  page: number
  limit: number
  search?: string
  countryCode?: string
  kolId?: string
  telegramStatus?: string
  lpexUserStatus?: string
}

export interface AdminMemberGroupBenefit {
  id: string
  groupId?: string | null
  title?: string | null
  benefitType?: string | null
  benefitValue?: string | null
  sortOrder?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface AdminMemberTelegramGroup {
  id: string
  kolId?: string | null
  telegramGroupId?: string | null
  title: string
  tierLabel?: string | null
  description?: string | null
  minVolumeRequired?: number | string | null
  maxVolumeRequired?: number | string | null
  status?: string | null
  benefits?: AdminMemberGroupBenefit[]
  createdAt?: string | null
  updatedAt?: string | null
}

export interface AdminMemberHistoricalCashbackGroup {
  group: AdminMemberTelegramGroup | null
  payoutCount: number
  totalCashbackAmountUsd: number
  totalVolumeUsd: number
  lastPayoutAt?: string | null
}

export interface AdminMemberGroupsData {
  member: AdminMemberItem
  currentEligibleGroups: AdminMemberTelegramGroup[]
  historicalCashbackGroups: AdminMemberHistoricalCashbackGroup[]
}

export interface AdminMemberLatestPayout {
  id: string
  payoutStatus: string
  cashbackRatePct: number
  volumeUsd: number
  grossFeeUsd: number
  kolCommissionUsd: number
  cashbackAmountUsd: number
  createdAt: string
  notifiedAt?: string | null
  cashbackCycle?: {
    id: string
    cycleType: string
    periodStart: string
    periodEnd: string
    status: string
  } | null
  telegramGroup?: {
    id: string
    title: string
    telegramGroupId?: string | null
  } | null
}

export interface AdminMemberMetrics {
  currentUsdVolume: number
  totalTrackedPayouts: number
  paidPayouts: number
  pendingPayouts: number
  failedPayouts: number
  skippedMinAmountPayouts: number
  readyToClaimPayouts: number
  totalVolumeUsd: number
  totalGrossFeeUsd: number
  totalKolCommissionUsd: number
  totalCashbackAmountUsd: number
  averageCashbackRatePct: number
  lastPayoutAt?: string | null
  lastNotifiedAt?: string | null
  latestPayout: AdminMemberLatestPayout | null
}

export interface AdminMemberMetricsData {
  member: AdminMemberItem
  metrics: AdminMemberMetrics
}
