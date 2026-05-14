'use client'

import { useMemo } from 'react'
import { useListFilters } from '@/hooks/useListFilters'
import type { ListMembersQuery } from '@/types/api'

type MembersFiltersViewMode = 'list'

const INITIAL_QUERY: ListMembersQuery = {
  page: 1,
  limit: 20,
  search: undefined,
  countryCode: undefined,
  telegramStatus: undefined,
  lpexUserStatus: undefined,
  groupId: undefined,
  membershipState: undefined,
  eligibilityStatus: undefined,
  includeGroups: true,
}

const INITIAL_STATE = {
  query: INITIAL_QUERY,
  viewMode: 'list' as MembersFiltersViewMode,
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
      groupId: undefined,
      membershipState: undefined,
      eligibilityStatus: undefined,
      includeGroups: true,
    },
    viewMode: 'list' as MembersFiltersViewMode,
    searchInput: search,
  }
}

function serializeToSearchParams(state: {
  query: ListMembersQuery
  viewMode: MembersFiltersViewMode
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

function applySearchToQuery(query: ListMembersQuery, searchInput: string): ListMembersQuery {
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

export function useMembersFilters() {
  const { state, setSearchInput, setQuery } = useListFilters<ListMembersQuery, MembersFiltersViewMode>({
    initialState: INITIAL_STATE,
    debounceMs: 500,
    parseFromSearchParams,
    serializeToSearchParams,
    applySearchToQuery,
  })

  const derived = useMemo(
    () => ({
      page: state.query.page,
      limit: state.query.limit,
      searchInput: state.searchInput,
      countryCodeInput: state.query.countryCode ?? '',
      telegramStatusFilter: state.query.telegramStatus ?? '',
      lpexUserStatusFilter: state.query.lpexUserStatus ?? '',
      query: state.query,
    }),
    [state.query, state.searchInput],
  )

  return {
    ...derived,
    setPage: (page: number) => setQuery({ ...state.query, page }),
    setLimit: (limit: number) => setQuery({ ...state.query, page: 1, limit }),
    setSearchInput,
    setCountryCodeInput: (countryCode: string) =>
      setQuery({
        ...state.query,
        page: 1,
        countryCode: countryCode.trim().toUpperCase() || undefined,
      }),
    setTelegramStatusFilter: (telegramStatus: string) =>
      setQuery({
        ...state.query,
        page: 1,
        telegramStatus: telegramStatus || undefined,
      }),
    setLpexUserStatusFilter: (lpexUserStatus: string) =>
      setQuery({
        ...state.query,
        page: 1,
        lpexUserStatus: lpexUserStatus || undefined,
      }),
  }
}

