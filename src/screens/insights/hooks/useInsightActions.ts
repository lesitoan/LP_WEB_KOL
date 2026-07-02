import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import {
  usePublishKolInsightMutation,
  useSaveKolInsightCustomizationMutation,
} from '@/services/api/kolInsightsApi'
import type { KolInsightCustomizationBody, PublishKolInsightTarget } from '@/types/api/kolInsight'
import { buildCustomizationPayload } from '../utils'

type PublishInput = {
  insightId: string
  targets: PublishKolInsightTarget[]
}

export function useInsightActions() {
  const [saveCustomization, saveState] = useSaveKolInsightCustomizationMutation()
  const [publishInsight, publishState] = usePublishKolInsightMutation()

  const handleSaveCustomization = async (insightId: string, values: KolInsightCustomizationBody) => {
    try {
      await saveCustomization({
        insightId,
        body: buildCustomizationPayload(values),
      }).unwrap()

      toast({
        title: 'Đã lưu chỉnh sửa',
        description: 'Nội dung insight đã được cập nhật.',
      })
      return true
    } catch (error) {
      toast({
        title: 'Không thể lưu chỉnh sửa',
        description: extractApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        variant: 'destructive',
      })
      return false
    }
  }

  const handlePublish = async ({ insightId, targets }: PublishInput) => {
    if (!targets.length) {
      toast({
        title: 'Chưa chọn nhóm',
        description: 'Chọn ít nhất một nhóm để đăng insight.',
        variant: 'destructive',
      })
      return false
    }

    try {
      await publishInsight({
        insightId,
        body: { targets },
      }).unwrap()

      toast({
        title: 'Đã đăng tin',
        description: 'Insight đã được ghi nhận publish cho nhóm đã chọn.',
      })
      return true
    } catch (error) {
      toast({
        title: 'Không thể đăng tin',
        description: extractApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        variant: 'destructive',
      })
      return false
    }
  }

  return {
    isSaving: saveState.isLoading,
    isPublishing: publishState.isLoading,
    handleSaveCustomization,
    handlePublish,
  }
}
