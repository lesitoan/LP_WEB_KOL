'use client'

import { useListFilters, type ListFiltersState } from '@/hooks/useListFilters'
import type { ListAdminMembersQuery } from '@/types/admin/members'

type AdminMembersViewMode = 'table'
type AdminMembersFiltersState = ListFiltersState<ListAdminMembersQuery, AdminMembersViewMode>

const INITIAL_STATE: AdminMembersFiltersState = {
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

export function useAdminMembersFiltersState() {
  return useListFilters<ListAdminMembersQuery, AdminMembersViewMode>({
    initialState: INITIAL_STATE,
    debounceMs: 500,
    parseFromSearchParams: (searchParams) => {
      const search = searchParams.get('search') || ''
      return {
        query: {
          page: parsePositiveInt(searchParams.get('page'), 1),
          limit: parsePositiveInt(searchParams.get('limit'), 20),
          search: search || undefined,
          countryCode: searchParams.get('countryCode')?.trim().toUpperCase() || undefined,
          kolId: searchParams.get('kolId')?.trim() || undefined,
          telegramStatus: searchParams.get('telegramStatus')?.trim().toLowerCase() || undefined,
          lpexUserStatus: searchParams.get('lpexUserStatus')?.trim().toLowerCase() || undefined,
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
      if (state.query.countryCode) params.set('countryCode', state.query.countryCode)
      if (state.query.kolId) params.set('kolId', state.query.kolId)
      if (state.query.telegramStatus) params.set('telegramStatus', state.query.telegramStatus)
      if (state.query.lpexUserStatus) params.set('lpexUserStatus', state.query.lpexUserStatus)

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
