'use client'

import { useEffect, useMemo } from 'react'
import TableFilterBar, { type ActiveFilterChip, type SelectFilterConfig } from '@/components/filters/TableFilterBar'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useListCashbackPayoutsQuery } from '@/services/api/cashbackApi'
import type { CashbackPayoutData, CashbackPayoutStatus } from '@/types/api'
import { useCashbackPayoutsFiltersState } from '../../hooks/useCashbackPayoutsFiltersState'
import {
  payoutStatusLabel,
  payoutStatusOptions,
  statusBadgeClass,
  toCurrency,
  toDateTime,
  type PayoutStatusFilter,
} from '../../constants'

export function PayoutsTab() {
  const { state, setQuery } = useCashbackPayoutsFiltersState()
  const payoutStatusFilter = state.query.payoutStatus ?? 'all'

  const queryArg = useMemo(
    () => ({
      page: state.query.page,
      limit: state.query.limit,
      payoutStatus: state.query.payoutStatus,
    }),
    [state.query.limit, state.query.page, state.query.payoutStatus],
  )

  const { data, isFetching, error } = useListCashbackPayoutsQuery(queryArg)
  const payouts = data?.items ?? []
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
        key: 'payoutStatus',
        label: 'Trạng thái thanh toán',
        options: payoutStatusOptions.filter((status) => status !== 'all').map((status) => ({
          value: status,
          label: payoutStatusLabel[status],
        })),
      },
    ],
    [],
  )

  const activeFilterChips: ActiveFilterChip[] =
    payoutStatusFilter !== 'all'
      ? [{ key: 'payoutStatus', label: 'Trạng thái', valueLabel: payoutStatusLabel[payoutStatusFilter] }]
      : []

  const columns = useMemo<DataTableColumn<CashbackPayoutData>[]>(
    () => [
      {
        id: 'member',
        header: 'Member',
        cell: (payout) => payout.member?.telegramUsername || payout.memberId,
      },
      {
        id: 'group',
        header: 'Group',
        cell: (payout) => payout.telegramGroup?.title || payout.telegramGroupId,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (payout) => (
          <Badge variant="outline" className={statusBadgeClass(payout.payoutStatus)}>
            {payoutStatusLabel[payout.payoutStatus]}
          </Badge>
        ),
      },
      {
        id: 'commission',
        header: 'Commission',
        cell: (payout) => toCurrency(payout.kolCommissionUsd),
      },
      {
        id: 'cashback',
        header: 'Cashback',
        cell: (payout) => toCurrency(payout.cashbackAmountUsd),
      },
      {
        id: 'updated',
        header: 'Updated',
        cell: (payout) => toDateTime(payout.updatedAt),
      },
    ],
    [],
  )

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách payout',
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
        onSelectFilter={(_, value) => {
          setQuery({
            ...state.query,
            payoutStatus: value as CashbackPayoutStatus,
            page: 1,
          })
        }}
        onRemoveChip={() => {
          setQuery({
            ...state.query,
            payoutStatus: undefined,
            page: 1,
          })
        }}
      />

      <div className="rounded-b-card overflow-hidden">
        <DataTable
          columns={columns}
          data={payouts}
          rowKey={(payout) => payout.id}
          isLoading={isFetching}
          emptyContent="Chưa có payout records."
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
                ? `Hiển thị ${startIndex} - ${endIndex} của ${totalItems} payout`
                : 'Chưa có payout records.',
          }}
        />
      </div>
    </div>
  )
}
