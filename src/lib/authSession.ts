import type { UserProfile } from '@/types/api'
import type { AdminProfile } from '@/types/admin/auth'

export type AuthSession = {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
}

export type AdminAuthSession = {
  accessToken: string | null
  refreshToken: string | null
  user: AdminProfile | null
}

const emptySession: AuthSession = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

const emptyAdminSession: AdminAuthSession = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function readAuthSession(): AuthSession {
  if (typeof document === 'undefined') {
    return emptySession
  }

  const accessToken = getCookie('accessToken')
  const refreshToken = getCookie('refreshToken')
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const user = userRaw ? (JSON.parse(userRaw) as UserProfile) : null

  return {
    accessToken,
    refreshToken,
    user,
  }
}

export function readAdminAuthSession(): AdminAuthSession {
  if (typeof document === 'undefined') {
    return emptyAdminSession
  }

  const accessToken = getCookie('adminAccessToken')
  const refreshToken = getCookie('adminRefreshToken')
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('adminUser') : null
  const user = userRaw ? (JSON.parse(userRaw) as AdminProfile) : null

  return {
    accessToken,
    refreshToken,
    user,
  }
}

export function writeAuthSession(session: AuthSession) {
  if (typeof document === 'undefined') return

  if (typeof window !== 'undefined') {
    if (session.user) {
      localStorage.setItem('user', JSON.stringify(session.user))
    } else {
      localStorage.removeItem('user')
    }
  }

  const cookieBase = 'path=/'
  document.cookie = `accessToken=${encodeURIComponent(session.accessToken ?? '')}; ${cookieBase}`
  if (session.refreshToken) {
    document.cookie = `refreshToken=${encodeURIComponent(session.refreshToken)}; ${cookieBase}`
  }
}

export function writeAdminAuthSession(session: AdminAuthSession) {
  if (typeof document === 'undefined') return

  if (typeof window !== 'undefined') {
    if (session.user) {
      localStorage.setItem('adminUser', JSON.stringify(session.user))
    } else {
      localStorage.removeItem('adminUser')
    }
  }

  const cookieBase = 'path=/'
  document.cookie = `adminAccessToken=${encodeURIComponent(session.accessToken ?? '')}; ${cookieBase}`
  if (session.refreshToken) {
    document.cookie = `adminRefreshToken=${encodeURIComponent(session.refreshToken)}; ${cookieBase}`
  }
}

export function clearAuthSession() {
  if (typeof document === 'undefined') return

  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  document.cookie = 'accessToken=; Max-Age=0; path=/'
  document.cookie = 'refreshToken=; Max-Age=0; path=/'
}

export function clearAdminAuthSession() {
  if (typeof document === 'undefined') return

  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
  }

  document.cookie = 'adminAccessToken=; Max-Age=0; path=/'
  document.cookie = 'adminRefreshToken=; Max-Age=0; path=/'
}

let unauthorizedRedirectTriggered = false
let unauthorizedAdminRedirectTriggered = false
let forbiddenAdminRedirectTriggered = false

export function handleUnauthorizedSession() {
  if (typeof window === 'undefined') return

  clearAuthSession()

  if (unauthorizedRedirectTriggered) return

  unauthorizedRedirectTriggered = true
  window.location.replace('/login')
}

export function handleUnauthorizedAdminSession() {
  if (typeof window === 'undefined') return

  clearAdminAuthSession()

  if (unauthorizedAdminRedirectTriggered) return

  unauthorizedAdminRedirectTriggered = true
  window.location.replace('/admin/login')
}

export function handleForbiddenAdminRoute() {
  if (typeof window === 'undefined') return
  if (forbiddenAdminRedirectTriggered) return

  forbiddenAdminRedirectTriggered = true
  window.location.replace('/admin/not-found')
}
