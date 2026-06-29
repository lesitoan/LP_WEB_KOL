"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { adminUsersData, ROLE_STYLES, type AdminUserRow } from '../constants'

interface RoleBadgeProps { role: AdminUserRow['role'] }
function RoleBadge({ role }: RoleBadgeProps) {
  const s = ROLE_STYLES[role]
  return (
    <span
      className="inline-flex items-center gap-1 px-[6px] py-[2px] rounded-full text-xs font-normal leading-[18px]"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: s.dot }} />
      {role}
    </span>
  )
}

function StatusBadge({ status }: { status: AdminUserRow['status'] }) {
  const isActive = status === 'active'
  return (
    <span
      className="inline-flex items-center gap-1 px-[6px] py-[2px] rounded-full text-xs font-normal leading-[18px]"
      style={{ background: '#06301C', color: '#41C588' }}
    >
      <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: isActive ? '#41C588' : '#828283' }} />
      {isActive ? 'Hoạt động' : 'Không hoạt động'}
    </span>
  )
}

interface UsersTableProps {
  onEdit: (user: AdminUserRow) => void
}

export default function UsersTable({ onEdit }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const columns: DataTableColumn<AdminUserRow>[] = [
    {
      id: 'name',
      header: 'Admin duyệt',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cellClassName: '!py-4',
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
      id: 'email',
      header: 'Email',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cell: (row) => <span className="text-base font-normal text-white">{row.email}</span>,
    },
    {
      id: 'role',
      header: 'Vai trò',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cell: (row) => <RoleBadge role={row.role} />,
    },
    {
      id: 'status',
      header: 'Trạng thái',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9]',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'actions',
      header: 'Thao tác',
      headerClassName: '!text-xs !font-normal !text-[#A8A8A9] !text-right',
      cellClassName: '!text-right justify-self-end',
      cell: (row) => (
        <button
          type="button"
          onClick={() => onEdit(row)}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[#545454] text-sm font-semibold text-white hover:bg-[#282828] transition-colors"
        >
          <Image src="/images/admin/users/edit-user-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
          Sửa quyền
        </button>
      ),
    },
  ]

  const pagination = {
    page: currentPage,
    totalPages: 13,
    totalItems: 742,
    limit: 8,
    onPageChange: setCurrentPage,
    summaryText: `Hiển thị ${(currentPage - 1) * 8 + 1}-${Math.min(currentPage * 8, 742)} / 742`,
  }

  return (
    <div className="bg-[#171717] rounded-2xl p-4 md:p-6 flex flex-col gap-4">
      <h2 className="text-[18px] font-medium text-white leading-[30px]">Danh sách người dùng</h2>
      <DataTable
        columns={columns}
        data={adminUsersData}
        rowKey={(row) => row.id}
        pagination={pagination}
        className="bg-transparent border-none p-0"
      />
    </div>
  )
}
