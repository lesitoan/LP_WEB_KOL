'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AddGroupDialog } from './components/addGroupDialog'
import { GroupsListContainer } from './components/groupsListContainer'
import type { CreateGroupBody, UpdateGroupBody } from '@/types/api'
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupsQuery,
  useUpdateGroupMutation,
} from '@/services/api/groupsApi'
import { toast } from '@/hooks/useToast'
import { usePopup } from '@/hooks/usePopup'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useGroupsFiltersState } from './hooks/useGroupsFiltersState'

export function GroupsScreen() {
  const searchParams = useSearchParams()
  const { state, setSearchInput, setQuery, setViewMode } = useGroupsFiltersState()

  const { data, isFetching, error } = useGetGroupsQuery(state.query)
  const [updateGroup] = useUpdateGroupMutation()
  const [createGroup] = useCreateGroupMutation()
  const [deleteGroup] = useDeleteGroupMutation()
  const { showConfirm, showAlert, Popup } = usePopup()

  const groups = data?.items ?? []
  const pagination = data?.pagination
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('openform') === 'true') {
      setIsCreateDialogOpen(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách group',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra'),
      })
    }
  }, [error])

  const handleUpdateGroup = async (groupId: string, payload: UpdateGroupBody) => {
    try {
      await updateGroup({ groupId, data: payload }).unwrap()
      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin group đã được cập nhật',
      })
    } catch (updateError) {
      toast({
        variant: 'destructive',
        title: 'Không cập nhật được group',
        description: extractApiErrorMessage(updateError, 'Đã có lỗi xảy ra'),
      })
    }
  }

  const handleAddGroup = async (payload: CreateGroupBody) => {
    try {
      await createGroup(payload).unwrap()
      toast({
        title: 'Đã thêm nhóm mới',
        description: 'Tạo group thành công.',
      })
      setIsCreateDialogOpen(false)
    } catch (createError) {
      toast({
        variant: 'destructive',
        title: 'Không tạo được group',
        description: extractApiErrorMessage(createError, 'Đã có lỗi xảy ra'),
      })
      // throw createError
    }
  }

  const handleDeleteGroup = async (groupId: string, title: string) => {
    const accepted = await showConfirm({
      title: 'Xác nhận xóa nhóm',
      description: `Bạn có chắc chắn muốn xóa nhóm "${title}". Hành động này không thể hoàn tác.`,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
      destructive: true,
    })

    if (!accepted) {
      return
    }

    try {
      await deleteGroup({ groupId }).unwrap()
      await showAlert({
        title: 'Đã xóa nhóm',
        description: 'Nhóm đã được xóa thành công.',
        confirmText: 'ok',
      })
    } catch (deleteError) {
      toast({
        variant: 'destructive',
        title: 'Không xóa được nhóm',
        description: extractApiErrorMessage(deleteError, 'Đã có lỗi xảy ra'),
      })
    }
  }

  const handleToggleGroupStatus = async (groupId: string, title: string, nextStatus: 'ACTIVE' | 'INACTIVE') => {
    const isActivating = nextStatus === 'ACTIVE'
    const accepted = await showConfirm({
      title: isActivating ? 'Xác nhận bật nhóm' : 'Xác nhận tắt nhóm',
      description: isActivating
        ? `Bạn có chắc chắn muốn bật nhóm "${title}" không?`
        : `Bạn có chắc chắn muốn tắt nhóm "${title}" không?`,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
    })

    if (!accepted) {
      return
    }

    await handleUpdateGroup(groupId, { status: nextStatus })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Danh sách nhóm</h2>
          <AddGroupDialog
            onAdd={handleAddGroup}
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        </div>
        <GroupsListContainer
          groups={groups}
          query={state.query}
          searchInput={state.searchInput}
          viewMode={state.viewMode}
          totalItems={pagination?.totalItems ?? 0}
          totalPages={pagination?.totalPages ?? 1}
          isFetching={isFetching}
          onSearchInputChange={setSearchInput}
          onQueryChange={setQuery}
          onViewModeChange={setViewMode}
          onUpdateGroup={handleUpdateGroup}
          onToggleGroupStatus={handleToggleGroupStatus}
          onDeleteGroup={handleDeleteGroup}
        />
      </div>
      <Popup />
    </div>
  )
}

export default GroupsScreen
