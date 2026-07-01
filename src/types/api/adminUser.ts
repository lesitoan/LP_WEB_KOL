import type { ContentTypeCode, PaginationMeta } from './adminInsight'

export type AdminUserRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'OPERATION_ADMIN'
  | 'GFI_ADMIN'
  | 'LPEX_ADMIN_VIEW'

export type AdminUserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type AdminModuleScope = 'content' | 'monitor' | 'analytics' | 'users'

export interface AdminPermissionProfile {
  canReviewContent: boolean
  canEditContent: boolean
  canPublishContent: boolean
  canRecallContent: boolean
  canRequestAction: boolean
  canManageDistribution: boolean
  canManageAdmins: boolean
  canViewAuditLogs: boolean
  canViewAdminPerformance: boolean
  contentTypeScopes: ContentTypeCode[]
  tierScopes: string[]
  organizationScopes: string[]
  moduleScopes: AdminModuleScope[]
}

export type AdminPermissionProfileBody = Partial<AdminPermissionProfile>

export interface AdminUser {
  id: string
  email: string
  fullName: string | null
  role: AdminUserRole
  status: AdminUserStatus
  twoFactorEnabled: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  adminPermissionProfile: AdminPermissionProfile | null
}

export interface ListAdminUsersQuery {
  page?: number
  limit?: number
  search?: string
  role?: AdminUserRole
  status?: AdminUserStatus
}

export interface PaginatedAdminUsers {
  items: AdminUser[]
  pagination: PaginationMeta
}

export interface CreateAdminUserBody {
  email: string
  fullName?: string | null
  role: AdminUserRole
  status?: AdminUserStatus
  password?: string
  permissionProfile?: AdminPermissionProfileBody
}

export interface CreateAdminUserResult {
  user: AdminUser
  temporaryPassword: string | null
}

export interface UpdateAdminUserBody {
  email?: string
  fullName?: string | null
  role?: AdminUserRole
  resetPermissionsToRoleDefault?: boolean
}

export interface UpdateAdminUserStatusBody {
  status: AdminUserStatus
}
