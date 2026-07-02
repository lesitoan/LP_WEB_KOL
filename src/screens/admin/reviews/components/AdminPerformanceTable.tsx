import React from 'react'
import Image from 'next/image'
import { AdminPerformanceTableSkeleton } from '@/components/skeletons/admin/reviews/AdminPerformanceTableSkeleton'
import { DataTable, type DataTableColumn, type DataTablePagination } from '@/components/ui/dataTable'
import type { AdminPerformanceRow } from '../constants'

interface AdminPerformanceTableProps {
  rows: AdminPerformanceRow[]
  pagination: DataTablePagination
  isLoading: boolean
}

function formatHours(activeHours: number | null) {
  return activeHours === null ? '-' : `${activeHours.toFixed(1)} giờ`
}

export default function AdminPerformanceTable({
  rows,
  pagination,
  isLoading,
}: AdminPerformanceTableProps) {
  const columns: DataTableColumn<AdminPerformanceRow>[] = [
    {
      id: 'name',
      header: 'Admin',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!text-base !font-normal !text-white',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#9B692C] flex items-center justify-center overflow-hidden relative">
            <Image
              src="/images/avatar_default.png"
              alt={row.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-base font-normal text-white">{row.name}</span>
        </div>
      ),
    },
    {
      id: 'reviewedCount',
      header: 'Đã duyệt',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!text-base !font-normal !text-white',
      cell: (row) => <span className="text-base text-white">{row.reviewedCount}</span>,
    },
    {
      id: 'avgResponseTime',
      header: 'Thời gian phản hồi trung bình',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!text-base !font-normal !text-white',
      cell: (row) => (
        <span className={`text-base ${
          row.avgResponseTime >= 10 ? 'text-[#F79009] font-semibold' : 'text-white font-normal'
        }`}>
          {row.avgResponseTime}′
        </span>
      ),
    },
    {
      id: 'editRate',
      header: '% chỉnh sửa',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!text-base !font-normal !text-white',
      cell: (row) => <span className="text-base text-white">{row.editRate}%</span>,
    },
    {
      id: 'recallRate',
      header: '% thu hồi sau đăng',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!text-base !font-normal !text-white',
      cell: (row) => (
        <span className={`text-base font-semibold ${
          row.recallRate >= 5 ? 'text-[#F79009]' : 'text-[#12B76A]'
        }`}>
          {row.recallRate}%
        </span>
      ),
    },
    {
      id: 'activeHours',
      header: 'Giờ trực',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!text-base !font-normal !text-white',
      cell: (row) => <span className="text-base text-white font-normal">{formatHours(row.activeHours)}</span>,
    },
  ]

  if (isLoading) {
    return <AdminPerformanceTableSkeleton />
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Hiệu suất theo từng admin</h4>
      </div>

      <div className="flex-1 min-w-0">
        <DataTable
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          pagination={pagination}
          emptyContent="Không có dữ liệu"
          className="bg-transparent border-none p-0"
        />
      </div>
    </div>
  )
}
