'use client'

import TableFilterBar, {
  type ActiveFilterChip,
  type SelectFilterConfig,
} from '@/components/filters/TableFilterBar'

type GroupsFiltersProps = {
  searchInput: string
  statusValue: string
  isFetching: boolean
  onSearchInputChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClearStatus: () => void
  statusBadges?: Array<{
    key: string
    label: string
    count: number
    tone?: 'warning' | 'info' | 'danger' | 'neutral'
  }>
}

const STATUS_FILTER_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'paused', label: 'Paused' },
  { value: 'blocked', label: 'Blocked' },
]

export function GroupsFilters({
  searchInput,
  statusValue,
  isFetching,
  onSearchInputChange,
  onStatusChange,
  onClearStatus,
  statusBadges = [],
}: GroupsFiltersProps) {
  const selectFilters: SelectFilterConfig[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      options: STATUS_FILTER_OPTIONS,
    },
  ]

  const activeFilterChips: ActiveFilterChip[] =
    statusValue && statusValue !== 'all'
      ? [
          {
            key: 'status',
            label: 'Trạng thái',
            valueLabel: STATUS_FILTER_OPTIONS.find((option) => option.value === statusValue)?.label ?? statusValue,
          },
        ]
      : []

  return (
    <TableFilterBar
      textFilters={[
        {
          key: 'search',
          placeholder: 'Tìm theo tên group, tier, telegram group id...',
          widthClassName: 'flex-1 min-w-[260px] max-w-[520px]',
        },
      ]}
      textValues={{ search: searchInput }}
      selectFilters={selectFilters}
      activeFilterChips={activeFilterChips}
      statusBadges={statusBadges}
      disabled={isFetching}
      onTextChange={(_, value) => onSearchInputChange(value)}
      onSelectFilter={(_, value) => onStatusChange(value)}
      onRemoveChip={() => onClearStatus()}
    />
  )
}
