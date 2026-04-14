'use client'

import { useListFilters, type ListFiltersState } from '@/hooks/useListFilters'
import type { CashbackPayoutStatus } from '@/types/api'

type PayoutsFiltersQuery = {
  page: number
  limit: number
  payoutStatus?: CashbackPayoutStatus
}

type PayoutsViewMode = 'table'
type PayoutsFiltersState = ListFiltersState<PayoutsFiltersQuery, PayoutsViewMode>

const INITIAL_PAYOUTS_FILTERS_STATE: PayoutsFiltersState = {
  query: {
    page: 1,
    limit: 10,
  },
  viewMode: 'table',
  searchInput: '',
}

function parsePayoutStatus(value: string | null): CashbackPayoutStatus | undefined {
  if (
    value === 'pending' ||
    value === 'split_requested' ||
    value === 'paid' ||
    value === 'failed' ||
    value === 'skipped_min_amount'
  ) {
    return value
  }

  return undefined
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return parsed
}

export function useCashbackPayoutsFiltersState() {
  return useListFilters<PayoutsFiltersQuery, PayoutsViewMode>({
    initialState: INITIAL_PAYOUTS_FILTERS_STATE,
    debounceMs: 0,
    parseFromSearchParams: (searchParams) => {
      const payoutStatus = parsePayoutStatus(searchParams.get('payoutStatus'))
      const page = parsePositiveInt(searchParams.get('payoutPage'), 1)

      return {
        query: {
          page,
          limit: 10,
          payoutStatus,
        },
        viewMode: 'table',
        searchInput: '',
      }
    },
    serializeToSearchParams: (state) => {
      const params = new URLSearchParams()
      params.set('tab', 'payouts')
      params.set('payoutPage', String(state.query.page))

      if (state.query.payoutStatus) {
        params.set('payoutStatus', state.query.payoutStatus)
      }

      return params
    },
    applySearchToQuery: (query) => query,
  })
}
