export type AdminKolStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'PAUSED'

export type AdminKolStatusAction = 'approve' | 'reject' | 'pause' | 'resume'

export interface AdminKolItem {
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
}

export interface AdminKolsPagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface AdminKolsData {
  items: AdminKolItem[]
  pagination: AdminKolsPagination
}

export interface ListAdminKolsQuery {
  page: number
  limit: number
  search?: string
  status?: AdminKolStatus
}

export interface CreateAdminKolBody {
  code: string
  displayName: string
  slug?: string
  ownerEmail: string
  ownerPassword: string
  ownerFullName?: string
  status?: AdminKolStatus
  lpexRefCode: string
  telegramUsername: string
  zaloContact?: string
  defaultLanguage?: string
  currentTierId?: string
  currentCommissionRate?: number
  onboardedAt?: string
  approvedAt?: string
}

export interface UpdateAdminKolBody {
  code?: string
  displayName?: string
  slug?: string
  ownerUserId?: string
  lpexRefCode?: string
  telegramUsername?: string
  zaloContact?: string
  defaultLanguage?: string
  currentTierId?: string
  currentCommissionRate?: number
  onboardedAt?: string
  approvedAt?: string
}
