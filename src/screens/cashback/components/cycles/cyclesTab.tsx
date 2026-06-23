'use client'

import { useEffect, useMemo } from 'react'
import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useListCashbackCyclesQuery } from '@/services/api/cashbackApi'
import type { CashbackCycleData, CashbackCycleStatus, DistributionCycle } from '@/types/api'
import { useCashbackCyclesFiltersState } from '../../hooks/useCashbackCyclesFiltersState'
import {
  cycleStatusLabel,
  cycleStatusOptions,
  cycleTypeLabel,
  statusBadgeClass,
  toCurrency,
  toDateTime,
  type CycleStatusFilter,
} from '../../constants'

export function CyclesTab() {
  const { state, setQuery } = useCashbackCyclesFiltersState()
  const cycleTypeFilter = state.query.cycleType ?? 'all'
  const cycleStatusFilter = state.query.status ?? 'all'

  const queryArg = useMemo(
    () => ({
      page: state.query.page,
      limit: state.query.limit,
      cycleType: state.query.cycleType,
      status: state.query.status,
    }),
    [state.query.cycleType, state.query.limit, state.query.page, state.query.status],
  )

  const { data, isFetching, error } = useListCashbackCyclesQuery(queryArg)
  const cycles = data?.items ?? []
  const pagination = data?.pagination
  const page = state.query.page
  const limit = state.query.limit
  const totalItems = pagination?.totalItems ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const startIndex = totalItems === 0 ? 0 : (page - 1) * limit + 1
  const endIndex = Math.min(page * limit, totalItems)

  const selectFilters: SelectFilterConfig[] = useMemo(
    () => [
      {
        key: 'cycleType',
        label: 'Loại chu kỳ',
        options: [
          { value: 'weekly', label: cycleTypeLabel.weekly },
          { value: 'monthly', label: cycleTypeLabel.monthly },
        ],
      },
      {
        key: 'status',
        label: 'Trạng thái',
        options: cycleStatusOptions.filter((status) => status !== 'all').map((status) => ({
          value: status,
          label: cycleStatusLabel[status],
        })),
      },
    ],
    [],
  )

  const activeFilterChips: ActiveFilterChip[] = useMemo(() => {
    const chips: ActiveFilterChip[] = []

    if (cycleTypeFilter !== 'all') {
      chips.push({ key: 'cycleType', label: 'Loại chu kỳ', valueLabel: cycleTypeLabel[cycleTypeFilter] })
    }

    if (cycleStatusFilter !== 'all') {
      chips.push({ key: 'status', label: 'Trạng thái', valueLabel: cycleStatusLabel[cycleStatusFilter] })
    }

    return chips
  }, [cycleStatusFilter, cycleTypeFilter])

  const columns = useMemo<DataTableColumn<CashbackCycleData>[]>(
    () => [
      {
        id: 'period',
        header: 'Period',
        cell: (cycle) => `${toDateTime(cycle.periodStart)} - ${toDateTime(cycle.periodEnd)}`,
      },
      {
        id: 'type',
        header: 'Loại cycle',
        cell: (cycle) => (cycle.cycleType === 'weekly' ? cycleTypeLabel.weekly : cycleTypeLabel.monthly),
      },
      {
        id: 'status',
        header: 'Status',
        cell: (cycle) => (
          <Badge variant="outline" className={statusBadgeClass(cycle.status)}>
            {cycleStatusLabel[cycle.status]}
          </Badge>
        ),
      },
      {
        id: 'commission',
        header: 'Commission',
        cell: (cycle) => toCurrency(cycle.totalCommissionUsd),
      },
      {
        id: 'cashback',
        header: 'Cashback',
        cell: (cycle) => toCurrency(cycle.totalCashbackUsd),
      },
      {
        id: 'payouts',
        header: 'Payouts',
        cell: (cycle) => cycle._count?.payouts ?? '-',
      },
    ],
    [],
  )

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách cycle',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra'),
      })
    }
  }, [error])

  return (
    <div className="bg-surface-1 border border-border rounded-card overflow-visible relative">
      <TableFilterBar
        textFilters={[]}
        textValues={{}}
        selectFilters={selectFilters}
        activeFilterChips={activeFilterChips}
        disabled={isFetching}
        onTextChange={() => undefined}
        onSelectFilter={(key, value) => {
          if (key === 'cycleType') {
            setQuery({
              ...state.query,
              cycleType: value as DistributionCycle,
              page: 1,
            })
            return
          }

          setQuery({
            ...state.query,
            status: value as CashbackCycleStatus,
            page: 1,
          })
        }}
        onRemoveChip={(key) => {
          if (key === 'cycleType') {
            setQuery({ ...state.query, cycleType: undefined, page: 1 })
            return
          }

          setQuery({ ...state.query, status: undefined, page: 1 })
        }}
      />

      <div className="rounded-b-card overflow-hidden">
        <DataTable
          columns={columns}
          data={cycles}
          rowKey={(cycle) => cycle.id}
          isLoading={isFetching}
          emptyContent="Chưa có cashback cycle."
          className="border-none rounded-none"
          pagination={{
            page,
            limit,
            totalItems,
            totalPages: Math.max(1, totalPages),
            isDisabled: isFetching,
            onPageChange: (nextPage) => setQuery({ ...state.query, page: nextPage }),
            summaryText:
              totalItems > 0
                ? `Hiển thị ${startIndex} - ${endIndex} của ${totalItems} cycle`
                : 'Chưa có cashback cycle.',
          }}
        />
      </div>
    </div>
  )
}
