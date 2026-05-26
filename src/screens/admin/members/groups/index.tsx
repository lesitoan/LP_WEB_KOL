'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { useGetAdminMemberGroupsQuery } from '@/services/api/admin/membersApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import type { AdminMemberHistoricalCashbackGroup, AdminMemberTelegramGroup } from '@/types/admin/members'
import { formatDateTime, formatUsd, fullName } from '../mappers'

export default function AdminMemberGroupsScreen() {
  const params = useParams<{ memberId: string }>()
  const router = useRouter()
  const memberId = params.memberId
  const { data, isFetching, error, refetch } = useGetAdminMemberGroupsQuery({ memberId }, { skip: !memberId })

  const member = data?.member
  const name = member ? fullName(member.telegramFirstName, member.telegramLastName, member.telegramUsername) : 'Thành viên'

  const currentGroupColumns: DataTableColumn<AdminMemberTelegramGroup>[] = [
    {
      id: 'title',
      header: 'Nhóm',
      cell: (group) => (
        <div className="space-y-1 max-w-[280px]">
          <p className="font-medium truncate">{group.title}</p>
          <p className="text-xs text-muted-foreground truncate">{group.telegramGroupId || group.id}</p>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (group) => group.status || '---',
    },
    {
      id: 'range',
      header: 'Volume range',
      cellClassName: 'font-geist-mono',
      cell: (group) => `${formatUsd(group.minVolumeRequired)} - ${formatUsd(group.maxVolumeRequired)}`,
    },
    {
      id: 'tier',
      header: 'Tier',
      cell: (group) => group.tierLabel || '---',
    },
    {
      id: 'benefits',
      header: 'Benefits',
      cell: (group) => group.benefits?.length ?? 0,
    },
    {
      id: 'createdAt',
      header: 'Ngày tạo',
      cell: (group) => formatDateTime(group.createdAt),
    },
  ]

  const historicalColumns: DataTableColumn<AdminMemberHistoricalCashbackGroup>[] = [
    {
      id: 'group',
      header: 'Nhóm',
      cell: (item) => (
        <div className="space-y-1 max-w-[280px]">
          <p className="font-medium truncate">{item.group?.title ?? 'Nhóm không còn tồn tại'}</p>
          <p className="text-xs text-muted-foreground truncate">{item.group?.telegramGroupId || item.group?.id || '---'}</p>
        </div>
      ),
    },
    {
      id: 'payoutCount',
      header: 'Payouts',
      cellClassName: 'font-geist-mono',
      cell: (item) => item.payoutCount,
    },
    {
      id: 'cashback',
      header: 'Cashback',
      cellClassName: 'font-geist-mono',
      cell: (item) => formatUsd(item.totalCashbackAmountUsd),
    },
    {
      id: 'volume',
      header: 'Volume',
      cellClassName: 'font-geist-mono',
      cell: (item) => formatUsd(item.totalVolumeUsd),
    },
    {
      id: 'lastPayoutAt',
      header: 'Payout gần nhất',
      cell: (item) => formatDateTime(item.lastPayoutAt),
    },
  ]

  const errorMessage = error ? extractApiErrorMessage(error, 'Không thể tải danh sách nhóm của thành viên') : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <section className="space-y-1">
          <Button type="button" variant="ghost" size="sm" className="-ml-2" onClick={() => router.push('/admin/members')}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại members
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Nhóm của thành viên</h1>
          <p className="text-sm text-muted-foreground">
            {name}
            {member?.lpexUid ? ` · LPEX UID ${member.lpexUid}` : ''}
          </p>
        </section>

        {/* <Button type="button" variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button> */}
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/[0.08] p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Nhóm đủ điều kiện hiện tại</CardTitle>
        </CardHeader>
        <DataTable
          columns={currentGroupColumns}
          data={data?.currentEligibleGroups ?? []}
          rowKey={(group) => group.id}
          isLoading={isFetching}
          emptyContent={errorMessage || 'Chưa có nhóm đủ điều kiện.'}
          className="border-none rounded-none"
        />
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lịch sử cashback theo nhóm</CardTitle>
        </CardHeader>
        <DataTable
          columns={historicalColumns}
          data={data?.historicalCashbackGroups ?? []}
          rowKey={(item, index) => `${item.group?.id ?? 'group'}-${index}`}
          isLoading={isFetching}
          emptyContent={errorMessage || 'Chưa có lịch sử cashback theo nhóm.'}
          className="border-none rounded-none"
        />
      </Card>
    </div>
  )
}
