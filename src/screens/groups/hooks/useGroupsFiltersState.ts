'use client'

import { useListFilters, type ListFiltersState } from '@/hooks/useListFilters'
import type { ListGroupsQuery } from '@/types/api'

export type GroupsViewMode = 'table' | 'item'

type GroupsFiltersState = ListFiltersState<ListGroupsQuery, GroupsViewMode>

const INITIAL_GROUPS_FILTERS_STATE: GroupsFiltersState = {
  query: {
    page: 1,
    limit: 10,
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

function parseViewMode(value: string | null): GroupsViewMode {
  return value === 'item' ? 'item' : 'table'
}

function parseStatus(value: string | null): string | undefined {
  if (value === 'active' || value === 'inactive' || value === 'paused' || value === 'blocked') return value
  return undefined
}

export function useGroupsFiltersState() {
  return useListFilters<ListGroupsQuery, GroupsViewMode>({
    initialState: INITIAL_GROUPS_FILTERS_STATE,
    debounceMs: 700,
    parseFromSearchParams: (searchParams) => {
      const search = searchParams.get('search') || ''
      const status = parseStatus(searchParams.get('status'))
      const page = parsePositiveInt(searchParams.get('page'), 1)
      const limit = parsePositiveInt(searchParams.get('limit'), 10)
      const viewMode = parseViewMode(searchParams.get('view'))

      return {
        query: {
          page,
          limit,
          search: search || undefined,
          status,
        },
        viewMode,
        searchInput: search,
      }
    },
    serializeToSearchParams: (state) => {
      const params = new URLSearchParams()
      params.set('page', String(state.query.page))
      params.set('limit', String(state.query.limit))
      params.set('view', state.viewMode)

      if (state.query.search) {
        params.set('search', state.query.search)
      }

      if (state.query.status) {
        params.set('status', state.query.status)
      }

      return params
    },
    applySearchToQuery: (query, searchInput) => {
      const nextSearch = searchInput.trim() ? searchInput.trim() : undefined
      if (nextSearch === query.search) {
        return query
      }
      return {
        ...query,
        page: 1,
        search: nextSearch,
      }
    },
  })
}
