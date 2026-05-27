'use client'

import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'
import type { AdminCashbackCycleStatus, AdminCashbackDistributionCycle } from '@/types/admin/cashback'
import { cashbackCycleOptions, cashbackCycleStatusOptions } from '../mappers'
import { optionLabel, type AdminCashbackTabFilterProps } from './filterTypes'

export function AdminCashbackCycleFilters({ query, isFetching, onQueryChange }: AdminCashbackTabFilterProps) {
  const selectFilters: SelectFilterConfig[] = [
    { key: 'cycleType', label: 'Loại chu kỳ', options: cashbackCycleOptions },
    { key: 'status', label: 'Trạng thái chu kỳ', options: cashbackCycleStatusOptions },
  ]

  const activeFilterChips: ActiveFilterChip[] = []
  if (query.cycleType) {
    activeFilterChips.push({
      key: 'cycleType',
      label: 'Loại chu kỳ',
      valueLabel: optionLabel(cashbackCycleOptions, query.cycleType),
    })
  }
  if (query.status) {
    activeFilterChips.push({
      key: 'status',
      label: 'Trạng thái',
      valueLabel: optionLabel(cashbackCycleStatusOptions, query.status),
    })
  }

  return (
    <TableFilterBar
      textFilters={[]}
      textValues={{}}
      selectFilters={selectFilters}
      activeFilterChips={activeFilterChips}
      disabled={isFetching}
      onTextChange={() => undefined}
      onSelectFilter={(key, value) => {
        if (key === 'cycleType') {
          onQueryChange({ ...query, page: 1, cycleType: value as AdminCashbackDistributionCycle })
          return
        }

        onQueryChange({ ...query, page: 1, status: value as AdminCashbackCycleStatus })
      }}
      onRemoveChip={(key) => onQueryChange({ ...query, page: 1, [key]: undefined })}
    />
  )
}
