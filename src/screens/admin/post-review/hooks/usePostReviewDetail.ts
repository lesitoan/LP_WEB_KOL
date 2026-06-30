import { mapInsightToReviewPost, type ReviewPost } from '../constants'
import {
  useGetAdminInsightDetailQuery,
  useGetAdminInsightDistributionPreviewQuery,
} from '@/services/api/admin/insightsApi'

interface UsePostReviewDetailParams {
  selectedPostId: string | undefined
  localDraft: ReviewPost | undefined
}

export function usePostReviewDetail({ selectedPostId, localDraft }: UsePostReviewDetailParams) {
  const isLocalDraft = Boolean(selectedPostId && selectedPostId === localDraft?.id)

  const detailQuery = useGetAdminInsightDetailQuery(selectedPostId ?? '', {
    skip: !selectedPostId || isLocalDraft,
  })
  const distributionPreviewQuery = useGetAdminInsightDistributionPreviewQuery(
    { insightId: selectedPostId ?? '' },
    { skip: !selectedPostId || isLocalDraft }
  )

  const selectedPost = selectedPostId === localDraft?.id
    ? localDraft
    : detailQuery.data
      ? mapInsightToReviewPost(detailQuery.data)
      : undefined

  const detailIsLoading = Boolean(selectedPostId) && selectedPostId !== localDraft?.id && (detailQuery.isLoading || detailQuery.isFetching)
  const showDetailEmpty = !detailIsLoading && (!selectedPostId || !selectedPost)

  return {
    detailQuery,
    distributionPreviewQuery,
    distributionPreview: isLocalDraft ? localDraft?.distributionPreview : distributionPreviewQuery.data,
    distributionPreviewIsLoading: distributionPreviewQuery.isLoading || distributionPreviewQuery.isFetching,
    selectedPost,
    detailIsLoading,
    showDetailEmpty,
  }
}
