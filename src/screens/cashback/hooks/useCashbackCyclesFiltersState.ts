'use client'

import { useListFilters, type ListFiltersState } from '@/hooks/useListFilters'
import type { CashbackCycleStatus, DistributionCycle } from '@/types/api'

type CyclesFiltersQuery = {
  page: number
  limit: number
  cycleType?: DistributionCycle
  status?: CashbackCycleStatus
}

type CyclesViewMode = 'table'
type CyclesFiltersState = ListFiltersState<CyclesFiltersQuery, CyclesViewMode>

const INITIAL_CYCLES_FILTERS_STATE: CyclesFiltersState = {
  query: {
    page: 1,
    limit: 10,
  },
  viewMode: 'table',
  searchInput: '',
}

function parseCycleType(value: string | null): DistributionCycle | undefined {
  if (value === 'weekly' || value === 'monthly') {
    return value
  }

  return undefined
}

function parseCycleStatus(value: string | null): CashbackCycleStatus | undefined {
  if (
    value === 'PENDING' ||
    value === 'CALCULATING' ||
    value === 'READY' ||
    value === 'DISTRIBUTING' ||
    value === 'COMPLETED' ||
    value === 'FAILED'
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

export function useCashbackCyclesFiltersState() {
  return useListFilters<CyclesFiltersQuery, CyclesViewMode>({
    initialState: INITIAL_CYCLES_FILTERS_STATE,
    debounceMs: 0,
    parseFromSearchParams: (searchParams) => {
      const cycleType = parseCycleType(searchParams.get('cycleType'))
      const status = parseCycleStatus(searchParams.get('cycleStatus'))
      const page = parsePositiveInt(searchParams.get('cyclePage'), 1)

      return {
        query: {
          page,
          limit: 10,
          cycleType,
          status,
        },
        viewMode: 'table',
        searchInput: '',
      }
    },
    serializeToSearchParams: (state) => {
      const params = new URLSearchParams()
      params.set('tab', 'cycles')
      params.set('cyclePage', String(state.query.page))

      if (state.query.cycleType) {
        params.set('cycleType', state.query.cycleType)
      }

      if (state.query.status) {
        params.set('cycleStatus', state.query.status)
      }

      return params
    },
    applySearchToQuery: (query) => query,
  })
}
