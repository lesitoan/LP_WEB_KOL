"use client"

import { useState } from 'react'
import UsersHeader from './components/UsersHeader'
import UsersTable from './components/UsersTable'
import CreateUserModal from './components/CreateUserModal'
import TemporaryPasswordModal from './components/TemporaryPasswordModal'
import { useAdminUsersActions, type TemporaryPasswordInfo } from './hooks/useAdminUsersActions'
import { useAdminUsersData } from './hooks/useAdminUsersData'
import type { AdminUserRow } from './constants'

export default function AdminUsersScreen() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<AdminUserRow | null>(null)
  const [temporaryPasswordInfo, setTemporaryPasswordInfo] = useState<TemporaryPasswordInfo | null>(null)
  const data = useAdminUsersData()

  const closeModal = () => {
    setModalOpen(false)
    setEditUser(null)
  }

  const actions = useAdminUsersActions({
    onCreatedPassword: setTemporaryPasswordInfo,
    onCloseModal: closeModal,
    refetchUsers: data.listQuery.refetch,
  })

  const openCreate = () => {
    setEditUser(null)
    setModalOpen(true)
  }

  const openEdit = (user: AdminUserRow) => {
    setEditUser(user)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <UsersHeader onCreateClick={openCreate} />

      <UsersTable
        users={data.users}
        pagination={data.pagination}
        isLoading={data.isLoading}
        onEdit={openEdit}
      />

      {modalOpen && (
        <CreateUserModal
          onClose={closeModal}
          onSubmit={actions.handleSubmitUser}
          editUser={editUser}
          isSaving={actions.isSaving}
        />
      )}

      {temporaryPasswordInfo ? (
        <TemporaryPasswordModal
          info={temporaryPasswordInfo}
          onClose={() => setTemporaryPasswordInfo(null)}
        />
      ) : null}
    </div>
  )
}
