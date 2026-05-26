'use client'

import { Suspense } from 'react'
import AdminLoginScreen from '@/screens/admin/auth/LoginScreen'

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <AdminLoginScreen />
    </Suspense>
  )
}
