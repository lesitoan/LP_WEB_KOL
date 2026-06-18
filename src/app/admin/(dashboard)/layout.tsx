'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminAppLayout from '@/layouts/admin/AdminAppLayout'
import { useAdminAuthSession } from '@/hooks/admin/useAdminAuthSession'
import { PageLoading as SharedPageLoading } from '@/components/ui/pageLoading'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { hasToken, hydrated: authHydrated, isCheckingSession } = useAdminAuthSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (authHydrated && !hasToken) {
      const redirect = pathname || '/admin/dashboard'
      router.replace(`/admin/login?redirect=${encodeURIComponent(redirect)}`)
    }
  }, [authHydrated, hasToken, pathname, router])

  if (!mounted || !authHydrated || !hasToken || isCheckingSession) {
    return <SharedPageLoading />
  }

  return <AdminAppLayout>{children}</AdminAppLayout>
}
