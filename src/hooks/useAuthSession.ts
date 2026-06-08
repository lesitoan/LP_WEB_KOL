'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useGetCurrentUserQuery } from '@/services/api/authApi'
import { api } from '@/services/api/baseApi'
import { clearAuthSession } from '@/lib/authSession'
import type { UserProfile } from '@/types/api'

type AuthSessionState = {
  accessToken: string | null
  refreshToken: string | null
  profile: UserProfile | null
  hydrated: boolean
}

const bypassAuthProfile = {
  id: 'dev-bypass',
  email: 'dev-bypass@local',
  name: 'Dev Bypass',
  role: 'kol',
} as UserProfile

export function useAuthSession() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [session, setSession] = useState<AuthSessionState>({
    accessToken: null,
    refreshToken: null,
    profile: null,
    hydrated: false,
  })

  useEffect(() => {
    // const stored = readAuthSession()
    setSession({
      accessToken: 'dev-bypass-token',
      refreshToken: 'dev-bypass-refresh-token',
      profile: bypassAuthProfile,
      hydrated: true,
    })
  }, [])

  const { data: currentUser, isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: true,
    // skip: !session.hydrated || !session.accessToken,
  })

  const isCheckingSession = Boolean(session.hydrated && session.accessToken && (isLoading || isFetching))

  const profile = useMemo(() => currentUser ?? session.profile, [currentUser, session.profile])

  const logout = () => {
    dispatch(api.util.resetApiState())
    clearAuthSession()
    setSession({
      accessToken: null,
      refreshToken: null,
      profile: null,
      hydrated: true,
    })
    router.push('/login')
  }

  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    profile,
    hydrated: session.hydrated,
    hasToken: true,
    // hasToken: Boolean(session.accessToken),
    isCheckingSession,
    logout,
    setSession,
  }
}
