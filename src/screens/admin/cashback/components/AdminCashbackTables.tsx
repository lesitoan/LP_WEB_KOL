'use client'

import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn, type DataTablePagination } from '@/components/ui/dataTable'
import type { AdminCashbackConfig, AdminCashbackCycle, AdminCashbackPayout } from '@/types/admin/cashback'
import { AdminCashbackDetailDialog } from './AdminCashbackDetailDialog'
import {
  formatConfigStatus,
  formatCycleStatus,
  formatDate,
  formatDateTime,
  formatDistributionCycle,
  formatPayoutStatus,
  formatPercent,
  formatUsd,
  memberName,
  statusClassName,
} from '../mappers'

type TableProps<TItem> = {
  items: TItem[]
  isFetching: boolean
  emptyContent: string
  pagination: DataTablePagination
}

export function AdminCashbackConfigsTable({ items, isFetching, emptyContent, pagination }: TableProps<AdminCashbackConfig>) {
  const columns: DataTableColumn<AdminCashbackConfig>[] = [
    {
      id: 'kol',
      header: 'KOL',
      cell: (config) => (
        <div className="max-w-[220px] space-y-1">
          <p className="truncate font-medium">{config.kol?.displayName ?? config.kolId}</p>
          <p className="truncate font-geist-mono text-[11px] text-muted-foreground">{config.kol?.code ?? config.kolId}</p>
        </div>
      ),
    },
    {
      id: 'group',
      header: 'Nhóm Telegram',
      cell: (config) => (
        <div className="max-w-[240px] space-y-1">
          <p className="truncate">{config.telegramGroup?.title ?? config.telegramGroupId}</p>
          <p className="truncate font-geist-mono text-[11px] text-muted-foreground">{config.telegramGroup?.telegramGroupId ?? '---'}</p>
        </div>
      ),
    },
    { id: 'rate', header: 'Tỷ lệ', cellClassName: 'font-geist-mono font-medium', cell: (config) => formatPercent(config.cashbackRatePct) },
    { id: 'cycle', header: 'Chu kỳ', cell: (config) => formatDistributionCycle(config.distributionCycle) },
    { id: 'minPayout', header: 'Ngưỡng trả', cellClassName: 'font-geist-mono', cell: (config) => formatUsd(config.minPayoutUsd) },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (config) => (
        <Badge variant="outline" className={statusClassName(config.status)}>
          {formatConfigStatus(config.status)}
        </Badge>
      ),
    },
    { id: 'effective', header: 'Hiệu lực', cell: (config) => `${formatDate(config.effectiveFrom)} - ${formatDate(config.effectiveTo)}` },
    {
      id: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (config) => <AdminCashbackDetailDialog kind="config" item={config} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey={(config) => config.id}
      isLoading={isFetching}
      emptyContent={emptyContent}
      className="border-none rounded-none"
      pagination={pagination}
    />
  )
}

export function AdminCashbackCyclesTable({ items, isFetching, emptyContent, pagination }: TableProps<AdminCashbackCycle>) {
  const columns: DataTableColumn<AdminCashbackCycle>[] = [
    {
      id: 'kol',
      header: 'KOL',
      cell: (cycle) => (
        <div className="max-w-[220px] space-y-1">
          <p className="truncate font-medium">{cycle.kol?.displayName ?? cycle.kolId}</p>
          <p className="truncate font-geist-mono text-[11px] text-muted-foreground">{cycle.kol?.code ?? cycle.kolId}</p>
        </div>
      ),
    },
    { id: 'type', header: 'Loại chu kỳ', cell: (cycle) => formatDistributionCycle(cycle.cycleType) },
    {
      id: 'period',
      header: 'Kỳ',
      cell: (cycle) => (
        <div className="space-y-1 font-geist-mono text-[12px]">
          <p>{formatDate(cycle.periodStart)}</p>
          <p className="text-muted-foreground">{formatDate(cycle.periodEnd)}</p>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (cycle) => (
        <Badge variant="outline" className={statusClassName(cycle.status)}>
          {formatCycleStatus(cycle.status)}
        </Badge>
      ),
    },
    { id: 'commission', header: 'Hoa hồng', cellClassName: 'font-geist-mono', cell: (cycle) => formatUsd(cycle.totalCommissionUsd) },
    { id: 'cashback', header: 'Cashback', cellClassName: 'font-geist-mono font-medium', cell: (cycle) => formatUsd(cycle.totalCashbackUsd) },
    { id: 'payouts', header: 'Khoản chi', cellClassName: 'font-geist-mono', cell: (cycle) => cycle._count?.payouts ?? '---' },
    {
      id: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (cycle) => <AdminCashbackDetailDialog kind="cycle" item={cycle} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey={(cycle) => cycle.id}
      isLoading={isFetching}
      emptyContent={emptyContent}
      className="border-none rounded-none"
      pagination={pagination}
    />
  )
}

export function AdminCashbackPayoutsTable({ items, isFetching, emptyContent, pagination }: TableProps<AdminCashbackPayout>) {
  const columns: DataTableColumn<AdminCashbackPayout>[] = [
    {
      id: 'member',
      header: 'Thành viên',
      cell: (payout) => (
        <div className="max-w-[220px] space-y-1">
          <p className="truncate font-medium">{memberName(payout.member)}</p>
          <p className="truncate font-geist-mono text-[11px] text-muted-foreground">{payout.member?.lpexUid ?? payout.memberId}</p>
        </div>
      ),
    },
    {
      id: 'kol',
      header: 'KOL',
      cell: (payout) => (
        <div className="max-w-[200px] space-y-1">
          <p className="truncate">{payout.kol?.displayName ?? payout.kolId}</p>
          <p className="truncate font-geist-mono text-[11px] text-muted-foreground">{payout.kol?.code ?? payout.kolId}</p>
        </div>
      ),
    },
    { id: 'group', header: 'Nhóm', cell: (payout) => payout.telegramGroup?.title ?? payout.telegramGroupId },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (payout) => (
        <Badge variant="outline" className={statusClassName(payout.payoutStatus)}>
          {formatPayoutStatus(payout.payoutStatus)}
        </Badge>
      ),
    },
    { id: 'volume', header: 'Khối lượng', cellClassName: 'font-geist-mono', cell: (payout) => formatUsd(payout.volumeUsd) },
    { id: 'commission', header: 'Hoa hồng', cellClassName: 'font-geist-mono', cell: (payout) => formatUsd(payout.kolCommissionUsd) },
    { id: 'cashback', header: 'Cashback', cellClassName: 'font-geist-mono font-medium', cell: (payout) => formatUsd(payout.cashbackAmountUsd) },
    { id: 'updatedAt', header: 'Cập nhật', cell: (payout) => formatDateTime(payout.updatedAt) },
    {
      id: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (payout) => <AdminCashbackDetailDialog kind="payout" item={payout} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey={(payout) => payout.id}
      isLoading={isFetching}
      emptyContent={emptyContent}
      className="border-none rounded-none"
      pagination={pagination}
    />
  )
}
