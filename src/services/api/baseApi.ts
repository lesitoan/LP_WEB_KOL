import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { handleUnauthorizedSession, readAuthSession, writeAuthSession } from '@/lib/authSession'
import type { ApiResponse } from '@/types/api'
import type { LoginResult } from '@/types/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers) => {
    const token = getCookie('accessToken')
    headers.set('Content-Type', 'application/json')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status !== 401) {
    return result
  }

  const url = typeof args === 'string' ? args : args.url || ''

  // Không cố refresh cho các endpoint auth chính để tránh loop
  if (url.includes('/kol/auth/login')) {
    return result
  }

  if (url.includes('/kol/auth/refresh')) {
    handleUnauthorizedSession()
    return result
  }

  const refreshToken = getCookie('refreshToken')

  if (!refreshToken) {
    handleUnauthorizedSession()
    return result
  }

  const refreshResult = await baseQuery(
    {
      url: '/api/v1/kol/auth/refresh',
      method: 'POST',
      body: { refreshToken },
    },
    api,
    extraOptions,
  )

  if (refreshResult.error) {
    handleUnauthorizedSession()
    return result
  }

  const payload = refreshResult.data as ApiResponse<LoginResult> | undefined

  if (!payload || payload.status !== 'success' || !payload.data) {
    handleUnauthorizedSession()
    return result
  }

  const currentSession = readAuthSession()

  writeAuthSession({
    accessToken: payload.data.accessToken,
    refreshToken: payload.data.refreshToken,
    user: currentSession.user,
  })

  // Retry request với access token mới
  result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    handleUnauthorizedSession()
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Members', 'Groups', 'Dashboard', 'Referrals', 'Partner', 'Cashback', 'Benefits'],
  endpoints: () => ({}),
})

export const pickApiMessage = (
  payload: { externalMessage?: string; internalMessage?: string; message?: string },
  fallback: string
) => payload.externalMessage || payload.internalMessage || payload.message || fallback

export function extractApiErrorMessage(error: unknown, fallback: string) {
  if (!error) return fallback

  if (typeof error === 'string') return error

  if (typeof error === 'object') {
    const candidate = error as {
      data?: {
        externalMessage?: string
        internalMessage?: string
        message?: string
        error?: string
      }
      error?: string
      status?: string | number
      message?: string
    }

    return (
      candidate.data?.externalMessage ||
      candidate.data?.internalMessage ||
      candidate.data?.message ||
      candidate.data?.error ||
      candidate.error ||
      candidate.message ||
      fallback
    )
  }

  return fallback
}
