'use client'

import { useMemo } from 'react'
import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import type { CashbackConfigData, GroupItem } from '@/types/api'
import {
  configStatusLabel,
  distributionCycleLabel,
  statusBadgeClass,
  toDateTime,
  type ConfigStatusFilter,
} from '../../constants'

type ConfigsTableProps = {
  configs: CashbackConfigData[]
  groups: GroupItem[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  isFetching: boolean
  statusFilter: ConfigStatusFilter
  isUpdating: boolean
  onStatusFilterChange: (value: ConfigStatusFilter) => void
  onPageChange: (nextPage: number) => void
  onToggleConfigStatus: (config: CashbackConfigData) => void
}

export function ConfigsTable({
  configs,
  groups,
  page,
  limit,
  totalItems,
  totalPages,
  isFetching,
  statusFilter,
  isUpdating,
  onStatusFilterChange,
  onPageChange,
  onToggleConfigStatus,
}: ConfigsTableProps) {
  const startIndex = totalItems === 0 ? 0 : (page - 1) * limit + 1
  const endIndex = Math.min(page * limit, totalItems)

  const selectFilters: SelectFilterConfig[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Trạng thái',
        options: [
          { value: 'active', label: configStatusLabel.active },
          { value: 'inactive', label: configStatusLabel.inactive },
        ],
      },
    ],
    [],
  )

  const activeFilterChips: ActiveFilterChip[] =
    statusFilter !== 'all'
      ? [{ key: 'status', label: 'Trạng thái', valueLabel: configStatusLabel[statusFilter] }]
      : []

  const columns = useMemo<DataTableColumn<CashbackConfigData>[]>(
    () => [
      {
        id: 'group',
        header: 'Group',
        cell: (config) => groups.find((group) => group.id === config.telegramGroupId)?.title || config.telegramGroupId,
      },
      {
        id: 'rate',
        header: 'Rate',
        cell: (config) => `${config.cashbackRatePct}%`,
      },
      {
        id: 'cycle',
        header: 'Cycle',
        cell: (config) => distributionCycleLabel[config.distributionCycle],
      },
      {
        id: 'status',
        header: 'Status',
        cell: (config) => (
          <Badge variant="outline" className={statusBadgeClass(config.status)}>
            {configStatusLabel[config.status]}
          </Badge>
        ),
      },
      {
        id: 'effective',
        header: 'Effective',
        cell: (config) => toDateTime(config.effectiveFrom),
      },
      {
        id: 'action',
        header: 'Action',
        headerClassName: 'text-right',
        cellClassName: 'text-right',
        cell: (config) => (
          <Button variant="outline" size="sm" disabled={isUpdating} onClick={() => onToggleConfigStatus(config)}>
            {config.status === 'active' ? 'Tắt' : 'Bật'}
          </Button>
        ),
      },
    ],
    [groups, isUpdating, onToggleConfigStatus],
  )

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] overflow-visible relative">
      <TableFilterBar
        textFilters={[]}
        textValues={{}}
        selectFilters={selectFilters}
        activeFilterChips={activeFilterChips}
        disabled={isFetching || isUpdating}
        onTextChange={() => undefined}
        onSelectFilter={(_, value) => onStatusFilterChange(value as ConfigStatusFilter)}
        onRemoveChip={() => onStatusFilterChange('all')}
      />

      <div className="rounded-b-[14px] overflow-hidden">
        <DataTable
          columns={columns}
          data={configs}
          rowKey={(config) => config.id}
          isLoading={isFetching}
          emptyContent="Chưa có cashback config."
          className="border-none rounded-none"
          pagination={{
            page,
            limit,
            totalItems,
            totalPages: Math.max(1, totalPages),
            isDisabled: isFetching,
            onPageChange,
            summaryText:
              totalItems > 0
                ? `Hiển thị ${startIndex} - ${endIndex} của ${totalItems} config`
                : 'Chưa có cashback config.',
          }}
        />
      </div>
    </div>
  )
}
