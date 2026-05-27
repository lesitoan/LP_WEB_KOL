'use client'

import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'
import type { AdminCashbackPayoutStatus } from '@/types/admin/cashback'
import { cashbackPayoutStatusOptions } from '../mappers'
import { optionLabel, type AdminCashbackTabFilterProps } from './filterTypes'

export function AdminCashbackPayoutFilters({ query, isFetching, onQueryChange }: AdminCashbackTabFilterProps) {
  const selectFilters: SelectFilterConfig[] = [
    { key: 'payoutStatus', label: 'Trạng thái chi trả', options: cashbackPayoutStatusOptions },
  ]

  const activeFilterChips: ActiveFilterChip[] = query.payoutStatus
    ? [
        {
          key: 'payoutStatus',
          label: 'Trạng thái',
          valueLabel: optionLabel(cashbackPayoutStatusOptions, query.payoutStatus),
        },
      ]
    : []

  return (
    <TableFilterBar
      textFilters={[]}
      textValues={{}}
      selectFilters={selectFilters}
      activeFilterChips={activeFilterChips}
      disabled={isFetching}
      onTextChange={() => undefined}
      onSelectFilter={(_, value) => onQueryChange({ ...query, page: 1, payoutStatus: value as AdminCashbackPayoutStatus })}
      onRemoveChip={() => onQueryChange({ ...query, page: 1, payoutStatus: undefined })}
    />
  )
}
