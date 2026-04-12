'use client'

import { useMemo } from 'react'
import { useListFilters } from '@/hooks/useListFilters'
import type { ListGroupMembersQuery } from '@/types/api'

type GroupMembersFiltersViewMode = 'list'

const INITIAL_QUERY: ListGroupMembersQuery = {
  page: 1,
  limit: 20,
  search: undefined,
  countryCode: undefined,
  telegramStatus: undefined,
  lpexUserStatus: undefined,
}

const INITIAL_STATE = {
  query: INITIAL_QUERY,
  viewMode: 'list' as GroupMembersFiltersViewMode,
  searchInput: '',
}

function parseFromSearchParams(searchParams: { get: (name: string) => string | null }) {
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 20)
  const search = searchParams.get('search')?.trim() || ''
  const countryCode = searchParams.get('countryCode')?.trim().toUpperCase() || ''
  const telegramStatus = searchParams.get('telegramStatus')?.trim().toLowerCase() || ''
  const lpexUserStatus = searchParams.get('lpexUserStatus')?.trim().toLowerCase() || ''

  return {
    query: {
      page: Number.isInteger(page) && page > 0 ? page : 1,
      limit: Number.isInteger(limit) && limit > 0 ? limit : 20,
      search: search || undefined,
      countryCode: countryCode || undefined,
      telegramStatus: telegramStatus || undefined,
      lpexUserStatus: lpexUserStatus || undefined,
    },
    viewMode: 'list' as GroupMembersFiltersViewMode,
    searchInput: search,
  }
}

function serializeToSearchParams(state: {
  query: ListGroupMembersQuery
  viewMode: GroupMembersFiltersViewMode
  searchInput: string
}) {
  const params = new URLSearchParams()

  params.set('page', String(state.query.page))
  params.set('limit', String(state.query.limit))

  if (state.query.search) {
    params.set('search', state.query.search)
  }

  if (state.query.countryCode) {
    params.set('countryCode', state.query.countryCode)
  }

  if (state.query.telegramStatus) {
    params.set('telegramStatus', state.query.telegramStatus)
  }

  if (state.query.lpexUserStatus) {
    params.set('lpexUserStatus', state.query.lpexUserStatus)
  }

  return params
}

function applySearchToQuery(query: ListGroupMembersQuery, searchInput: string): ListGroupMembersQuery {
  const search = searchInput.trim()

  if ((query.search ?? '') === search) {
    return query
  }

  return {
    ...query,
    page: 1,
    search: search || undefined,
  }
}

export function useGroupMembersFilters() {
  const { state, setSearchInput, setQuery } = useListFilters<ListGroupMembersQuery, GroupMembersFiltersViewMode>({
    initialState: INITIAL_STATE,
    debounceMs: 700,
    parseFromSearchParams,
    serializeToSearchParams,
    applySearchToQuery,
  })

  const derived = useMemo(
    () => ({
      page: state.query.page,
      limit: state.query.limit,
      searchName: state.searchInput,
      countryFilter: state.query.countryCode ?? 'all',
      telegramStatusFilter: state.query.telegramStatus ?? 'all',
      lpexStatusFilter: state.query.lpexUserStatus ?? 'all',
      query: state.query,
    }),
    [state.query, state.searchInput],
  )

  return {
    ...derived,
    setPage: (page: number) => setQuery({ ...state.query, page }),
    setLimit: (limit: number) => setQuery({ ...state.query, page: 1, limit }),
    setSearchName: setSearchInput,
    setCountryFilter: (countryFilter: string) =>
      setQuery({
        ...state.query,
        page: 1,
        countryCode: countryFilter === 'all' ? undefined : countryFilter,
      }),
    setTelegramStatusFilter: (telegramStatusFilter: string) =>
      setQuery({
        ...state.query,
        page: 1,
        telegramStatus: telegramStatusFilter === 'all' ? undefined : telegramStatusFilter,
      }),
    setLpexStatusFilter: (lpexStatusFilter: string) =>
      setQuery({
        ...state.query,
        page: 1,
        lpexUserStatus: lpexStatusFilter === 'all' ? undefined : lpexStatusFilter,
      }),
  }
}