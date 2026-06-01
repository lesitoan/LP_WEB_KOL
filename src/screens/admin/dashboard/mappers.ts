import type {
  AdminActivityIcon,
  AdminActivitySeverity,
  AdminActivityType,
  AdminKolStatus,
  AdminRecentActivityItem,
} from '@/types/admin/dashboard'

export const adminKolStatusLabel: Record<AdminKolStatus | 'all', string> = {
  all: 'Tất cả trạng thái',
  PENDING: 'Chờ duyệt',
  ACTIVE: 'Đang hoạt động',
  REJECTED: 'Đã từ chối',
  PAUSED: 'Tạm dừng',
}

export const adminActivityTypeLabel: Record<AdminActivityType, string> = {
  member_registrations_today: 'Thành viên mới hôm nay',
  member_low_volume_warning: 'Cảnh báo volume thấp',
  commission_cycle_summary: 'Tổng hợp hoa hồng chu kỳ',
  kol_approved: 'Partner đã được phê duyệt',
  cashback_ready_to_claim: 'Cashback chờ nhận',
}

export const adminActivitySeverityLabel: Record<AdminActivitySeverity, string> = {
  info: 'Thông tin',
  warning: 'Cảnh báo',
  success: 'Tích cực',
}

export const adminActivityIconLabel: Record<AdminActivityIcon, string> = {
  up: 'Tăng trưởng',
  warning: 'Cảnh báo',
  dollar: 'Tài chính',
  check: 'Xác nhận',
  gift: 'Ưu đãi',
}

export const activitySeverityClassName = (severity: AdminActivitySeverity) => {
  if (severity === 'warning') {
    return 'bg-warning/15 text-warning border-warning/35'
  }

  if (severity === 'success') {
    return 'bg-success/15 text-success border-success/35'
  }

  return 'bg-info/15 text-info border-info/35'
}

export const kolStatusClassName = (status: AdminKolStatus) => {
  if (status === 'ACTIVE') {
    return 'bg-success/15 text-success border-success/35'
  }

  if (status === 'REJECTED') {
    return 'bg-destructive/15 text-destructive border-destructive/35'
  }

  if (status === 'PAUSED') {
    return 'bg-warning/15 text-warning border-warning/35'
  }

  return 'bg-info/15 text-info border-info/35'
}

export const toCurrencyUsd = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export const toCompactNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

export const toDateTimeVi = (value: string | null | undefined) => {
  if (!value) return '—'

  return new Date(value).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const resolveMemberDisplayName = (activity: AdminRecentActivityItem) => {
  if (activity.title?.trim()) return activity.title
  const fallbackLabel = adminActivityTypeLabel[activity.type]
  return fallbackLabel || 'Hoạt động hệ thống'
}
