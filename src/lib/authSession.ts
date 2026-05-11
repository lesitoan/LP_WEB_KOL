import type { UserProfile } from '@/types/api'

export type AuthSession = {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
}

const emptySession: AuthSession = {
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

let unauthorizedRedirectTriggered = false

export function handleUnauthorizedSession() {
  if (typeof window === 'undefined') return

  clearAuthSession()

  if (unauthorizedRedirectTriggered) return

  unauthorizedRedirectTriggered = true
  window.location.replace('/login')
}
