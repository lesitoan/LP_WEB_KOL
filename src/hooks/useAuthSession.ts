'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetCurrentUserQuery } from '@/services/api/authApi'
import { clearAuthSession, readAuthSession } from '@/lib/authSession'
import type { UserProfile } from '@/types/api'

type AuthSessionState = {
  accessToken: string | null
  refreshToken: string | null
  profile: UserProfile | null
  hydrated: boolean
}

export function useAuthSession() {
  const router = useRouter()
  const [session, setSession] = useState<AuthSessionState>({
    accessToken: null,
    refreshToken: null,
    profile: null,
    hydrated: false,
  })

  useEffect(() => {
    const stored = readAuthSession()
    setSession({
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
      profile: stored.user,
      hydrated: true,
    })
  }, [])

  const { data: currentUser, isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: !session.hydrated || !session.accessToken,
  })

  const isCheckingSession = Boolean(session.hydrated && session.accessToken && (isLoading || isFetching))

  const profile = useMemo(() => currentUser ?? session.profile, [currentUser, session.profile])

  const logout = () => {
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
    hasToken: Boolean(session.accessToken),
    isCheckingSession,
    logout,
    setSession,
  }
}
