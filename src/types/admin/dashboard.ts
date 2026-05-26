export type AdminKolStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'PAUSED'

export type AdminActivityType =
  | 'member_registrations_today'
  | 'member_low_volume_warning'
  | 'commission_cycle_summary'
  | 'kol_approved'
  | 'cashback_ready_to_claim'

export type AdminActivityIcon = 'up' | 'warning' | 'dollar' | 'check' | 'gift'

export type AdminActivitySeverity = 'info' | 'warning' | 'success'

export interface AdminDashboardOverviewQuery {
  page?: number
  limit?: number
  search?: string
  status?: AdminKolStatus
  memberLimit?: number
}

export interface AdminRecentActivitiesQuery {
  limit?: number
}

export interface AdminDashboardMember {
  id: string
  lpexUid: string
  telegramUserId: string
  telegramUsername?: string | null
  telegramFirstName?: string | null
  telegramLastName?: string | null
  telegramStatus: string
  lpexUserStatus: string
  countryCode?: string | null
  usdVolume: number | string
  createdAt: string
  updatedAt: string
}

export interface AdminDashboardKolItem {
  id: string
  code: string
  displayName: string
  slug?: string | null
  ownerUserId?: string | null
  status: AdminKolStatus
  lpexRefCode: string
  telegramUsername: string
  zaloContact?: string | null
  defaultLanguage?: string | null
  currentTierId?: string | null
  currentCommissionRate: number | string
  onboardedAt?: string | null
  approvedAt?: string | null
  createdAt: string
  updatedAt: string
  memberCount: number
  totalMemberVolumeUsd: number
  members: AdminDashboardMember[]
}

export interface AdminDashboardOverviewData {
  summary: {
    totalKols: number
    totalMembers: number
    totalMemberVolumeUsd: number
  }
  items: AdminDashboardKolItem[]
  page: number
  limit: number
  totalItems: number
}

export interface AdminRecentActivityItem {
  type: AdminActivityType
  icon: AdminActivityIcon
  severity: AdminActivitySeverity
  title: string
  description: string
  occurredAt: string
  metadata?: Record<string, unknown>
}
