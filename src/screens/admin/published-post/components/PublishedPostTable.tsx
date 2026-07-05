"use client";

import React from 'react'
import { Check, Flag } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { cn } from '@/lib/utils'
import type { PaginationMeta } from '@/types/api/adminInsight'
import { type PublishedPost } from '../constants'

interface PublishedPostTableProps {
  posts: PublishedPost[]
  onRowClick: (post: PublishedPost) => void
  onActionClick: (e: React.MouseEvent, id: string) => void
  getCategoryBadgeClass: (colorType: string) => string
  getCategoryDotClass: (colorType: string) => string
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export default function PublishedPostTable({
  posts,
  onRowClick,
  onActionClick,
  getCategoryBadgeClass,
  getCategoryDotClass,
  pagination,
  onPageChange,
  isLoading = false,
}: PublishedPostTableProps) {
  const columns: DataTableColumn<PublishedPost>[] = [
    {
      id: 'title',
      header: 'Tin',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9] w-[340px]',
      cellClassName: '!py-3 !whitespace-normal max-w-[340px]',
      cell: (row) => (
        <div onClick={() => onRowClick(row)} className="flex flex-col gap-1.5 cursor-pointer group">
          <span className="text-sm font-normal text-white group-hover:text-[#F7F0A1] transition-colors line-clamp-2 leading-relaxed">
            {row.title}
          </span>
          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal w-fit', getCategoryBadgeClass(row.categoryColor))}>
            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', getCategoryDotClass(row.categoryColor))} />
            {row.categoryLabel}
          </div>
        </div>
      ),
    },
    {
      id: 'publishTime',
      header: 'Giờ đăng',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!py-3 text-sm font-normal text-white',
      cell: (row) => <span>{row.publishTime}</span>,
    },
    {
      id: 'tier',
      header: 'Tier nhận',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!py-3 text-sm font-normal text-white',
      cell: (row) => <span>{row.tier}</span>,
    },
    {
      id: 'status',
      header: 'Trạng thái',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!py-3',
      cell: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal bg-[#06301C] text-[#41C588]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#41C588]" />
          {row.status}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9] !text-right',
      cellClassName: '!py-3 !text-right justify-self-end',
      cell: (row) => (
        <div className="flex justify-end items-center">
          {row.actionType === 'sent' ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#F7F0A1] flex items-center justify-center text-black shrink-0">
                <Check className="h-3 w-3 stroke-[3.5]" />
              </div>
              <div className="flex flex-col text-left whitespace-nowrap">
                <span className="text-sm font-normal text-white leading-[20px] whitespace-nowrap">Đã gửi</span>
                <span className="text-xs font-normal text-[#A8A8A9] leading-[18px] whitespace-nowrap">
                  {row.actionStatusText}
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => onActionClick(e, row.id)}
              className="h-9 px-4 rounded-lg border border-[#545454] hover:border-white transition-colors inline-flex items-center justify-center gap-2 text-sm font-semibold text-white active:scale-95 duration-100 whitespace-nowrap"
            >
              <Flag className="h-4 w-4 text-white fill-white" />
              Yêu cầu xử lý
            </button>
          )}
        </div>
      ),
    },
  ]

  const tablePagination = {
    page: pagination.page,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    limit: pagination.limit,
    isDisabled: isLoading,
    onPageChange,
    summaryText: `Hiển thị ${
      pagination.totalItems === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
    }-${Math.min(pagination.page * pagination.limit, pagination.totalItems)} / ${pagination.totalItems}`,
  }

  return (
    <DataTable
      columns={columns}
      data={posts}
      rowKey={(row) => row.id}
      isLoading={isLoading}
      emptyContent="Không có tin đã đăng"
      pagination={tablePagination}
      className="bg-transparent border-none p-0"
    />
  )
}
