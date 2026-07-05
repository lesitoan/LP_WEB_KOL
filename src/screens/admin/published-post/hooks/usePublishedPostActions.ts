import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useCreateAdminInsightActionRequestMutation } from '@/services/api/admin/insightsApi'

interface UsePublishedPostActionsInput {
  onSubmitted: () => void
}

export function usePublishedPostActions({ onSubmitted }: UsePublishedPostActionsInput) {
  const [createActionRequest, createActionRequestState] = useCreateAdminInsightActionRequestMutation()

  const submitActionRequest = async (postId: string, reason: string) => {
    try {
      await createActionRequest({
        insightId: postId,
        body: {
          reason,
        },
      }).unwrap()

      toast({
        variant: 'success',
        title: 'Đã gửi yêu cầu xử lý',
        description: 'Yêu cầu đã được ghi nhận và đang chờ admin duyệt.',
      })

      onSubmitted()
      return true
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Không thể gửi yêu cầu xử lý',
        description: extractApiErrorMessage(error, 'Vui lòng thử lại sau.'),
      })
      return false
    }
  }

  return {
    submitActionRequest,
    isSubmittingActionRequest: createActionRequestState.isLoading,
  }
}
