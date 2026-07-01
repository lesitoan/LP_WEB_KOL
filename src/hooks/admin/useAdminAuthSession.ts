'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useGetCurrentAdminQuery } from '@/services/api/admin/authApi'
import { adminApi } from '@/services/api/baseApi'
import { clearAdminAuthSession, readAdminAuthSession } from '@/lib/authSession'
import type { AdminProfile } from '@/types/admin/auth'

type AdminAuthSessionState = {
  accessToken: string | null
  refreshToken: string | null
  profile: AdminProfile | null
  hydrated: boolean
}

export function useAdminAuthSession() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [session, setSession] = useState<AdminAuthSessionState>({
    accessToken: null,
    refreshToken: null,
    profile: null,
    hydrated: false,
  })

  useEffect(() => {
    const stored = readAdminAuthSession()
    setSession({
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
      profile: stored.user,
      hydrated: true,
    })
  }, [])

  const { data: currentAdmin, isLoading, isFetching } = useGetCurrentAdminQuery(undefined, {
    skip: !session.hydrated || !session.accessToken,
  })

  const isCheckingSession = Boolean(session.hydrated && session.accessToken && (isLoading || isFetching))
  const profile = currentAdmin ?? null

  const logout = () => {
    dispatch(adminApi.util.resetApiState())
    clearAdminAuthSession()
    setSession({
      accessToken: null,
      refreshToken: null,
      profile: null,
      hydrated: true,
    })
    router.push('/admin/login')
  }

  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    profile,
    hydrated: session.hydrated,
    hasToken: Boolean(session.accessToken),
    isCheckingSession,
    logout,
    setSession,
  }
}
