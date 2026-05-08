'use client'

import { useEffect, useState } from 'react'
import { AddGroupDialog } from './components/addGroupDialog'
import { GroupsListContainer } from './components/groupsListContainer'
import type { CreateGroupBody, ListGroupsQuery, UpdateGroupBody } from '@/types/api'
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
  const { state, setSearchInput, setQuery, setViewMode } = useGroupsFiltersState()

  const { data, isFetching, error } = useGetGroupsQuery(state.query)
  const [updateGroup] = useUpdateGroupMutation()
  const [createGroup] = useCreateGroupMutation()
  const [deleteGroup] = useDeleteGroupMutation()
  const { showConfirm, showAlert, Popup } = usePopup()

  const groups = data?.items ?? []
  const pagination = data?.pagination
  const [shouldOpenCreateDialog, setShouldOpenCreateDialog] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('dialog') === 'create') {
      setShouldOpenCreateDialog(true)
    }
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách group',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra'),
      })
    }
  }, [error])

  const handleUpdateGroup = async (
    groupId: string,
    payload: UpdateGroupBody,
  ) => {
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
      // throw updateError
    }
  }

  const handleAddGroup = async (payload: CreateGroupBody) => {
    try {
      await createGroup(payload).unwrap()
      toast({
        title: 'Đã thêm nhóm mới',
        description: 'Tạo group thành công.',
      })
    } catch (createError) {
      toast({
        variant: 'destructive',
        title: 'Không tạo được group',
        description: extractApiErrorMessage(createError, 'Đã có lỗi xảy ra'),
      })
      throw createError
    }
  }

  const handleDeleteGroup = async (groupId: string, title: string) => {
    const accepted = await showConfirm({
      title: 'Xác nhận xóa nhóm',
      description: `Bạn có chắc chắn muốn xóa nhóm \"${title}\"? ành động này không thể hoàn tác.`,
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

  return (
    <div className="space-y-6">
      {/* Default Group Info */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers3 className="h-5 w-5" />
            Giá trị mặc định
          </CardTitle>
          <CardDescription>Các giá trị mặc định áp dụng cho nhóm mới</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-border p-3">
              <p className="text-sm text-muted-foreground">Ngưỡng volume</p>
              <p className="text-lg font-semibold">Map tu API</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-sm text-muted-foreground">Số lần cảnh báo</p>
              <p className="text-lg font-semibold">warningCountBeforeKick</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-sm text-muted-foreground">Thời gian ân hạn</p>
              <p className="text-lg font-semibold text-muted-foreground">Chưa có API</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-sm text-muted-foreground">Auto-kick</p>
              <p className="text-lg font-semibold text-success">autoKickEnabled</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-sm text-muted-foreground">Cho phép rejoin</p>
              <p className="text-lg font-semibold text-success">rejoinEnabled</p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Groups List */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Danh sách nhóm</h2>
          <AddGroupDialog onAdd={handleAddGroup} defaultOpen={shouldOpenCreateDialog} />
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
          onDeleteGroup={handleDeleteGroup}
        />
      </div>
      <Popup />
    </div>
  )
}

export default GroupsScreen

