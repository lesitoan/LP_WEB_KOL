"use client"

import Image from 'next/image'
import { DataTable, type DataTableColumn, type DataTablePagination } from '@/components/ui/dataTable'
import {
  ROLE_STYLES,
  STATUS_STYLES,
  UI_STATUS_LABELS,
  type AdminUserRow,
} from '../constants'

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
  const s = STATUS_STYLES[status]
  return (
    <span
      className="inline-flex items-center gap-1 px-[6px] py-[2px] rounded-full text-xs font-normal leading-[18px]"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: s.dot }} />
      {UI_STATUS_LABELS[status]}
    </span>
  )
}

interface UsersTableProps {
  users: AdminUserRow[]
  pagination: DataTablePagination
  isLoading: boolean
  onEdit: (user: AdminUserRow) => void
}

export default function UsersTable({ users, pagination, isLoading, onEdit }: UsersTableProps) {
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

  return (
    <div className="bg-[#171717] rounded-2xl p-4 md:p-6 flex flex-col gap-4">
      <h2 className="text-[18px] font-medium text-white leading-[30px]">Danh sách người dùng</h2>
      <DataTable
        columns={columns}
        data={users}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        emptyContent="Chưa có dữ liệu"
        pagination={pagination}
        className="bg-transparent border-none p-0"
      />
    </div>
  )
}
