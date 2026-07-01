import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import {
  handleForbiddenAdminRoute,
  handleUnauthorizedAdminSession,
  handleUnauthorizedSession,
  readAdminAuthSession,
  readAuthSession,
  writeAdminAuthSession,
  writeAuthSession,
} from '@/lib/authSession'
import type { ApiResponse } from '@/types/api'
import type { LoginResult } from '@/types/api'
import type { AdminLoginResult } from '@/types/admin/auth'

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

  const silentLogout = () => {
    handleUnauthorizedSession()
    return new Promise<never>(() => {})
  }

  if (result.error?.status !== 401) {
    return result
  }

  const url = typeof args === 'string' ? args : args.url || ''

  // Không cố refresh cho các endpoint auth chính để tránh loop
  if (url.includes('/kol/auth/login') || url.includes('/kol/auth/verify-2fa')) {
    return result
  }

  if (url.includes('/kol/auth/refresh')) {
    return silentLogout()
  }

  const refreshToken = getCookie('refreshToken')

  if (!refreshToken) {
    return silentLogout()
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
     return silentLogout()
  }

  const payload = refreshResult.data as ApiResponse<LoginResult> | undefined

  if (!payload || payload.status !== 'success' || !payload.data) {
    return silentLogout()
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
    return silentLogout()
  }

  return result
}

const adminBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers) => {
    const token = getCookie('adminAccessToken')
    headers.set('Content-Type', 'application/json')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const adminBaseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const silentLogout = () => {
    handleUnauthorizedAdminSession()
    return new Promise<never>(() => {})
  }

  let result = await adminBaseQuery(args, api, extraOptions)
  const method = typeof args === 'string' ? 'GET' : (args.method || 'GET').toUpperCase()

  if (result.error?.status === 403 && method === 'GET') {
    handleForbiddenAdminRoute()
    return new Promise<never>(() => {})
  }

  if (result.error?.status !== 401) {
    return result
  }

  const url = typeof args === 'string' ? args : args.url || ''

  if (url.includes('/admin/auth/login') || url.includes('/admin/auth/verify-2fa')) {
    return result
  }

  if (url.includes('/admin/auth/refresh')) {
    return silentLogout()
  }

  const refreshToken = getCookie('adminRefreshToken')

  if (!refreshToken) {
    return silentLogout()
  }

  const refreshResult = await adminBaseQuery(
    {
      url: '/api/v1/admin/auth/refresh',
      method: 'POST',
      body: { refreshToken },
    },
    api,
    extraOptions,
  )

  if (refreshResult.error) {
    return silentLogout()
  }

  const payload = refreshResult.data as ApiResponse<AdminLoginResult> | undefined

  if (!payload || payload.status !== 'success' || !payload.data) {
    return silentLogout()
  }

  const currentSession = readAdminAuthSession()

  writeAdminAuthSession({
    accessToken: payload.data.accessToken,
    refreshToken: payload.data.refreshToken,
    user: currentSession.user,
  })

  result = await adminBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    return silentLogout()
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Members', 'Groups', 'Dashboard', 'Referrals', 'Partner', 'Cashback', 'Benefits', 'Campaigns'],
  endpoints: () => ({}),
})

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: adminBaseQueryWithReauth,
  tagTypes: ['Auth', 'Members', 'Groups', 'Dashboard', 'Kols', 'Tiers', 'Referrals', 'Partner', 'Cashback', 'Benefits', 'Insights', 'AdminUsers'],
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

    const rawMessage = `${candidate.error || ''} ${candidate.message || ''}`.toLowerCase()

    if (candidate.status === 'FETCH_ERROR' || rawMessage.includes('failed to fetch')) {
      return 'Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng thử lại.'
    }

    if (candidate.status === 'TIMEOUT_ERROR') {
      return 'Kết nối tới máy chủ bị quá thời gian. Vui lòng thử lại.'
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
