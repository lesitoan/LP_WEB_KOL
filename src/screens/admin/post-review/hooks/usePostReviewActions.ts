import type { Dispatch, SetStateAction } from 'react'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import {
  useApproveAdminInsightMutation,
  useCreateAdminInsightMutation,
  usePreviewAdminInsightDistributionMutation,
  usePublishAdminInsightMutation,
  useRecallAdminInsightMutation,
  useUpdateAdminInsightMutation,
} from '@/services/api/admin/insightsApi'
import type { CreateAdminInsightBody, ContentTypeCode } from '@/types/api/adminInsight'
import {
  buildUpdateAdminInsightBody,
  isApprovableInsightStatus,
  isPublishableInsightStatus,
  isRecallableInsightStatus,
  type PostReviewTab,
  type ReviewPost,
} from '../constants'
import { buildLocalDraft } from '../utils'

interface UsePostReviewActionsParams {
  selectedPost: ReviewPost | undefined
  setLocalDraft: Dispatch<SetStateAction<ReviewPost | undefined>>
  setCreateDialogOpen: Dispatch<SetStateAction<boolean>>
  setManyParams: (next: { status?: PostReviewTab; postId?: string | undefined }) => void
  clearSelection: () => void
  refetchAll: () => void
  refetchActive: () => void
  refetchDetail: () => void
}

export function usePostReviewActions({
  selectedPost,
  setLocalDraft,
  setCreateDialogOpen,
  setManyParams,
  clearSelection,
  refetchAll,
  refetchActive,
  refetchDetail,
}: UsePostReviewActionsParams) {
  const [createAdminInsight, createAdminInsightState] = useCreateAdminInsightMutation()
  const [updateAdminInsight, updateAdminInsightState] = useUpdateAdminInsightMutation()
  const [previewAdminInsightDistribution, previewAdminInsightDistributionState] = usePreviewAdminInsightDistributionMutation()
  const [publishAdminInsight, publishAdminInsightState] = usePublishAdminInsightMutation()
  const [approveAdminInsight, approveAdminInsightState] = useApproveAdminInsightMutation()
  const [recallAdminInsight, recallAdminInsightState] = useRecallAdminInsightMutation()

  const isSaving = createAdminInsightState.isLoading || updateAdminInsightState.isLoading
  const isCreatingDraft = previewAdminInsightDistributionState.isLoading
  const isPublishing = publishAdminInsightState.isLoading
  const isApproving = approveAdminInsightState.isLoading
  const isRecalling = recallAdminInsightState.isLoading

  const handleCreateNewPost = async (payload: { contentType: ContentTypeCode; title: string; scheduledAt: string }) => {
    try {
      const distributionPreview = await previewAdminInsightDistribution({
        contentType: payload.contentType,
        scheduledAt: payload.scheduledAt,
      }).unwrap()

      setLocalDraft(buildLocalDraft({
        ...payload,
        distributionPreview,
      }))
      setCreateDialogOpen(false)
      setManyParams({ status: 'DRAFT', postId: undefined })
    } catch (error) {
      toast({
        title: 'Không thể tạo tin',
        description: extractApiErrorMessage(error, 'Không thể tạo tin. Vui lòng thử lại.'),
        variant: 'destructive',
      })
    }
  }

  const handleSaveDraft = async (updatedPost: ReviewPost) => {
    if (!updatedPost.isLocalDraft) {
      if (!selectedPost || selectedPost.isLocalDraft) return

      const updateBody = buildUpdateAdminInsightBody(selectedPost, updatedPost)

      if (!updateBody) {
        toast({
          title: 'Không có thay đổi để cập nhật',
          description: 'Vui lòng chỉnh sửa nội dung trước khi cập nhật.',
        })
        return
      }

      try {
        const updatedInsight = await updateAdminInsight({
          insightId: updatedPost.id,
          body: updateBody,
        }).unwrap()

        toast({
          title: 'Cập nhật thành công',
          description: 'Bài viết đã được cập nhật.',
        })

        setManyParams({ postId: updatedInsight.id })
      } catch (error) {
        toast({
          title: 'Cập nhật thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật bài viết. Vui lòng thử lại.'),
          variant: 'destructive',
        })

        refetchAll()
        refetchActive()
        refetchDetail()
      }

      return
    }

    const createBody: CreateAdminInsightBody = {
      sourceType: 'manual',
      contentType: updatedPost.contentType,
      title: updatedPost.title.trim(),
      body: updatedPost.mainContent.trim(),
      status: 'DRAFT',
      historicalComparison: updatedPost.historyComparison.trim() || undefined,
      insightForKol: updatedPost.kolInsight.trim() || undefined,
      insightForInvestor: updatedPost.investorInsight.trim() || undefined,
      insightForTrader: updatedPost.traderInsight.trim() || undefined,
      sources: updatedPost.sources.trim() || undefined,
      authorTask: updatedPost.authorTask.trim() || undefined,
      kolToolPosted: updatedPost.kolToolPosted.trim() || undefined,
    }

    try {
      const createdInsight = await createAdminInsight(createBody).unwrap()

      toast({
        title: 'Lưu nháp thành công',
        description: 'Bản nháp mới đã được tạo.',
      })

      setLocalDraft(undefined)
      setManyParams({ status: 'DRAFT', postId: createdInsight.id })
      refetchAll()
      refetchActive()
    } catch (error) {
      toast({
        title: 'Lưu nháp thất bại',
        description: extractApiErrorMessage(error, 'Không thể lưu bản nháp. Vui lòng thử lại.'),
        variant: 'destructive',
      })
    }
  }

  const handleApprove = async (updatedPost: ReviewPost) => {
    if (updatedPost.isLocalDraft) {
      toast({
        title: 'Chưa thể duyệt tin',
        description: 'Vui lòng lưu nháp trước khi chuyển sang chờ duyệt.',
        variant: 'destructive',
      })
      throw new Error('Local draft must be saved before approving')
    }

    if (!isApprovableInsightStatus(updatedPost.status)) {
      toast({
        title: 'Không thể duyệt tin',
        description: 'Trạng thái hiện tại không cho phép chuyển sang chờ duyệt.',
        variant: 'destructive',
      })
      throw new Error('Insight status is not approvable')
    }

    if (!selectedPost || selectedPost.isLocalDraft) {
      toast({
        title: 'Không thể duyệt tin',
        description: 'Không tìm thấy dữ liệu bài viết hiện tại.',
        variant: 'destructive',
      })
      throw new Error('Selected post is missing')
    }

    const updateBody = buildUpdateAdminInsightBody(selectedPost, updatedPost)

    if (updateBody) {
      try {
        await updateAdminInsight({
          insightId: updatedPost.id,
          body: updateBody,
        }).unwrap()
      } catch (error) {
        toast({
          title: 'Cập nhật thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật bài viết trước khi duyệt. Vui lòng thử lại.'),
          variant: 'destructive',
        })

        refetchAll()
        refetchActive()
        refetchDetail()
        throw error
      }
    }

    try {
      const approvedInsight = await approveAdminInsight({ insightId: updatedPost.id }).unwrap()

      toast({
        title: 'Duyệt tin thành công',
        description: 'Bài viết đã được chuyển sang chờ duyệt.',
      })

      setManyParams({ status: 'PENDING_REVIEW', postId: approvedInsight.id })
      refetchAll()
      refetchActive()
    } catch (error) {
      toast({
        title: 'Duyệt tin thất bại',
        description: extractApiErrorMessage(error, 'Không thể chuyển bài viết sang chờ duyệt. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchAll()
      refetchActive()
      refetchDetail()
      throw error
    }
  }

  const handlePublish = async (updatedPost: ReviewPost) => {
    if (updatedPost.isLocalDraft) {
      toast({
        title: 'Chưa thể đăng tin',
        description: 'Vui lòng lưu nháp trước khi đăng tin.',
        variant: 'destructive',
      })
      throw new Error('Local draft must be saved before publishing')
    }

    if (!isPublishableInsightStatus(updatedPost.status)) {
      toast({
        title: 'Không thể đăng tin',
        description: 'Trạng thái hiện tại không cho phép đăng tin.',
        variant: 'destructive',
      })
      throw new Error('Insight status is not publishable')
    }

    if (!selectedPost || selectedPost.isLocalDraft) {
      toast({
        title: 'Không thể đăng tin',
        description: 'Không tìm thấy dữ liệu bài viết hiện tại.',
        variant: 'destructive',
      })
      throw new Error('Selected post is missing')
    }

    const updateBody = buildUpdateAdminInsightBody(selectedPost, updatedPost)

    if (updateBody) {
      try {
        await updateAdminInsight({
          insightId: updatedPost.id,
          body: updateBody,
        }).unwrap()
      } catch (error) {
        toast({
          title: 'Cập nhật thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật bài viết trước khi đăng. Vui lòng thử lại.'),
          variant: 'destructive',
        })

        refetchAll()
        refetchActive()
        refetchDetail()
        throw error
      }
    }

    try {
      const publishedInsight = await publishAdminInsight({ insightId: updatedPost.id }).unwrap()

      toast({
        title: 'Đăng tin thành công',
        description: 'Bài viết đã được đăng.',
      })

      setManyParams({ status: 'PUBLISHED', postId: publishedInsight.id })
      refetchAll()
      refetchActive()
    } catch (error) {
      toast({
        title: 'Đăng tin thất bại',
        description: extractApiErrorMessage(error, 'Không thể đăng bài viết. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchAll()
      refetchActive()
      refetchDetail()
      throw error
    }
  }

  const handleDiscard = (postId: string) => {
    setLocalDraft((currentDraft) => {
      if (currentDraft?.id !== postId) return currentDraft
      return undefined
    })
    clearSelection()
  }

  const handleRevoke = async (postId: string) => {
    if (!selectedPost || selectedPost.isLocalDraft) {
      toast({
        title: 'Không thể thu hồi tin',
        description: 'Không tìm thấy dữ liệu bài viết hiện tại.',
        variant: 'destructive',
      })
      throw new Error('Selected post is missing')
    }

    if (!isRecallableInsightStatus(selectedPost.status)) {
      toast({
        title: 'Không thể thu hồi tin',
        description: 'Trạng thái hiện tại không cho phép thu hồi tin.',
        variant: 'destructive',
      })
      throw new Error('Insight status is not recallable')
    }

    try {
      const recalledInsight = await recallAdminInsight({ insightId: postId }).unwrap()

      toast({
        title: 'Thu hồi thành công',
        description: 'Bài viết đã được thu hồi.',
      })

      setManyParams({ status: 'RECALLED', postId: recalledInsight.id })
      refetchAll()
      refetchActive()
    } catch (error) {
      toast({
        title: 'Thu hồi thất bại',
        description: extractApiErrorMessage(error, 'Không thể thu hồi bài viết. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchAll()
      refetchActive()
      refetchDetail()
      throw error
    }
  }

  return {
    isSaving,
    isCreatingDraft,
    isPublishing,
    isApproving,
    isRecalling,
    handleCreateNewPost,
    handleSaveDraft,
    handleApprove,
    handlePublish,
    handleDiscard,
    handleRevoke,
  }
}
