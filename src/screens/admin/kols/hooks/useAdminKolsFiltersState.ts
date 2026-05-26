'use client'

import { useListFilters, type ListFiltersState } from '@/hooks/useListFilters'
import type { AdminKolStatus, ListAdminKolsQuery } from '@/types/admin/kols'

type AdminKolsFiltersState = ListFiltersState<ListAdminKolsQuery, 'table'>

const INITIAL_STATE: AdminKolsFiltersState = {
  query: {
    page: 1,
    limit: 20,
  },
  viewMode: 'table',
  searchInput: '',
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return parsed
}

function parseStatus(value: string | null): AdminKolStatus | undefined {
  if (value === 'PENDING' || value === 'ACTIVE' || value === 'REJECTED' || value === 'PAUSED') return value
  return undefined
}

export function useAdminKolsFiltersState() {
  return useListFilters<ListAdminKolsQuery, 'table'>({
    initialState: INITIAL_STATE,
    debounceMs: 500,
    parseFromSearchParams: (searchParams) => {
      const search = searchParams.get('search') || ''
      return {
        query: {
          page: parsePositiveInt(searchParams.get('page'), 1),
          limit: parsePositiveInt(searchParams.get('limit'), 20),
          search: search || undefined,
          status: parseStatus(searchParams.get('status')),
        },
        viewMode: 'table',
        searchInput: search,
      }
    },
    serializeToSearchParams: (state) => {
      const params = new URLSearchParams()
      params.set('page', String(state.query.page))
      params.set('limit', String(state.query.limit))

      if (state.query.search) params.set('search', state.query.search)
      if (state.query.status) params.set('status', state.query.status)

      return params
    },
    applySearchToQuery: (query, searchInput) => {
      const search = searchInput.trim() || undefined
      if (search === query.search) return query
      return {
        ...query,
        page: 1,
        search,
      }
    },
  })
}
