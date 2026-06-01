'use client'

import { useEffect } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/useToast'
import { usePopup } from '@/hooks/usePopup'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import {
  useCreateAdminKolMutation,
  useDeleteAdminKolMutation,
  useGetAdminKolsQuery,
  useUpdateAdminKolMutation,
  useUpdateAdminKolStatusMutation,
} from '@/services/api/admin/kolsApi'
import type { AdminKolStatusAction, CreateAdminKolBody, UpdateAdminKolBody } from '@/types/admin/kols'
import { useAdminKolsFiltersState } from './hooks/useAdminKolsFiltersState'
import { AdminKolFormDialog } from './components/AdminKolFormDialog'
import { AdminKolsFilters } from './components/AdminKolsFilters'
import { AdminKolsTable } from './components/AdminKolsTable'

export default function AdminKolsScreen() {
  const { state, setSearchInput, setQuery } = useAdminKolsFiltersState()
  const { data, isFetching, error, refetch } = useGetAdminKolsQuery(state.query)
  const [createKol] = useCreateAdminKolMutation()
  const [updateKol] = useUpdateAdminKolMutation()
  const [updateKolStatus] = useUpdateAdminKolStatusMutation()
  const [deleteKol] = useDeleteAdminKolMutation()
  const { showConfirm, showAlert, Popup } = usePopup()

  const kols = data?.items ?? []
  const pagination = data?.pagination
  const totalItems = pagination?.totalItems ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const startIndex = totalItems === 0 ? 0 : (state.query.page - 1) * state.query.limit + 1
  const endIndex = Math.min(state.query.page * state.query.limit, totalItems)

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách Partner',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra khi gọi API /admin/kols'),
      })
    }
  }, [error])

  const handleCreateKol = async (payload: CreateAdminKolBody | UpdateAdminKolBody) => {
    try {
      await createKol(payload as CreateAdminKolBody).unwrap()
      toast({
        title: 'Đã tạo Partner',
        description: 'Partner mới và tài khoản owner đã được tạo.',
      })
    } catch (createError) {
      toast({
        variant: 'destructive',
        title: 'Không tạo được Partner',
        description: extractApiErrorMessage(createError, 'Đã có lỗi xảy ra'),
      })
      throw createError
    }
  }

  const statusActionToastText: Record<AdminKolStatusAction, { success: string; error: string; description: string }> = {
    approve: {
      success: 'Duyệt Partner thành công',
      error: 'Không duyệt được Partner',
      description: 'Trạng thái Partner đã được chuyển sang đang hoạt động.',
    },
    reject: {
      success: 'Từ chối Partner thành công',
      error: 'Không từ chối được Partner',
      description: 'Trạng thái Partner đã được chuyển sang đã từ chối.',
    },
    pause: {
      success: 'Tạm dừng Partner thành công',
      error: 'Không tạm dừng được Partner',
      description: 'Trạng thái Partner đã được chuyển sang tạm dừng.',
    },
    resume: {
      success: 'Kích hoạt lại Partner thành công',
      error: 'Không kích hoạt lại được Partner',
      description: 'Trạng thái Partner đã được chuyển sang đang hoạt động.',
    },
  }

  const handleUpdateKol = async (
    kolId: string,
    payload: UpdateAdminKolBody,
    statusAction?: AdminKolStatusAction,
  ) => {
    let hasFailed = false
    try {
      await updateKol({ kolId, data: payload }).unwrap()
      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin Partner đã được cập nhật.',
      })
    } catch (updateError) {
      toast({
        variant: 'destructive',
        title: 'Không cập nhật được Partner',
        description: extractApiErrorMessage(updateError, 'Đã có lỗi xảy ra'),
      })
      hasFailed = true
    }

    if (statusAction) {
      const statusToast = statusActionToastText[statusAction]

      try {
        await updateKolStatus({ kolId, action: statusAction }).unwrap()
        toast({
          title: statusToast.success,
          description: statusToast.description,
        })
      } catch (statusError) {
        toast({
          variant: 'destructive',
          title: statusToast.error,
          description: extractApiErrorMessage(statusError, 'Đã có lỗi xảy ra'),
        })
        hasFailed = true
      }
    }

    if (hasFailed) {
      throw new Error('Không thể hoàn tất cập nhật Partner')
    }
  }

  const handleDeleteKol = async (kolId: string, label: string) => {
    const accepted = await showConfirm({
      title: 'Xác nhận xóa Partner',
      description: `Bạn có chắc chắn muốn xóa Partner "${label}" không? Hành động này không thể hoàn tác.`,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
      destructive: true,
    })

    if (!accepted) return

    try {
      await deleteKol({ kolId }).unwrap()
      await showAlert({
        title: 'Đã xóa Partner',
        description: 'Partner đã được xóa thành công.',
        confirmText: 'OK',
      })
    } catch (deleteError) {
      toast({
        variant: 'destructive',
        title: 'Không xóa được Partner',
        description: extractApiErrorMessage(deleteError, 'Đã có lỗi xảy ra'),
      })
    }
  }

  const emptyContent = error
    ? extractApiErrorMessage(error, 'Không thể tải danh sách Partner')
    : 'Không có Partner nào phù hợp.'

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <section className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Quản lý Partner</h1>
          <p className="text-sm text-muted-foreground">Tạo, cập nhật và theo dõi hồ sơ Partner trong hệ thống admin.</p>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          {/* <Button type="button" variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button> */}
          <AdminKolFormDialog
            mode="create"
            onSubmitPayload={handleCreateKol}
            trigger={
              <Button type="button">
                <Plus className="h-4 w-4" />
                Tạo Partner
              </Button>
            }
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/[0.08] p-4 text-sm text-destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{extractApiErrorMessage(error, 'Không thể tải danh sách Partner')}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        </div>
      ) : null}

      <Card className="min-w-0 overflow-visible">
        <AdminKolsFilters
          searchInput={state.searchInput}
          statusValue={state.query.status}
          isFetching={isFetching}
          statusBadges={[]}
          onSearchInputChange={setSearchInput}
          onStatusChange={(status) => setQuery({ ...state.query, page: 1, status })}
          onClearStatus={() => setQuery({ ...state.query, page: 1, status: undefined })}
        />
        <div className="min-w-0 max-w-full rounded-b-[14px] overflow-hidden">
          <AdminKolsTable
            kols={kols}
            isFetching={isFetching}
            emptyContent={emptyContent}
            pagination={{
              page: state.query.page,
              limit: state.query.limit,
              totalItems,
              totalPages: Math.max(1, totalPages),
              isDisabled: isFetching,
              summaryText:
                totalItems > 0
                  ? `Hiển thị ${startIndex}-${endIndex} / ${totalItems} Partner`
                  : 'Chưa có dữ liệu Partner',
              onPageChange: (page) => setQuery({ ...state.query, page }),
              onLimitChange: (limit) => setQuery({ ...state.query, page: 1, limit }),
              limitOptions: [10, 20, 50, 100],
            }}
            onUpdateKol={handleUpdateKol}
            onDeleteKol={handleDeleteKol}
          />
        </div>
      </Card>

      <Popup />
    </div>
  )
}
