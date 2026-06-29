"use client"

import React, { useState } from 'react'
import UsersTable from './components/UsersTable'
import CreateUserModal from './components/CreateUserModal'
import type { AdminUserRow } from './constants'

export default function AdminUsersScreen() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<AdminUserRow | null>(null)

  function openCreate() {
    setEditUser(null)
    setModalOpen(true)
  }

  function openEdit(user: AdminUserRow) {
    setEditUser(user)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditUser(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium text-white leading-[31.2px]">Quản lý người dùng</h1>
          <p className="text-sm font-normal text-[#828283] leading-[21px] mt-1">Phân quyền admin theo vai trò</p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="self-end inline-flex items-center gap-2 h-9 px-4 bg-[#F7F0A1] rounded-lg text-sm font-semibold text-black hover:bg-[#e8e09c] transition-colors shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4v12M4 10h12" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Tạo tài khoản admin
        </button>
      </div>

      {/* Users Table */}
      <UsersTable onEdit={openEdit} />

      {/* Modal */}
      {modalOpen && (
        <CreateUserModal
          onClose={closeModal}
          editUser={editUser}
        />
      )}
    </div>
  )
}
