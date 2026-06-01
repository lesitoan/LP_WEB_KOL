import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'

type DashboardKolFiltersProps = {
  draftSearch: string
  statusOptions: SelectFilterConfig['options']
  activeFilterChips: ActiveFilterChip[]
  statusBadges: {
    key: string
    label: string
    count: number
    tone: 'neutral' | 'info' | 'warning' | 'danger'
  }[]
  isDisabled: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onRemoveChip: (key: string) => void
}

export default function DashboardKolFilters({
  draftSearch,
  statusOptions,
  activeFilterChips,
  statusBadges,
  isDisabled,
  onSearchChange,
  onStatusChange,
  onRemoveChip,
}: DashboardKolFiltersProps) {
  return (
    <TableFilterBar
      textFilters={[{ key: 'search', placeholder: 'Tìm theo mã Partner, tên Partner...' }]}
      textValues={{ search: draftSearch }}
      selectFilters={[{ key: 'status', label: 'Trạng thái', options: statusOptions }]}
      activeFilterChips={activeFilterChips}
      statusBadges={statusBadges}
      disabled={isDisabled}
      onTextChange={(_, value) => onSearchChange(value)}
      onSelectFilter={(_, value) => onStatusChange(value)}
      onRemoveChip={(key) => onRemoveChip(key)}
    />
  )
}
