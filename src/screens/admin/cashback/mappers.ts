import type {
  AdminCashbackConfigStatus,
  AdminCashbackCycleStatus,
  AdminCashbackDistributionCycle,
  AdminCashbackMemberRef,
  AdminCashbackPayoutStatus,
} from '@/types/admin/cashback'

export const cashbackConfigStatusOptions: Array<{ value: AdminCashbackConfigStatus; label: string }> = [
  { value: 'active', label: 'Đang hiệu lực' },
  { value: 'inactive', label: 'Tạm tắt' },
]

export const cashbackCycleOptions: Array<{ value: AdminCashbackDistributionCycle; label: string }> = [
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
]

export const cashbackCycleStatusOptions: Array<{ value: AdminCashbackCycleStatus; label: string }> = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'CALCULATING', label: 'Đang tính' },
  { value: 'READY', label: 'Sẵn sàng' },
  { value: 'DISTRIBUTING', label: 'Đang phân phối' },
  { value: 'COMPLETED', label: 'Hoàn tất' },
  { value: 'FAILED', label: 'Thất bại' },
]

export const cashbackPayoutStatusOptions: Array<{ value: AdminCashbackPayoutStatus; label: string }> = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'ready_to_claim', label: 'Chờ nhận' },
  { value: 'paid', label: 'Đã trả' },
  { value: 'failed', label: 'Thất bại' },
  { value: 'skipped_min_amount', label: 'Dưới ngưỡng' },
]

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

export function formatPercent(value?: number | string | null) {
  const parsed = Number(value ?? 0)
  if (!Number.isFinite(parsed)) return '0%'
  return `${parsed.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
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

export function formatDate(value?: string | null) {
  if (!value) return '---'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '---'
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(date)
}

export function formatDistributionCycle(value?: AdminCashbackDistributionCycle | null) {
  return cashbackCycleOptions.find((option) => option.value === value)?.label ?? value ?? '---'
}

export function formatConfigStatus(value?: AdminCashbackConfigStatus | null) {
  return cashbackConfigStatusOptions.find((option) => option.value === value)?.label ?? value ?? '---'
}

export function formatCycleStatus(value?: AdminCashbackCycleStatus | null) {
  return cashbackCycleStatusOptions.find((option) => option.value === value)?.label ?? value ?? '---'
}

export function formatPayoutStatus(value?: AdminCashbackPayoutStatus | null) {
  return cashbackPayoutStatusOptions.find((option) => option.value === value)?.label ?? value ?? '---'
}

export function memberName(member?: AdminCashbackMemberRef | null) {
  if (!member) return '---'
  const fullName = `${member.telegramFirstName ?? ''} ${member.telegramLastName ?? ''}`.trim()
  return fullName || member.telegramUsername || member.lpexUid || member.id
}

export function statusClassName(status?: string | null) {
  const normalized = (status || '').trim().toLowerCase()
  if (['active', 'completed', 'paid'].includes(normalized)) return 'bg-success/[0.12] text-success border-success/20'
  if (['failed'].includes(normalized)) return 'bg-destructive/[0.12] text-destructive border-destructive/20'
  if (['inactive', 'skipped_min_amount'].includes(normalized)) return 'bg-muted text-muted-foreground border-border'
  if (['ready', 'ready_to_claim'].includes(normalized)) return 'bg-info/[0.12] text-info border-info/20'
  return 'bg-warning/[0.12] text-warning border-warning/20'
}
