import type { AdminUser, AdminUserRole, AdminUserStatus } from '@/types/api/adminUser'

export type AdminRole = 'Admin GFI' | 'Admin duyệt bài' | 'Admin SCEX'
export type AdminStatus = 'active' | 'inactive' | 'suspended'

export interface AdminUserRow {
  id: string
  name: string
  email: string
  role: AdminRole
  status: AdminStatus
  apiRole: AdminUserRole
  apiStatus: AdminUserStatus
}

export const API_ROLE_TO_UI_ROLE: Record<AdminUserRole, AdminRole> = {
  SUPER_ADMIN: 'Admin GFI',
  GFI_ADMIN: 'Admin GFI',
  CONTENT_ADMIN: 'Admin duyệt bài',
  OPERATION_ADMIN: 'Admin SCEX',
  LPEX_ADMIN_VIEW: 'Admin SCEX',
}

export const UI_ROLE_TO_API_ROLE: Record<AdminRole, AdminUserRole> = {
  'Admin GFI': 'SUPER_ADMIN',
  'Admin duyệt bài': 'CONTENT_ADMIN',
  'Admin SCEX': 'OPERATION_ADMIN',
}

export const API_STATUS_TO_UI_STATUS: Record<AdminUserStatus, AdminStatus> = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
}

export const UI_STATUS_LABELS: Record<AdminStatus, string> = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  suspended: 'Tạm khóa',
}

export const ROLE_STYLES: Record<AdminRole, { bg: string; dot: string; text: string }> = {
  'Admin GFI': { bg: '#06301C', dot: '#41C588', text: '#41C588' },
  'Admin duyệt bài': { bg: '#002D67', dot: '#549BF8', text: '#549BF8' },
  'Admin SCEX': { bg: '#282828', dot: '#D7D8D9', text: '#D7D8D9' },
}

export const STATUS_STYLES: Record<AdminStatus, { bg: string; dot: string; text: string }> = {
  active: { bg: '#06301C', dot: '#41C588', text: '#41C588' },
  inactive: { bg: '#282828', dot: '#828283', text: '#D7D8D9' },
  suspended: { bg: '#5C120C', dot: '#F5827A', text: '#F5827A' },
}

export function mapApiRoleToUiRole(role: AdminUserRole): AdminRole {
  return API_ROLE_TO_UI_ROLE[role]
}

export function mapUiRoleToApiRole(role: AdminRole): AdminUserRole {
  return UI_ROLE_TO_API_ROLE[role]
}

export function mapApiStatusToUiStatus(status: AdminUserStatus): AdminStatus {
  return API_STATUS_TO_UI_STATUS[status]
}

export function mapAdminUserToRow(user: AdminUser): AdminUserRow {
  const role = mapApiRoleToUiRole(user.role)
  const status = mapApiStatusToUiStatus(user.status)

  return {
    id: user.id,
    name: user.fullName?.trim() || user.email,
    email: user.email,
    role,
    status,
    apiRole: user.role,
    apiStatus: user.status,
  }
}
