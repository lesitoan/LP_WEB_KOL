'use client'

import { useMemo } from 'react'
import { useListFilters } from '@/hooks/useListFilters'
import type { ListMembersQuery } from '@/types/api'

type MembersFiltersViewMode = 'list'
type MemberTypeFilter = 'all' | 'inactive_2_weeks' | 'warning'

const INITIAL_QUERY: ListMembersQuery = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: undefined,
  countryCode: undefined,
  telegramStatus: undefined,
  lpexUserStatus: undefined,
  groupId: undefined,
  membershipState: undefined,
  eligibilityStatus: undefined,
  inactiveDays: undefined,
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
  const eligibilityStatus = searchParams.get('eligibilityStatus')?.trim().toUpperCase() || ''
  const inactiveDaysRaw = Number(searchParams.get('inactiveDays') || '')
  const sortByRaw = searchParams.get('sortBy')?.trim()
  const sortOrderRaw = searchParams.get('sortOrder')?.trim()

  const sortBy: "telegramUsername" | "usdVolume" | "createdAt" | undefined =
    sortByRaw === 'telegramUsername' || sortByRaw === 'usdVolume' || sortByRaw === 'createdAt'
      ? sortByRaw
      : undefined
  const sortOrder: "asc" | "desc" | undefined = sortOrderRaw === 'asc' || sortOrderRaw === 'desc' ? sortOrderRaw : undefined

  return {
    query: {
      page: Number.isInteger(page) && page > 0 ? page : 1,
      limit: Number.isInteger(limit) && limit > 0 ? limit : 20,
      sortBy,
      sortOrder,
      search: search || undefined,
      countryCode: countryCode || undefined,
      telegramStatus: telegramStatus || undefined,
      lpexUserStatus: lpexUserStatus || undefined,
      groupId: undefined,
      membershipState: undefined,
      eligibilityStatus: eligibilityStatus || undefined,
      inactiveDays: Number.isInteger(inactiveDaysRaw) && inactiveDaysRaw > 0 ? inactiveDaysRaw : undefined,
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

  if (state.query.sortBy) {
    params.set('sortBy', state.query.sortBy)
  }

  if (state.query.sortOrder) {
    params.set('sortOrder', state.query.sortOrder)
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

  if (state.query.eligibilityStatus) {
    params.set('eligibilityStatus', state.query.eligibilityStatus)
  }

  if (state.query.inactiveDays !== undefined) {
    params.set('inactiveDays', String(state.query.inactiveDays))
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

function createMemberTypeQuery(currentQuery: ListMembersQuery, memberType: MemberTypeFilter): ListMembersQuery {
  return {
    ...INITIAL_QUERY,
    page: 1,
    limit: currentQuery.limit ?? INITIAL_QUERY.limit,
    sortBy: undefined,
    sortOrder: undefined,
    eligibilityStatus: memberType === 'warning' ? 'FINAL_WARNING,WARNING' : undefined,
    inactiveDays: memberType === 'inactive_2_weeks' ? 14 : undefined,
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
      eligibilityStatusFilter: state.query.eligibilityStatus ?? '',
      inactiveDaysFilter: state.query.inactiveDays,
      query: state.query,
      sortBy: state.query.sortBy ?? 'createdAt',
      sortOrder: state.query.sortOrder ?? 'desc',
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
    setEligibilityStatusFilter: (eligibilityStatus: string) =>
      setQuery({
        ...state.query,
        page: 1,
        eligibilityStatus: eligibilityStatus || undefined,
      }),
    setMemberTypeFilter: (memberType: MemberTypeFilter) => {
      setSearchInput('')
      setQuery(createMemberTypeQuery(state.query, memberType))
    },
    setSort: (sortBy: "telegramUsername" | "usdVolume" | "createdAt", sortOrder: "asc" | "desc") =>
      setQuery({
        ...state.query,
        page: 1,
        sortBy,
        sortOrder,
      }),
  }
}
