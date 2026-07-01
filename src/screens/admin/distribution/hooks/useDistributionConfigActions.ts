import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useUpdateAdminDistributionConfigMutation } from '@/services/api/admin/distributionConfigApi'
import type { UpdateAdminDistributionConfigBody } from '@/types/api/adminDistributionConfig'
import { mapDistributionConfigToDraft, type DistributionDraft } from '../constants'

interface UseDistributionConfigActionsParams {
  onSaved: (draft: DistributionDraft) => void
}

export function useDistributionConfigActions({ onSaved }: UseDistributionConfigActionsParams) {
  const [updateConfig, updateState] = useUpdateAdminDistributionConfigMutation()

  const handleSave = async (body: UpdateAdminDistributionConfigBody | null) => {
    if (!body) return

    try {
      const updatedConfig = await updateConfig(body).unwrap()
      onSaved(mapDistributionConfigToDraft(updatedConfig))
      toast({
        title: 'Đã lưu cấu hình phân phối',
        description: 'Các thay đổi đã được cập nhật thành công.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Không thể lưu cấu hình',
        description: extractApiErrorMessage(error, 'Vui lòng thử lại sau.'),
      })
    }
  }

  return {
    isSaving: updateState.isLoading,
    handleSave,
  }
}
