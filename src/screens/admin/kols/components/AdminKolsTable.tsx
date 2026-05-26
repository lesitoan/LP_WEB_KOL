'use client'

import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn, type DataTablePagination } from '@/components/ui/dataTable'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { AdminKolItem, AdminKolStatusAction, UpdateAdminKolBody } from '@/types/admin/kols'
import { adminKolStatusLabel, kolStatusClassName, toDateTimeVi } from '../mappers'
import { AdminKolDetailDialog } from './AdminKolDetailDialog'
import { AdminKolFormDialog } from './AdminKolFormDialog'

type AdminKolsTableProps = {
  kols: AdminKolItem[]
  isFetching: boolean
  emptyContent: string
  pagination: DataTablePagination
  onUpdateKol: (kolId: string, payload: UpdateAdminKolBody, statusAction?: AdminKolStatusAction) => Promise<void>
  onDeleteKol: (kolId: string, label: string) => Promise<void>
}

export function AdminKolsTable({
  kols,
  isFetching,
  emptyContent,
  pagination,
  onUpdateKol,
  onDeleteKol,
}: AdminKolsTableProps) {
  const columns: DataTableColumn<AdminKolItem>[] = [
    {
      id: 'kol',
      header: 'KOL',
      cell: (kol) => (
        <div className="space-y-1 max-w-[240px]">
          <p className="font-medium truncate">{kol.displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{kol.code}</p>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Liên hệ',
      cell: (kol) => (
        <div className="space-y-1 max-w-[220px]">
          <p className="truncate">@{kol.telegramUsername}</p>
          <p className="text-xs text-muted-foreground truncate">{kol.zaloContact || '---'}</p>
        </div>
      ),
    },
    {
      id: 'ref',
      header: 'Ref code',
      cellClassName: 'font-geist-mono',
      cell: (kol) => kol.lpexRefCode,
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (kol) => (
        <span className={`inline-flex items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${kolStatusClassName(kol.status)}`}>
          {adminKolStatusLabel[kol.status]}
        </span>
      ),
    },
    {
      id: 'commission',
      header: 'Commission',
      cellClassName: 'font-geist-mono',
      cell: (kol) => `${kol.currentCommissionRate ?? 0}%`,
    },
    // {
    //   id: 'language',
    //   header: 'Ngôn ngữ',
    //   cell: (kol) => kol.defaultLanguage || '---',
    // },
    {
      id: 'updatedAt',
      header: 'Cập nhật',
      cell: (kol) => toDateTimeVi(kol.updatedAt),
    },
    {
      id: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (kol) => (
        <div className="flex items-center justify-end gap-1">
          <AdminKolDetailDialog kolId={kol.id} />
          <AdminKolFormDialog
            mode="edit"
            kol={kol}
            onSubmitPayload={(payload, meta) => onUpdateKol(kol.id, payload as UpdateAdminKolBody, meta?.statusAction)}
            trigger={
              <span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Cập nhật KOL</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cập nhật KOL</TooltipContent>
                </Tooltip>
              </span>
            }
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDeleteKol(kol.id, kol.displayName || kol.code)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Xóa KOL</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xóa KOL</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={kols}
      rowKey={(kol) => kol.id}
      isLoading={isFetching}
      emptyContent={emptyContent}
      className="border-none rounded-none"
      pagination={pagination}
    />
  )
}
