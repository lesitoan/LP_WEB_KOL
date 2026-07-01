'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoading } from '@/components/ui/pageLoading'
import { useAdminAuthSession } from '@/hooks/admin/useAdminAuthSession'
import { getDefaultAdminPath } from '@/lib/adminPermissions'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { hydrated, profile } = useAdminAuthSession()

  useEffect(() => {
    if (hydrated) {
      router.replace(getDefaultAdminPath(profile?.role))
    }
  }, [hydrated, profile?.role, router])

  return <PageLoading />
}
