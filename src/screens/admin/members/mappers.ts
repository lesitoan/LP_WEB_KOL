export const telegramStatusOptions = [
  { value: 'active', label: 'Đang tham gia' },
  { value: 'inactive', label: 'Đã rời' },
]

export const lpexUserStatusOptions = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
]

export function fullName(firstName?: string | null, lastName?: string | null, username?: string | null) {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim() || username || '---'
}

export function initials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return 'MB'
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
}

export function statusClassName(status?: string | null) {
  const normalized = (status || '').trim().toLowerCase()
  if (normalized === 'active') return 'bg-success/[0.12] text-success border-success/20'
  if (normalized === 'inactive') return 'bg-muted text-muted-foreground border-border'
  return 'bg-warning/[0.12] text-warning border-warning/20'
}

export function formatLpexStatus(status?: string | null) {
  const normalized = (status || '').trim().toLowerCase()
  if (normalized === 'active') return 'Hoạt động'
  if (normalized === 'inactive') return 'Không hoạt động'
  return status || 'Không xác định'
}

export function formatTelegramStatus(status?: string | null) {
  const normalized = (status || '').trim().toLowerCase()
  if (normalized === 'active') return 'Đang tham gia'
  if (normalized === 'inactive') return 'Đã rời'
  return status || 'Không xác định'
}

export function formatUsd(value?: number | string | null) {
  const parsed = Number(value ?? 0)
  if (!Number.isFinite(parsed)) return '$0'
  return parsed.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function formatDateTime(value?: string | null) {
  if (!value) return '---'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '---'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
