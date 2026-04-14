import type {
  CashbackConfigStatus,
  CashbackCycleStatus,
  CashbackPayoutStatus,
  DistributionCycle,
} from '@/types/api'

export const cycleStatusOptions: Array<CashbackCycleStatus | 'all'> = [
  'all',
  'PENDING',
  'CALCULATING',
  'READY',
  'DISTRIBUTING',
  'COMPLETED',
  'FAILED',
]

export const payoutStatusOptions: Array<CashbackPayoutStatus | 'all'> = [
  'all',
  'pending',
  'split_requested',
  'paid',
  'failed',
  'skipped_min_amount',
]

export const cycleStatusLabel: Record<string, string> = {
  all: 'Tất cả',
  PENDING: 'Chờ xử lý',
  CALCULATING: 'Đang tính',
  READY: 'Sẵn sàng',
  DISTRIBUTING: 'Đang phân phối',
  COMPLETED: 'Hoàn thành',
  FAILED: 'Thất bại',
}

export const payoutStatusLabel: Record<string, string> = {
  all: 'Tất cả',
  pending: 'Chờ xử lý',
  split_requested: 'Yêu cầu tách',
  paid: 'Đã thanh toán',
  failed: 'Thất bại',
  skipped_min_amount: 'Dưới mức tối thiểu',
}

export const configStatusLabel: Record<string, string> = {
  all: 'Tất cả',
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
}

export const cycleTypeLabel: Record<string, string> = {
  all: 'Tất cả loại',
  weekly: 'Hàng tuần',
  monthly: 'Hàng tháng',
}

export const distributionCycleLabel: Record<DistributionCycle, string> = {
  weekly: 'Hàng tuần',
  monthly: 'Hàng tháng',
}

export function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function toDateTime(value: string) {
  return new Date(value).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function toDateInputValue(date: Date) {
  const copy = new Date(date)
  copy.setSeconds(0, 0)
  const tzOffset = copy.getTimezoneOffset() * 60000
  return new Date(copy.getTime() - tzOffset).toISOString().slice(0, 16)
}

export function statusBadgeClass(status: string) {
  if (status === 'active' || status === 'paid' || status === 'COMPLETED') {
    return 'bg-success/20 text-success border-success/30'
  }

  if (status === 'failed' || status === 'FAILED') {
    return 'bg-destructive/15 text-destructive border-destructive/40'
  }

  return 'bg-warning/20 text-warning border-warning/30'
}

export type ConfigStatusFilter = CashbackConfigStatus | 'all'
export type CycleStatusFilter = CashbackCycleStatus | 'all'
export type CycleTypeFilter = DistributionCycle | 'all'
export type PayoutStatusFilter = CashbackPayoutStatus | 'all'
