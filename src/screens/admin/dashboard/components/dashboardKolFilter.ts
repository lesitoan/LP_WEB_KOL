import { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'
import type { AdminDashboardKolItem, AdminKolStatus } from '@/types/admin/dashboard'
import { adminKolStatusLabel } from '../mappers'

export const statusOptions: SelectFilterConfig['options'] = [
  { value: 'all', label: adminKolStatusLabel.all },
  { value: 'PENDING', label: adminKolStatusLabel.PENDING },
  { value: 'ACTIVE', label: adminKolStatusLabel.ACTIVE },
  { value: 'REJECTED', label: adminKolStatusLabel.REJECTED },
  { value: 'PAUSED', label: adminKolStatusLabel.PAUSED },
]

const statusBadgesTone = (status: AdminKolStatus) => {
  if (status === 'ACTIVE') return 'info' as const
  if (status === 'PAUSED') return 'warning' as const
  if (status === 'REJECTED') return 'danger' as const
  return 'neutral' as const
}

export const buildActiveFilterChips = (status: string): ActiveFilterChip[] => {
  if (!status || status === 'all') return []
  return [
    {
      key: 'status',
      label: 'Trạng thái',
      valueLabel: adminKolStatusLabel[status as AdminKolStatus],
    },
  ]
}

export const buildStatusBadges = (items: AdminDashboardKolItem[]) => {
  const counts: Record<AdminKolStatus, number> = {
    PENDING: 0,
    ACTIVE: 0,
    REJECTED: 0,
    PAUSED: 0,
  }

  for (const item of items) {
    counts[item.status] += 1
  }

  return (Object.keys(counts) as AdminKolStatus[]).map((key) => ({
    key,
    label: adminKolStatusLabel[key],
    count: counts[key],
    tone: statusBadgesTone(key),
  }))
}
