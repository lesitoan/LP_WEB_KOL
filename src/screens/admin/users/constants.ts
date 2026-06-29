export type AdminRole = 'Admin GFI' | 'Admin duyệt bài' | 'Admin SCEX'
export type AdminStatus = 'active' | 'inactive'

export interface AdminUserRow {
  id: string
  name: string
  email: string
  role: AdminRole
  status: AdminStatus
}

export const adminUsersData: AdminUserRow[] = [
  { id: '1', name: 'Admin 01', email: 'admin1@scex.io', role: 'Admin GFI', status: 'active' },
  { id: '2', name: 'Admin 02', email: 'admin2@scex.io', role: 'Admin duyệt bài', status: 'active' },
  { id: '3', name: 'Admin 03', email: 'admin3@scex.io', role: 'Admin SCEX', status: 'active' },
  { id: '4', name: 'Admin 04', email: 'admin3@scex.io', role: 'Admin duyệt bài', status: 'active' },
  { id: '5', name: 'Admin 05', email: 'admin4@scex.io', role: 'Admin SCEX', status: 'active' },
  { id: '6', name: 'Admin 06', email: 'admin5@scex.io', role: 'Admin GFI', status: 'active' },
  { id: '7', name: 'Admin 07', email: 'admin6@scex.io', role: 'Admin SCEX', status: 'active' },
  { id: '8', name: 'Admin 08', email: 'admin7@scex.io', role: 'Admin GFI', status: 'active' },
]

export const ROLE_STYLES: Record<AdminRole, { bg: string; dot: string; text: string }> = {
  'Admin GFI':       { bg: '#06301C', dot: '#41C588', text: '#41C588' },
  'Admin duyệt bài': { bg: '#002D67', dot: '#549BF8', text: '#549BF8' },
  'Admin SCEX':      { bg: '#282828', dot: '#D7D8D9', text: '#D7D8D9' },
}
