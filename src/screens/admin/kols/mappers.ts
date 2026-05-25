import type { AdminKolStatus } from '@/types/admin/kols'

export const adminKolStatusLabel: Record<AdminKolStatus | 'all', string> = {
  all: 'Tất cả trạng thái',
  PENDING: 'Chờ duyệt',
  ACTIVE: 'Đang hoạt động',
  REJECTED: 'Đã từ chối',
  PAUSED: 'Tạm dừng',
}

export const adminKolStatusOptions: Array<{ value: AdminKolStatus; label: string }> = [
  { value: 'PENDING', label: adminKolStatusLabel.PENDING },
  { value: 'ACTIVE', label: adminKolStatusLabel.ACTIVE },
  { value: 'REJECTED', label: adminKolStatusLabel.REJECTED },
  { value: 'PAUSED', label: adminKolStatusLabel.PAUSED },
]

export function kolStatusClassName(status: AdminKolStatus) {
  if (status === 'ACTIVE') return 'bg-success/[0.12] text-success border-success/20'
  if (status === 'PENDING') return 'bg-warning/[0.12] text-warning border-warning/20'
  if (status === 'REJECTED') return 'bg-destructive/[0.12] text-destructive border-destructive/20'
  return 'bg-muted text-muted-foreground border-border'
}

export function statusBadgeTone(status: AdminKolStatus): 'warning' | 'info' | 'danger' | 'neutral' {
  if (status === 'PENDING') return 'warning'
  if (status === 'ACTIVE') return 'info'
  if (status === 'REJECTED') return 'danger'
  return 'neutral'
}

export function toDateTimeVi(value?: string | null) {
  if (!value) return '---'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '---'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function toDateInputValue(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function toIsoDate(value?: string) {
  if (!value) return undefined
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}
