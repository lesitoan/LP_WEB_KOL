import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import {
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
} from '@/services/api/admin/usersApi'
import { mapUiRoleToApiRole, type AdminRole, type AdminUserRow } from '../constants'

export interface AdminUserFormValues {
  fullName: string
  email: string
  role: AdminRole
  passwordMode: 'auto' | 'manual'
  password: string
}

export interface TemporaryPasswordInfo {
  email: string
  password: string
}

interface UseAdminUsersActionsParams {
  onCreatedPassword: (info: TemporaryPasswordInfo) => void
  onCloseModal: () => void
  refetchUsers: () => void
}

export function useAdminUsersActions({
  onCreatedPassword,
  onCloseModal,
  refetchUsers,
}: UseAdminUsersActionsParams) {
  const [createAdminUser, createState] = useCreateAdminUserMutation()
  const [updateAdminUser, updateState] = useUpdateAdminUserMutation()
  const isSaving = createState.isLoading || updateState.isLoading

  const handleSubmitUser = async (values: AdminUserFormValues, editUser?: AdminUserRow | null) => {
    if (editUser) {
      try {
        await updateAdminUser({
          userId: editUser.id,
          body: {
            email: values.email.trim().toLowerCase(),
            fullName: values.fullName.trim() || null,
            role: mapUiRoleToApiRole(values.role),
            resetPermissionsToRoleDefault: values.role !== editUser.role,
          },
        }).unwrap()

        toast({
          title: 'Cập nhật admin thành công',
          description: 'Thông tin và quyền theo vai trò đã được cập nhật.',
        })

        onCloseModal()
        refetchUsers()
      } catch (error) {
        toast({
          title: 'Cập nhật admin thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật admin. Vui lòng thử lại.'),
          variant: 'destructive',
        })
      }

      return
    }

    try {
      const result = await createAdminUser({
        email: values.email.trim().toLowerCase(),
        fullName: values.fullName.trim() || null,
        role: mapUiRoleToApiRole(values.role),
        password: values.passwordMode === 'manual' ? values.password : undefined,
      }).unwrap()

      toast({
        title: 'Tạo admin thành công',
        description: 'Tài khoản admin mới đã được tạo.',
      })

      onCloseModal()
      refetchUsers()

      if (result.temporaryPassword) {
        onCreatedPassword({
          email: result.user.email,
          password: result.temporaryPassword,
        })
      }
    } catch (error) {
      toast({
        title: 'Tạo admin thất bại',
        description: extractApiErrorMessage(error, 'Không thể tạo admin. Vui lòng thử lại.'),
        variant: 'destructive',
      })
    }
  }

  return {
    isSaving,
    handleSubmitUser,
  }
}
