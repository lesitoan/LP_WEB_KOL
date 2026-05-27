'use client'

import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig, type TextFilterConfig } from '@/components/filters/TableFilterBar'
import type {
  AdminCashbackConfigStatus,
  AdminCashbackCycleStatus,
  AdminCashbackDistributionCycle,
  AdminCashbackPayoutStatus,
} from '@/types/admin/cashback'
import type { AdminCashbackQuery, AdminCashbackTab } from '../hooks/useAdminCashbackFiltersState'
import {
  cashbackConfigStatusOptions,
  cashbackCycleOptions,
  cashbackCycleStatusOptions,
  cashbackPayoutStatusOptions,
} from '../mappers'

type AdminCashbackFiltersProps = {
  tab: AdminCashbackTab
  query: AdminCashbackQuery
  isFetching: boolean
  onQueryChange: (query: AdminCashbackQuery) => void
}

const optionLabel = (options: Array<{ value: string; label: string }>, value?: string) =>
  options.find((option) => option.value === value)?.label ?? value ?? ''

function textFiltersByTab(tab: AdminCashbackTab): TextFilterConfig[] {
  if (tab === 'configs') {
    return [
      { key: 'kolId', placeholder: 'KOL ID', widthClassName: 'min-w-[220px] w-[260px]' },
      { key: 'telegramGroupId', placeholder: 'ID nhóm Telegram', widthClassName: 'min-w-[220px] w-[280px]' },
    ]
  }

  if (tab === 'cycles') {
    return [
      { key: 'kolId', placeholder: 'KOL ID', widthClassName: 'min-w-[220px] w-[260px]' },
      { key: 'periodStartFrom', placeholder: 'Từ ngày ISO', widthClassName: 'min-w-[180px] w-[210px]' },
      { key: 'periodEndTo', placeholder: 'Đến ngày ISO', widthClassName: 'min-w-[180px] w-[210px]' },
    ]
  }

  return [
    { key: 'kolId', placeholder: 'KOL ID', widthClassName: 'min-w-[220px] w-[260px]' },
    { key: 'memberId', placeholder: 'ID thành viên', widthClassName: 'min-w-[220px] w-[260px]' },
    { key: 'cycleId', placeholder: 'ID chu kỳ', widthClassName: 'min-w-[220px] w-[260px]' },
    { key: 'telegramGroupId', placeholder: 'ID nhóm Telegram', widthClassName: 'min-w-[220px] w-[280px]' },
  ]
}

function selectFiltersByTab(tab: AdminCashbackTab): SelectFilterConfig[] {
  if (tab === 'configs') {
    return [
      { key: 'status', label: 'Trạng thái', options: cashbackConfigStatusOptions },
      { key: 'distributionCycle', label: 'Chu kỳ phân phối', options: cashbackCycleOptions },
    ]
  }

  if (tab === 'cycles') {
    return [
      { key: 'cycleType', label: 'Loại chu kỳ', options: cashbackCycleOptions },
      { key: 'status', label: 'Trạng thái chu kỳ', options: cashbackCycleStatusOptions },
    ]
  }

  return [{ key: 'payoutStatus', label: 'Trạng thái chi trả', options: cashbackPayoutStatusOptions }]
}

function activeChipsByTab(tab: AdminCashbackTab, query: AdminCashbackQuery): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []

  if (query.kolId) chips.push({ key: 'kolId', label: 'KOL ID', valueLabel: query.kolId })
  if (query.telegramGroupId) chips.push({ key: 'telegramGroupId', label: 'ID nhóm', valueLabel: query.telegramGroupId })

  if (tab === 'configs') {
    if (query.status) {
      chips.push({ key: 'status', label: 'Trạng thái', valueLabel: optionLabel(cashbackConfigStatusOptions, query.status) })
    }
    if (query.distributionCycle) {
      chips.push({
        key: 'distributionCycle',
        label: 'Chu kỳ',
        valueLabel: optionLabel(cashbackCycleOptions, query.distributionCycle),
      })
    }
  }

  if (tab === 'cycles') {
    if (query.cycleType) chips.push({ key: 'cycleType', label: 'Loại chu kỳ', valueLabel: optionLabel(cashbackCycleOptions, query.cycleType) })
    if (query.status) {
      chips.push({ key: 'status', label: 'Trạng thái', valueLabel: optionLabel(cashbackCycleStatusOptions, query.status) })
    }
    if (query.periodStartFrom) chips.push({ key: 'periodStartFrom', label: 'Từ ngày', valueLabel: query.periodStartFrom })
    if (query.periodEndTo) chips.push({ key: 'periodEndTo', label: 'Đến ngày', valueLabel: query.periodEndTo })
  }

  if (tab === 'payouts') {
    if (query.memberId) chips.push({ key: 'memberId', label: 'ID thành viên', valueLabel: query.memberId })
    if (query.cycleId) chips.push({ key: 'cycleId', label: 'ID chu kỳ', valueLabel: query.cycleId })
    if (query.payoutStatus) {
      chips.push({
        key: 'payoutStatus',
        label: 'Trạng thái',
        valueLabel: optionLabel(cashbackPayoutStatusOptions, query.payoutStatus),
      })
    }
  }

  return chips
}

export function AdminCashbackFilters({ tab, query, isFetching, onQueryChange }: AdminCashbackFiltersProps) {
  return (
    <TableFilterBar
      textFilters={textFiltersByTab(tab)}
      textValues={{
        kolId: query.kolId ?? '',
        telegramGroupId: query.telegramGroupId ?? '',
        memberId: query.memberId ?? '',
        cycleId: query.cycleId ?? '',
        periodStartFrom: query.periodStartFrom ?? '',
        periodEndTo: query.periodEndTo ?? '',
      }}
      selectFilters={selectFiltersByTab(tab)}
      activeFilterChips={activeChipsByTab(tab, query)}
      disabled={isFetching}
      onTextChange={(key, value) => onQueryChange({ ...query, page: 1, [key]: value.trim() || undefined })}
      onSelectFilter={(key, value) => {
        if (key === 'status' && tab === 'configs') {
          onQueryChange({ ...query, page: 1, status: value as AdminCashbackConfigStatus })
          return
        }
        if (key === 'status' && tab === 'cycles') {
          onQueryChange({ ...query, page: 1, status: value as AdminCashbackCycleStatus })
          return
        }
        if (key === 'distributionCycle') {
          onQueryChange({ ...query, page: 1, distributionCycle: value as AdminCashbackDistributionCycle })
          return
        }
        if (key === 'cycleType') {
          onQueryChange({ ...query, page: 1, cycleType: value as AdminCashbackDistributionCycle })
          return
        }
        if (key === 'payoutStatus') {
          onQueryChange({ ...query, page: 1, payoutStatus: value as AdminCashbackPayoutStatus })
        }
      }}
      onRemoveChip={(key) => onQueryChange({ ...query, page: 1, [key]: undefined })}
    />
  )
}
