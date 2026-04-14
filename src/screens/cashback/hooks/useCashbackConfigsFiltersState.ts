'use client'

import { useListFilters, type ListFiltersState } from '@/hooks/useListFilters'
import type { CashbackConfigStatus } from '@/types/api'

type ConfigsFiltersQuery = {
  page: number
  limit: number
  status?: CashbackConfigStatus
}

type ConfigsViewMode = 'table'
type ConfigsFiltersState = ListFiltersState<ConfigsFiltersQuery, ConfigsViewMode>

const INITIAL_CONFIGS_FILTERS_STATE: ConfigsFiltersState = {
  query: {
    page: 1,
    limit: 10,
  },
  viewMode: 'table',
  searchInput: '',
}

function parseStatus(value: string | null): CashbackConfigStatus | undefined {
  if (value === 'active' || value === 'inactive') {
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

export function useCashbackConfigsFiltersState() {
  return useListFilters<ConfigsFiltersQuery, ConfigsViewMode>({
    initialState: INITIAL_CONFIGS_FILTERS_STATE,
    debounceMs: 0,
    parseFromSearchParams: (searchParams) => {
      const status = parseStatus(searchParams.get('cfgStatus'))
      const page = parsePositiveInt(searchParams.get('cfgPage'), 1)

      return {
        query: {
          page,
          limit: 10,
          status,
        },
        viewMode: 'table',
        searchInput: '',
      }
    },
    serializeToSearchParams: (state) => {
      const params = new URLSearchParams()
      params.set('tab', 'configs')
      params.set('cfgPage', String(state.query.page))

      if (state.query.status) {
        params.set('cfgStatus', state.query.status)
      }

      return params
    },
    applySearchToQuery: (query) => query,
  })
}
