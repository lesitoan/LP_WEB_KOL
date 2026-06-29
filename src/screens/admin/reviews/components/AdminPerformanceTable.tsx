import React, { useState } from 'react'
import Image from 'next/image'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { adminPerformanceData, type AdminPerformanceRow } from '../constants'

export default function AdminPerformanceTable() {
  const [currentPage, setCurrentPage] = useState(1)

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
      cell: (row) => <span className="text-base text-white font-normal">{row.activeHours.toFixed(1)} giờ</span>,
    },
  ]

  const pagination = {
    page: currentPage,
    totalPages: 13,
    totalItems: 742,
    limit: 8,
    onPageChange: (page: number) => setCurrentPage(page),
    summaryText: `Hiển thị ${(currentPage - 1) * 8 + 1}-${Math.min(currentPage * 8, 742)} / 742`,
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-1">
        <h4 className="text-sm md:text-base font-semibold text-white">Hiệu suất theo từng admin</h4>
      </div>

      <div className="flex-1 min-w-0">
        <DataTable
          columns={columns}
          data={adminPerformanceData}
          rowKey={(row) => row.name}
          pagination={pagination}
          className="bg-transparent border-none p-0"
        />
      </div>
    </div>
  )
}
