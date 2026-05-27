'use client'

import { useListFilters, type ListFiltersState } from '@/hooks/useListFilters'
import type {
  AdminCashbackConfigStatus,
  AdminCashbackCycleStatus,
  AdminCashbackDistributionCycle,
  AdminCashbackPayoutStatus,
} from '@/types/admin/cashback'

export type AdminCashbackTab = 'configs' | 'cycles' | 'payouts'

export interface AdminCashbackQuery {
  page: number
  limit: number
  kolId?: string
  telegramGroupId?: string
  memberId?: string
  cycleId?: string
  status?: AdminCashbackConfigStatus | AdminCashbackCycleStatus
  distributionCycle?: AdminCashbackDistributionCycle
  cycleType?: AdminCashbackDistributionCycle
  payoutStatus?: AdminCashbackPayoutStatus
  periodStartFrom?: string
  periodEndTo?: string
}

type AdminCashbackFiltersState = ListFiltersState<AdminCashbackQuery, AdminCashbackTab>

const INITIAL_STATE: AdminCashbackFiltersState = {
  query: {
    page: 1,
    limit: 20,
  },
  viewMode: 'configs',
  searchInput: '',
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return parsed
}

function parseTab(value: string | null): AdminCashbackTab {
  if (value === 'cycles' || value === 'payouts') return value
  return 'configs'
}

export function useAdminCashbackFiltersState() {
  return useListFilters<AdminCashbackQuery, AdminCashbackTab>({
    initialState: INITIAL_STATE,
    debounceMs: 500,
    parseFromSearchParams: (searchParams) => ({
      query: {
        page: parsePositiveInt(searchParams.get('page'), 1),
        limit: parsePositiveInt(searchParams.get('limit'), 20),
        kolId: searchParams.get('kolId')?.trim() || undefined,
        telegramGroupId: searchParams.get('telegramGroupId')?.trim() || undefined,
        memberId: searchParams.get('memberId')?.trim() || undefined,
        cycleId: searchParams.get('cycleId')?.trim() || undefined,
        status: searchParams.get('status')?.trim() as AdminCashbackQuery['status'],
        distributionCycle: searchParams.get('distributionCycle')?.trim() as AdminCashbackDistributionCycle | undefined,
        cycleType: searchParams.get('cycleType')?.trim() as AdminCashbackDistributionCycle | undefined,
        payoutStatus: searchParams.get('payoutStatus')?.trim() as AdminCashbackPayoutStatus | undefined,
        periodStartFrom: searchParams.get('periodStartFrom')?.trim() || undefined,
        periodEndTo: searchParams.get('periodEndTo')?.trim() || undefined,
      },
      viewMode: parseTab(searchParams.get('tab')),
      searchInput: '',
    }),
    serializeToSearchParams: (state) => {
      const params = new URLSearchParams()
      params.set('tab', state.viewMode)
      params.set('page', String(state.query.page))
      params.set('limit', String(state.query.limit))

      if (state.query.kolId) params.set('kolId', state.query.kolId)
      if (state.query.telegramGroupId) params.set('telegramGroupId', state.query.telegramGroupId)
      if (state.query.memberId) params.set('memberId', state.query.memberId)
      if (state.query.cycleId) params.set('cycleId', state.query.cycleId)
      if (state.query.status) params.set('status', state.query.status)
      if (state.query.distributionCycle) params.set('distributionCycle', state.query.distributionCycle)
      if (state.query.cycleType) params.set('cycleType', state.query.cycleType)
      if (state.query.payoutStatus) params.set('payoutStatus', state.query.payoutStatus)
      if (state.query.periodStartFrom) params.set('periodStartFrom', state.query.periodStartFrom)
      if (state.query.periodEndTo) params.set('periodEndTo', state.query.periodEndTo)

      return params
    },
    applySearchToQuery: (query) => query,
  })
}
