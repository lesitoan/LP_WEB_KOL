import { useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import {
  useCreateAdminInsightMutation,
  useDeleteAdminInsightMutation,
  usePreviewAdminInsightDistributionMutation,
  usePublishAdminInsightMutation,
  useRecallAdminInsightMutation,
  useScheduleAdminInsightMutation,
  useUpdateAdminInsightMutation,
  useUploadAdminInsightImageMutation,
} from '@/services/api/admin/insightsApi'
import type { CreateAdminInsightBody, ContentTypeCode } from '@/types/api/adminInsight'
import {
  buildUpdateAdminInsightBody,
  isApprovableInsightStatus,
  isPublishableInsightStatus,
  isRecallableInsightStatus,
  isSchedulableInsightStatus,
  type PostReviewTab,
  type ReviewPost,
  type ReviewPostImage,
} from '../constants'
import type { ApprovePostPayload } from '../components/ApprovePostModal'
import { buildLocalDraft } from '../utils'

const IMAGE_UPLOAD_DELAY_MS = 1000

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

interface UsePostReviewActionsParams {
  selectedPost: ReviewPost | undefined
  setLocalDraft: Dispatch<SetStateAction<ReviewPost | undefined>>
  setCreateDialogOpen: Dispatch<SetStateAction<boolean>>
  setManyParams: (next: { status?: PostReviewTab; postId?: string | undefined }) => void
  clearSelection: () => void
  refetchStatusStats: () => void
  refetchActive: () => void
  refetchDetail: () => void
}

export function usePostReviewActions({
  selectedPost,
  setLocalDraft,
  setCreateDialogOpen,
  setManyParams,
  clearSelection,
  refetchStatusStats,
  refetchActive,
  refetchDetail,
}: UsePostReviewActionsParams) {
  const [createAdminInsight, createAdminInsightState] = useCreateAdminInsightMutation()
  const [updateAdminInsight, updateAdminInsightState] = useUpdateAdminInsightMutation()
  const [updateAdminInsightStatus, updateAdminInsightStatusState] = useUpdateAdminInsightMutation()
  const [deleteAdminInsight, deleteAdminInsightState] = useDeleteAdminInsightMutation()
  const [previewAdminInsightDistribution, previewAdminInsightDistributionState] = usePreviewAdminInsightDistributionMutation()
  const [publishAdminInsight, publishAdminInsightState] = usePublishAdminInsightMutation()
  const [scheduleAdminInsight, scheduleAdminInsightState] = useScheduleAdminInsightMutation()
  const [recallAdminInsight, recallAdminInsightState] = useRecallAdminInsightMutation()
  const [uploadAdminInsightImage] = useUploadAdminInsightImageMutation()
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const isSaving = createAdminInsightState.isLoading || updateAdminInsightState.isLoading || isUploadingImages
  const isCreatingDraft = previewAdminInsightDistributionState.isLoading
  const isPublishing = publishAdminInsightState.isLoading || isUploadingImages
  const isScheduling = scheduleAdminInsightState.isLoading || isUploadingImages
  const isApproving = updateAdminInsightStatusState.isLoading || createAdminInsightState.isLoading || isUploadingImages
  const isRecalling = recallAdminInsightState.isLoading
  const isDeleting = deleteAdminInsightState.isLoading

  const buildCreateBody = (post: ReviewPost, status: CreateAdminInsightBody['status']): CreateAdminInsightBody => ({
    sourceType: 'manual',
    contentType: post.contentType,
    title: post.title.trim(),
    body: post.mainContent.trim(),
    status,
    historicalComparison: post.historyComparison.trim() || undefined,
    insightForKol: post.kolInsight.trim() || undefined,
    insightForInvestor: post.investorInsight.trim() || undefined,
    insightForTrader: post.traderInsight.trim() || undefined,
    sources: post.sources.trim() || undefined,
    authorTask: post.authorTask.trim() || undefined,
    kolToolPosted: post.kolToolPosted.trim() || undefined,
    imageUrls: post.imageUrls,
  })

  const preparePostImagesForPersist = async (post: ReviewPost): Promise<ReviewPost> => {
    const hasLocalImage = post.contentImages.some((image) => image.file)

    if (!hasLocalImage) {
      return {
        ...post,
        imageUrls: post.contentImages
          .map((image) => image.remoteUrl ?? image.previewUrl)
          .filter(Boolean),
      }
    }

    const nextImages: ReviewPostImage[] = []
    let failedCount = 0
    let localUploadIndex = 0

    setIsUploadingImages(true)

    try {
      for (const image of post.contentImages) {
        if (!image.file) {
          nextImages.push(image)
          continue
        }

        if (localUploadIndex > 0) {
          await wait(IMAGE_UPLOAD_DELAY_MS)
        }
        localUploadIndex += 1

        try {
          const uploadedImage = await uploadAdminInsightImage(image.file).unwrap()
          nextImages.push({
            id: uploadedImage.imageUrl,
            previewUrl: uploadedImage.imageUrl,
            remoteUrl: uploadedImage.imageUrl,
          })
        } catch {
          failedCount += 1
        }
      }
    } finally {
      setIsUploadingImages(false)
    }

    if (failedCount > 0) {
      toast({
        title: `${failedCount} ảnh chưa được lưu thành công, bạn hãy thử lại`,
        variant: 'destructive',
      })
    }

    return {
      ...post,
      contentImages: nextImages,
      imageUrls: nextImages
        .map((image) => image.remoteUrl ?? image.previewUrl)
        .filter(Boolean),
    }
  }

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
    const originalPost = selectedPost

    if (!updatedPost.isLocalDraft && (!originalPost || originalPost.isLocalDraft)) return

    const hadLocalImages = updatedPost.contentImages.some((image) => image.file)
    const preparedPost = await preparePostImagesForPersist(updatedPost)

    if (!preparedPost.isLocalDraft) {
      if (!originalPost || originalPost.isLocalDraft) return

      const updateBody = buildUpdateAdminInsightBody(originalPost, preparedPost)

      if (!updateBody) {
        toast({
          title: 'Không có thay đổi để cập nhật',
          description: 'Vui lòng chỉnh sửa nội dung trước khi cập nhật.',
        })
        return hadLocalImages ? preparedPost : undefined
      }

      try {
        const updatedInsight = await updateAdminInsight({
          insightId: preparedPost.id,
          body: updateBody,
        }).unwrap()

        toast({
          title: 'Cập nhật thành công',
          description: 'Bài viết đã được cập nhật.',
        })

        setManyParams({ postId: updatedInsight.id })
        return preparedPost
      } catch (error) {
        toast({
          title: 'Cập nhật thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật bài viết. Vui lòng thử lại.'),
          variant: 'destructive',
        })

        refetchStatusStats()
        refetchActive()
        refetchDetail()
      }

      return
    }

    try {
      const createdInsight = await createAdminInsight(buildCreateBody(preparedPost, 'DRAFT')).unwrap()

      toast({
        title: 'Lưu nháp thành công',
        description: 'Bản nháp mới đã được tạo.',
      })

      setLocalDraft(undefined)
      setManyParams({ status: 'DRAFT', postId: createdInsight.id })
      refetchStatusStats()
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
    if (!updatedPost.isLocalDraft) {
      if (!isApprovableInsightStatus(updatedPost.status)) {
        toast({
          title: 'Không tìm thấy bài viết',
          description: 'Trạng thái hiện tại không cho phép chuyển sang chờ duyệt.',
          variant: 'destructive',
        })
        throw new Error('Insight status is not approvable')
      }

      if (!selectedPost || selectedPost.isLocalDraft) {
        toast({
          title: 'Không tìm thấy bài viết',
          description: 'Không tìm thấy dữ liệu bài viết hiện tại.',
          variant: 'destructive',
        })
        throw new Error('Selected post is missing')
      }
    }

    const preparedPost = await preparePostImagesForPersist(updatedPost)

    if (preparedPost.isLocalDraft) {
      try {
        const createdInsight = await createAdminInsight(buildCreateBody(preparedPost, 'PENDING_REVIEW')).unwrap()

        toast({
          title: 'Gửi preview thành công',
          description: 'Bài viết đã được chuyển sang chờ duyệt.',
        })

        setLocalDraft(undefined)
        setManyParams({ status: 'PENDING_REVIEW', postId: createdInsight.id })
        refetchStatusStats()
        refetchActive()
      } catch (error) {
        toast({
          title: 'Gửi preview thất bại',
          description: extractApiErrorMessage(error, 'Không thể chuyển bài viết sang chờ duyệt. Vui lòng thử lại.'),
          variant: 'destructive',
        })
        throw error
      }

      return
    }

    if (!isApprovableInsightStatus(preparedPost.status)) {
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

    const updateBody = buildUpdateAdminInsightBody(selectedPost, preparedPost)

    if (updateBody) {
      try {
        await updateAdminInsight({
          insightId: preparedPost.id,
          body: updateBody,
        }).unwrap()
      } catch (error) {
        toast({
          title: 'Cập nhật thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật bài viết trước khi duyệt. Vui lòng thử lại.'),
          variant: 'destructive',
        })

        refetchStatusStats()
        refetchActive()
        refetchDetail()
        throw error
      }
    }

    try {
      const approvedInsight = await updateAdminInsightStatus({
        insightId: preparedPost.id,
        body: { status: 'PENDING_REVIEW' },
      }).unwrap()

      toast({
        title: 'Gửi preview thành công',
        description: 'Bài viết đã được chuyển sang chờ duyệt.',
      })

      setManyParams({ status: 'PENDING_REVIEW', postId: approvedInsight.id })
      refetchStatusStats()
      refetchActive()
      return preparedPost
    } catch (error) {
      toast({
        title: 'Gửi preview thất bại',
        description: extractApiErrorMessage(error, 'Không thể chuyển bài viết sang chờ duyệt. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchStatusStats()
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

    const preparedPost = await preparePostImagesForPersist(updatedPost)

    const updateBody = buildUpdateAdminInsightBody(selectedPost, preparedPost)

    if (updateBody) {
      try {
        await updateAdminInsight({
          insightId: preparedPost.id,
          body: updateBody,
        }).unwrap()
      } catch (error) {
        toast({
          title: 'Cập nhật thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật bài viết trước khi đăng. Vui lòng thử lại.'),
          variant: 'destructive',
        })

        refetchStatusStats()
        refetchActive()
        refetchDetail()
        throw error
      }
    }

    try {
      const publishedInsight = await publishAdminInsight({ insightId: preparedPost.id }).unwrap()

      toast({
        title: 'Đăng tin thành công',
        description: 'Bài viết đã được đăng.',
      })

      setManyParams({ status: 'PUBLISHED', postId: publishedInsight.id })
      refetchStatusStats()
      refetchActive()
      return preparedPost
    } catch (error) {
      toast({
        title: 'Đăng tin thất bại',
        description: extractApiErrorMessage(error, 'Không thể đăng bài viết. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchStatusStats()
      refetchActive()
      refetchDetail()
      throw error
    }
  }

  const handleScheduleApprove = async (updatedPost: ReviewPost, payload: ApprovePostPayload) => {
    if (updatedPost.isLocalDraft) {
      toast({
        title: 'Chưa thể duyệt tin',
        description: 'Vui lòng lưu nháp trước khi duyệt tin.',
        variant: 'destructive',
      })
      throw new Error('Local draft must be saved before scheduling')
    }

    if (!isSchedulableInsightStatus(updatedPost.status)) {
      toast({
        title: 'Không thể duyệt tin',
        description: 'Trạng thái hiện tại không cho phép duyệt tin.',
        variant: 'destructive',
      })
      throw new Error('Insight status is not schedulable')
    }

    if (!selectedPost || selectedPost.isLocalDraft) {
      toast({
        title: 'Không thể duyệt tin',
        description: 'Không tìm thấy dữ liệu bài viết hiện tại.',
        variant: 'destructive',
      })
      throw new Error('Selected post is missing')
    }

    const preparedPost = await preparePostImagesForPersist(updatedPost)

    const updateBody = buildUpdateAdminInsightBody(selectedPost, preparedPost)

    if (updateBody) {
      try {
        await updateAdminInsight({
          insightId: preparedPost.id,
          body: updateBody,
        }).unwrap()
      } catch (error) {
        toast({
          title: 'Cập nhật thất bại',
          description: extractApiErrorMessage(error, 'Không thể cập nhật bài viết trước khi duyệt. Vui lòng thử lại.'),
          variant: 'destructive',
        })

        refetchStatusStats()
        refetchActive()
        refetchDetail()
        throw error
      }
    }

    try {
      const scheduledInsight = await scheduleAdminInsight({
        insightId: preparedPost.id,
        body: payload.publishNow
          ? { pushlishNow: true }
          : { scheduledAt: payload.scheduledAt, pushlishNow: false },
      }).unwrap()

      toast({
        title: payload.publishNow ? 'Duyệt và đăng tin thành công' : 'Duyệt và hẹn giờ thành công',
        description: payload.publishNow ? 'Bài viết đã được đăng.' : 'Bài viết đã được lên lịch đăng.',
      })

      setManyParams({ status: scheduledInsight.status, postId: scheduledInsight.id })
      refetchStatusStats()
      refetchActive()
      return preparedPost
    } catch (error) {
      toast({
        title: 'Duyệt tin thất bại',
        description: extractApiErrorMessage(error, 'Không thể duyệt bài viết. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchStatusStats()
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

  const handleDeletePost = async (post: ReviewPost) => {
    if (post.isLocalDraft) {
      setLocalDraft((currentDraft) => {
        if (currentDraft?.id !== post.id) return currentDraft
        return undefined
      })

      if (selectedPost?.id === post.id) {
        clearSelection()
      }

      return
    }

    try {
      await deleteAdminInsight({ insightId: post.id }).unwrap()

      toast({
        title: 'Xóa bài viết thành công',
        description: 'Bài viết đã được xóa.',
      })

      if (selectedPost?.id === post.id) {
        clearSelection()
      }

      refetchStatusStats()
      refetchActive()
    } catch (error) {
      toast({
        title: 'Xóa bài viết thất bại',
        description: extractApiErrorMessage(error, 'Không thể xóa bài viết. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchStatusStats()
      refetchActive()
      if (selectedPost?.id === post.id) {
        refetchDetail()
      }
    }
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
      refetchStatusStats()
      refetchActive()
    } catch (error) {
      toast({
        title: 'Thu hồi thất bại',
        description: extractApiErrorMessage(error, 'Không thể thu hồi bài viết. Vui lòng thử lại.'),
        variant: 'destructive',
      })

      refetchStatusStats()
      refetchActive()
      refetchDetail()
      throw error
    }
  }

  return {
    isSaving,
    isCreatingDraft,
    isPublishing,
    isScheduling,
    isApproving,
    isRecalling,
    isDeleting,
    handleCreateNewPost,
    handleSaveDraft,
    handleApprove,
    handleScheduleApprove,
    handlePublish,
    handleDiscard,
    handleDeletePost,
    handleRevoke,
  }
}
