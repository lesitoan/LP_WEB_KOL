'use client'

import TableFilterBar, {
  type ActiveFilterChip,
  type SelectFilterConfig,
} from '@/components/filters/TableFilterBar'
import type { AdminKolStatus } from '@/types/admin/kols'
import { adminKolStatusLabel, adminKolStatusOptions } from '../mappers'

type AdminKolsFiltersProps = {
  searchInput: string
  statusValue?: AdminKolStatus
  isFetching: boolean
  statusBadges: Array<{
    key: string
    label: string
    count: number
    tone?: 'warning' | 'info' | 'danger' | 'neutral'
  }>
  onSearchInputChange: (value: string) => void
  onStatusChange: (value: AdminKolStatus) => void
  onClearStatus: () => void
}

export function AdminKolsFilters({
  searchInput,
  statusValue,
  isFetching,
  statusBadges,
  onSearchInputChange,
  onStatusChange,
  onClearStatus,
}: AdminKolsFiltersProps) {
  const selectFilters: SelectFilterConfig[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      options: adminKolStatusOptions,
    },
  ]

  const activeFilterChips: ActiveFilterChip[] = statusValue
    ? [
        {
          key: 'status',
          label: 'Trạng thái',
          valueLabel: adminKolStatusLabel[statusValue],
        },
      ]
    : []

  return (
    <TableFilterBar
      textFilters={[
        {
          key: 'search',
          placeholder: 'Tìm theo mã Partner, tên Partner, ref code, slug...',
          widthClassName: 'flex-1 min-w-[260px] max-w-[520px]',
        },
      ]}
      textValues={{ search: searchInput }}
      selectFilters={selectFilters}
      activeFilterChips={activeFilterChips}
      statusBadges={statusBadges}
      disabled={isFetching}
      onTextChange={(_, value) => onSearchInputChange(value)}
      onSelectFilter={(_, value) => onStatusChange(value as AdminKolStatus)}
      onRemoveChip={() => onClearStatus()}
    />
  )
}
