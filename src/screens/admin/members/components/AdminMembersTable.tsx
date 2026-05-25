'use client'

import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn, type DataTablePagination } from '@/components/ui/dataTable'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { AdminMemberItem } from '@/types/admin/members'
import {
  formatDateTime,
  formatLpexStatus,
  formatTelegramStatus,
  formatUsd,
  fullName,
  initials,
  statusClassName,
} from '../mappers'
import { AdminMemberDetailDialog } from './AdminMemberDetailDialog'
import { AdminMemberMetricsDialog } from './AdminMemberMetricsDialog'

type AdminMembersTableProps = {
  members: AdminMemberItem[]
  isFetching: boolean
  emptyContent: string
  pagination: DataTablePagination
}

export function AdminMembersTable({ members, isFetching, emptyContent, pagination }: AdminMembersTableProps) {
  const router = useRouter()

  const columns: DataTableColumn<AdminMemberItem>[] = [
    {
      id: 'member',
      header: 'Thành viên',
      cell: (member) => {
        const name = fullName(member.telegramFirstName, member.telegramLastName, member.telegramUsername)
        return (
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#E8B84D] to-[#A86B3F] text-xs font-semibold text-foreground">
              {initials(name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium">{name}</p>
              <p className="truncate font-geist-mono text-[11px] text-muted-foreground">
                @{member.telegramUsername || '---'} · {member.telegramUserId}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      id: 'lpexUid',
      header: 'LPEX UID',
      cellClassName: 'font-geist-mono',
      cell: (member) => member.lpexUid,
    },
    {
      id: 'kol',
      header: 'Referrer KOL',
      cell: (member) => (
        <div className="space-y-1 max-w-[220px]">
          <p className="truncate">{member.referrerKol?.displayName ?? member.referrerKolCode ?? '---'}</p>
          <p className="truncate text-xs text-muted-foreground">{member.referrerKol?.code ?? member.referrerKolCode ?? '---'}</p>
        </div>
      ),
    },
    {
      id: 'volume',
      header: 'Volume',
      cellClassName: 'font-geist-mono font-medium',
      cell: (member) => formatUsd(member.usdVolume),
    },
    {
      id: 'lpexStatus',
      header: 'LPEX',
      cell: (member) => (
        <span className={`inline-flex items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${statusClassName(member.lpexUserStatus)}`}>
          {formatLpexStatus(member.lpexUserStatus)}
        </span>
      ),
    },
    {
      id: 'telegramStatus',
      header: 'Telegram',
      cell: (member) => (
        <span className={`inline-flex items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${statusClassName(member.telegramStatus)}`}>
          {formatTelegramStatus(member.telegramStatus)}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Ngày tạo',
      cell: (member) => formatDateTime(member.createdAt),
    },
    {
      id: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (member) => (
        <div className="flex justify-end gap-1">
          <AdminMemberDetailDialog member={member} />
          <AdminMemberMetricsDialog member={member} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push(`/admin/members/${member.id}/groups`)}
              >
                <Users className="h-4 w-4" />
                <span className="sr-only">Xem nhóm của thành viên</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xem nhóm</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={members}
      rowKey={(member) => member.id}
      isLoading={isFetching}
      emptyContent={emptyContent}
      className="border-none rounded-none"
      pagination={pagination}
    />
  )
}
