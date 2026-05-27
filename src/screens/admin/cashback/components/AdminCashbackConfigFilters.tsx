'use client'

import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'
import type { AdminCashbackConfigStatus, AdminCashbackDistributionCycle } from '@/types/admin/cashback'
import { cashbackConfigStatusOptions, cashbackCycleOptions } from '../mappers'
import { optionLabel, type AdminCashbackTabFilterProps } from './filterTypes'

export function AdminCashbackConfigFilters({ query, isFetching, onQueryChange }: AdminCashbackTabFilterProps) {
  const selectFilters: SelectFilterConfig[] = [
    { key: 'status', label: 'Trạng thái', options: cashbackConfigStatusOptions },
    { key: 'distributionCycle', label: 'Chu kỳ phân phối', options: cashbackCycleOptions },
  ]

  const activeFilterChips: ActiveFilterChip[] = []
  if (query.status) {
    activeFilterChips.push({
      key: 'status',
      label: 'Trạng thái',
      valueLabel: optionLabel(cashbackConfigStatusOptions, query.status),
    })
  }
  if (query.distributionCycle) {
    activeFilterChips.push({
      key: 'distributionCycle',
      label: 'Chu kỳ',
      valueLabel: optionLabel(cashbackCycleOptions, query.distributionCycle),
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
        if (key === 'status') {
          onQueryChange({ ...query, page: 1, status: value as AdminCashbackConfigStatus })
          return
        }

        onQueryChange({ ...query, page: 1, distributionCycle: value as AdminCashbackDistributionCycle })
      }}
      onRemoveChip={(key) => onQueryChange({ ...query, page: 1, [key]: undefined })}
    />
  )
}
