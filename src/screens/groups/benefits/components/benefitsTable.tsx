'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import type { GroupBenefit, UpdateGroupBenefitBody } from '@/types/api'
import { EditBenefitDialog } from './editBenefitDialog'

type BenefitsTableProps = {
  benefits: GroupBenefit[]
  isLoading?: boolean
  isFetching?: boolean
  onEdit: (benefitId: string, payload: UpdateGroupBenefitBody) => Promise<void>
  onDelete: (benefit: GroupBenefit) => Promise<void>
}

function formatDate(dateIso: string) {
  const date = new Date(dateIso)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleString('vi-VN')
}

export function BenefitsTable({ benefits, isLoading = false, isFetching = false, onEdit, onDelete }: BenefitsTableProps) {
  const columns: DataTableColumn<GroupBenefit>[] = [
    {
      id: 'benefitName',
      header: 'Tên benefit',
      cell: (benefit) => <span className="font-medium">{benefit.benefitName}</span>,
    },
    {
      id: 'benefitType',
      header: 'Loại',
      cell: (benefit) => benefit.benefitType,
    },
    {
      id: 'benefitValue',
      header: 'Giá trị',
      cell: (benefit) => benefit.benefitValue || '---',
    },
    {
      id: 'sortOrder',
      header: 'Sort order',
      cellClassName: 'font-geist-mono',
      cell: (benefit) => String(benefit.sortOrder),
    },
    {
      id: 'createdAt',
      header: 'Ngày tạo',
      cell: (benefit) => formatDate(benefit.createdAt),
    },
    {
      id: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (benefit) => (
        <div className="flex items-center justify-end gap-1">
          <EditBenefitDialog benefit={benefit} onSave={onEdit} />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(benefit)}
            disabled={isFetching}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa benefit</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={benefits}
      rowKey={(benefit) => benefit.id}
      isLoading={isLoading}
      loadingContent="Đang tải danh sách benefit..."
      emptyContent="Chưa có benefit nào cho group này"
      className="border-none rounded-none"
    />
  )
}
