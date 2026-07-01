export type AdminRoleCode =
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'OPERATION_ADMIN'
  | 'GFI_ADMIN'
  | 'LPEX_ADMIN_VIEW'

export type AdminNavItemId =
  | 'post-review'
  | 'distribution'
  | 'analytics-kols'
  | 'analytics-content'
  | 'published-post'
  | 'reviews'
  | 'users'
  | 'settings'
  | 'dashboard'

const FULL_ACCESS_ROLES: AdminRoleCode[] = ['SUPER_ADMIN', 'GFI_ADMIN']

const ROLE_ALIASES: Record<string, AdminRoleCode> = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  GFI_ADMIN: 'GFI_ADMIN',
  CONTENT_ADMIN: 'CONTENT_ADMIN',
  OPERATION_ADMIN: 'OPERATION_ADMIN',
  LPEX_ADMIN_VIEW: 'LPEX_ADMIN_VIEW',
}

const ROLE_NAV_PERMISSIONS: Record<AdminRoleCode, AdminNavItemId[]> = {
  SUPER_ADMIN: [
    'post-review',
    'distribution',
    'analytics-kols',
    'analytics-content',
    'published-post',
    'reviews',
    'users',
    'settings',
    'dashboard',
  ],
  GFI_ADMIN: [
    'post-review',
    'distribution',
    'analytics-kols',
    'analytics-content',
    'published-post',
    'reviews',
    'users',
    'settings',
    'dashboard',
  ],
  CONTENT_ADMIN: ['post-review', 'dashboard'],
  OPERATION_ADMIN: ['published-post', 'analytics-kols', 'dashboard'],
  LPEX_ADMIN_VIEW: ['published-post', 'analytics-kols', 'dashboard'],
}

const ROLE_MENU_PERMISSIONS: Record<AdminRoleCode, AdminNavItemId[]> = {
  ...ROLE_NAV_PERMISSIONS,
  SUPER_ADMIN: ROLE_NAV_PERMISSIONS.SUPER_ADMIN.filter((itemId) => itemId !== 'published-post'),
  GFI_ADMIN: ROLE_NAV_PERMISSIONS.GFI_ADMIN.filter((itemId) => itemId !== 'published-post'),
}

const ADMIN_ROLE_LABELS: Record<AdminRoleCode, string> = {
  SUPER_ADMIN: 'Admin GFI',
  GFI_ADMIN: 'Admin GFI',
  CONTENT_ADMIN: 'Admin duyệt bài',
  OPERATION_ADMIN: 'Admin SCEX',
  LPEX_ADMIN_VIEW: 'Admin SCEX',
}

export const ADMIN_ROUTE_PATHS: Record<AdminNavItemId, string> = {
  'post-review': '/admin/post-review',
  distribution: '/admin/distribution',
  'analytics-kols': '/admin/analytics/kols',
  'analytics-content': '/admin/analytics/content',
  'published-post': '/admin/published-post',
  reviews: '/admin/reviews',
  users: '/admin/users',
  settings: '/admin/settings',
  dashboard: '/admin/dashboard',
}

export function normalizeAdminRole(role?: string | null): AdminRoleCode | null {
  if (!role) return null

  const trimmedRole = role.trim()
  if (ROLE_ALIASES[trimmedRole]) return ROLE_ALIASES[trimmedRole]

  const lowerRole = trimmedRole.toLowerCase()
  if (lowerRole.includes('gfi')) return 'SUPER_ADMIN'
  if (lowerRole.includes('scex')) return 'OPERATION_ADMIN'
  if (lowerRole.includes('duyet') || lowerRole.includes('duyệt')) return 'CONTENT_ADMIN'

  return null
}

export function isFullAccessAdmin(role?: string | null) {
  const normalizedRole = normalizeAdminRole(role)
  return normalizedRole ? FULL_ACCESS_ROLES.includes(normalizedRole) : false
}

export function getAllowedAdminNavItems(role?: string | null): AdminNavItemId[] {
  const normalizedRole = normalizeAdminRole(role)
  return normalizedRole ? ROLE_NAV_PERMISSIONS[normalizedRole] : []
}

export function canViewAdminNavItem(role: string | null | undefined, navItemId: AdminNavItemId) {
  const normalizedRole = normalizeAdminRole(role)
  return normalizedRole ? ROLE_MENU_PERMISSIONS[normalizedRole].includes(navItemId) : false
}

export function canAccessAdminPath(role: string | null | undefined, pathname: string) {
  const allowedItems = getAllowedAdminNavItems(role)

  return allowedItems.some((itemId) => {
    const routePath = ADMIN_ROUTE_PATHS[itemId]
    return pathname === routePath || pathname.startsWith(`${routePath}/`)
  })
}

export function getDefaultAdminPath(role?: string | null) {
  const [firstAllowedItem] = getAllowedAdminNavItems(role)
  return firstAllowedItem ? ADMIN_ROUTE_PATHS[firstAllowedItem] : '/admin/login'
}

export function getAdminRoleLabel(role?: string | null) {
  const normalizedRole = normalizeAdminRole(role)
  return normalizedRole ? ADMIN_ROLE_LABELS[normalizedRole] : role || 'Admin'
}
