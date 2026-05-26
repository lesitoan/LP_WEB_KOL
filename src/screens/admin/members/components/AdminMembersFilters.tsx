'use client'

import TableFilterBar, {
  type ActiveFilterChip,
  type SelectFilterConfig,
} from '@/components/filters/TableFilterBar'
import type { ListAdminMembersQuery } from '@/types/admin/members'
import { lpexUserStatusOptions, telegramStatusOptions } from '../mappers'

type AdminMembersFiltersProps = {
  query: ListAdminMembersQuery
  searchInput: string
  isFetching: boolean
  onSearchInputChange: (value: string) => void
  onQueryChange: (query: ListAdminMembersQuery) => void
}

export function AdminMembersFilters({
  query,
  searchInput,
  isFetching,
  onSearchInputChange,
  onQueryChange,
}: AdminMembersFiltersProps) {
  const selectFilters: SelectFilterConfig[] = [
    { key: 'telegramStatus', label: 'Trạng thái Telegram', options: telegramStatusOptions },
    { key: 'lpexUserStatus', label: 'Trạng thái LPEX', options: lpexUserStatusOptions },
  ]

  const activeFilterChips: ActiveFilterChip[] = []
  if (query.telegramStatus) {
    activeFilterChips.push({
      key: 'telegramStatus',
      label: 'Trạng thái Telegram',
      valueLabel: telegramStatusOptions.find((option) => option.value === query.telegramStatus)?.label ?? query.telegramStatus,
    })
  }

  if (query.lpexUserStatus) {
    activeFilterChips.push({
      key: 'lpexUserStatus',
      label: 'Trạng thái LPEX',
      valueLabel: lpexUserStatusOptions.find((option) => option.value === query.lpexUserStatus)?.label ?? query.lpexUserStatus,
    })
  }

  if (query.kolId) {
    activeFilterChips.push({ key: 'kolId', label: 'KOL ID', valueLabel: query.kolId })
  }

  return (
    <TableFilterBar
      textFilters={[
        {
          key: 'search',
          placeholder: 'Tìm theo LPEX UID, telegram, referrer KOL...',
          widthClassName: 'flex-1 min-w-[260px] max-w-[520px]',
        },
        // {
        //   key: 'kolId',
        //   placeholder: 'KOL ID',
        //   widthClassName: 'min-w-[220px] w-[280px]',
        // },
      ]}
      textValues={{
        search: searchInput,
        countryCode: query.countryCode ?? '',
        kolId: query.kolId ?? '',
      }}
      selectFilters={selectFilters}
      activeFilterChips={activeFilterChips}
      disabled={isFetching}
      onTextChange={(key, value) => {
        if (key === 'search') {
          onSearchInputChange(value)
          return
        }

        onQueryChange({
          ...query,
          page: 1,
          [key]: value.trim() || undefined,
        })
      }}
      onSelectFilter={(key, value) => onQueryChange({ ...query, page: 1, [key]: value })}
      onRemoveChip={(key) => onQueryChange({ ...query, page: 1, [key]: undefined })}
    />
  )
}
