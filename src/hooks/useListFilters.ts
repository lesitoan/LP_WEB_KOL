'use client'

import { useEffect, useReducer, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type ListFiltersState<TQuery, TViewMode extends string> = {
  query: TQuery
  viewMode: TViewMode
  searchInput: string
}

type SearchParamsLike = {
  get: (name: string) => string | null
  toString: () => string
}

type ListFiltersAction<TQuery, TViewMode extends string> =
  | { type: 'setViewMode'; payload: TViewMode }
  | { type: 'setSearchInput'; payload: string }
  | { type: 'applySearch' }
  | { type: 'setQuery'; payload: TQuery }
  | { type: 'hydrate'; payload: ListFiltersState<TQuery, TViewMode> }

type UseListFiltersOptions<TQuery, TViewMode extends string> = {
  initialState: ListFiltersState<TQuery, TViewMode>
  debounceMs?: number
  parseFromSearchParams: (searchParams: SearchParamsLike) => ListFiltersState<TQuery, TViewMode>
  serializeToSearchParams: (state: ListFiltersState<TQuery, TViewMode>) => URLSearchParams
  applySearchToQuery: (query: TQuery, searchInput: string) => TQuery
}

export function useListFilters<TQuery, TViewMode extends string>({
  initialState,
  debounceMs = 700,
  parseFromSearchParams,
  serializeToSearchParams,
  applySearchToQuery,
}: UseListFiltersOptions<TQuery, TViewMode>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasHydratedFromUrl = useRef(false)

  const reducer = (
    state: ListFiltersState<TQuery, TViewMode>,
    action: ListFiltersAction<TQuery, TViewMode>,
  ): ListFiltersState<TQuery, TViewMode> => {
    switch (action.type) {
      case 'setViewMode':
        return {
          ...state,
          viewMode: action.payload,
        }
      case 'setSearchInput':
        return {
          ...state,
          searchInput: action.payload,
        }
      case 'applySearch': {
        const nextQuery = applySearchToQuery(state.query, state.searchInput)
        if (JSON.stringify(nextQuery) === JSON.stringify(state.query)) {
          return state
        }
        return {
          ...state,
          query: nextQuery,
        }
      }
      case 'setQuery':
        return {
          ...state,
          query: action.payload,
        }
      case 'hydrate':
        return action.payload
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (hasHydratedFromUrl.current) {
      return
    }

    dispatch({
      type: 'hydrate',
      payload: parseFromSearchParams(searchParams),
    })

    hasHydratedFromUrl.current = true
  }, [parseFromSearchParams, searchParams])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch({ type: 'applySearch' })
    }, debounceMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [debounceMs, state.searchInput])

  useEffect(() => {
    if (!hasHydratedFromUrl.current) {
      return
    }

    const nextParams = serializeToSearchParams(state)
    const current = searchParams.toString()
    const next = nextParams.toString()

    if (current !== next) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    }
  }, [pathname, router, searchParams, serializeToSearchParams, state])

  return {
    state,
    setSearchInput: (value: string) => dispatch({ type: 'setSearchInput', payload: value }),
    setQuery: (next: TQuery) => dispatch({ type: 'setQuery', payload: next }),
    setViewMode: (mode: TViewMode) => dispatch({ type: 'setViewMode', payload: mode }),
  }
}
