'use client'

import TableFilterBar, {
  type ActiveFilterChip,
  type SelectFilterConfig,
} from '@/components/filters/TableFilterBar'

type MembersFiltersProps = {
  searchInput: string
  countryCodeInput: string
  isFetching: boolean
  selectFilters: SelectFilterConfig[]
  activeFilterChips: ActiveFilterChip[]
  onSearchInputChange: (value: string) => void
  onCountryCodeInputChange: (value: string) => void
  onSelectFilter: (key: string, value: string) => void
  onRemoveChip: (key: string) => void
  statusBadges?: Array<{
    key: string
    label: string
    count: number
    tone?: 'warning' | 'info' | 'danger' | 'neutral'
  }>
}

export default function MembersFilters({
  searchInput,
  countryCodeInput,
  isFetching,
  selectFilters,
  activeFilterChips,
  onSearchInputChange,
  onCountryCodeInputChange,
  onSelectFilter,
  onRemoveChip,
  statusBadges = [],
}: MembersFiltersProps) {
  return (
    <TableFilterBar
      textFilters={[
        {
          key: 'search',
          placeholder: 'Tìm theo username, UID, Telegram ID...',
          widthClassName: 'flex-1 min-w-[260px] max-w-[420px]',
        },
        {
          key: 'countryCode',
          placeholder: 'Country code (VN, SG, ...)',
          widthClassName: 'min-w-[180px] w-[220px]',
        },
      ]}
      textValues={{
        search: searchInput,
        countryCode: countryCodeInput,
      }}
      selectFilters={selectFilters}
      activeFilterChips={activeFilterChips}
      statusBadges={statusBadges}
      disabled={isFetching}
      onTextChange={(key, value) => {
        if (key === 'search') {
          onSearchInputChange(value)
          return
        }

        if (key === 'countryCode') {
          onCountryCodeInputChange(value.toUpperCase().slice(0, 2))
        }
      }}
      onSelectFilter={onSelectFilter}
      onRemoveChip={onRemoveChip}
    />
  )
}
