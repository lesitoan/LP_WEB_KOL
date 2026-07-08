import PostDetailEditor from './PostDetailEditor'
import type { ApprovePostPayload } from './ApprovePostModal'
import type { ReviewPost } from '../constants'
import type { AdminInsightDistributionPreview } from '@/types/api/adminInsight'
import { PostReviewDetailSkeleton } from '@/components/skeletons/post-review/PostReviewDetailSkeleton'

interface PostReviewDetailPanelProps {
  post: ReviewPost | undefined
  distributionPreview?: AdminInsightDistributionPreview
  isLoading: boolean
  showEmpty: boolean
  onSaveDraft: (post: ReviewPost) => Promise<ReviewPost | void> | ReviewPost | void
  onApprove: (post: ReviewPost) => Promise<ReviewPost | void> | ReviewPost | void
  onLoadApprovePreview: (post: ReviewPost) => Promise<AdminInsightDistributionPreview>
  onScheduleApprove: (post: ReviewPost, payload: ApprovePostPayload) => Promise<ReviewPost | void> | ReviewPost | void
  onPublish: (post: ReviewPost) => Promise<ReviewPost | void> | ReviewPost | void
  onDiscard: (postId: string) => void
  onRevoke: (postId: string) => Promise<void> | void
  isSaving: boolean
  isApproving: boolean
  isScheduling: boolean
  isPublishing: boolean
  isRecalling: boolean
}

export default function PostReviewDetailPanel({
  post,
  distributionPreview,
  isLoading,
  showEmpty,
  onSaveDraft,
  onApprove,
  onLoadApprovePreview,
  onScheduleApprove,
  onPublish,
  onDiscard,
  onRevoke,
  isSaving,
  isApproving,
  isScheduling,
  isPublishing,
  isRecalling,
}: PostReviewDetailPanelProps) {
  return (
    <div className="flex-1 min-w-0 w-full xl:w-0 min-h-0 xl:h-full">
      {isLoading ? (
        <PostReviewDetailSkeleton />
      ) : showEmpty ? (
        <div className="h-48 flex items-center justify-center text-center text-[#828283] text-sm bg-[#171717] rounded-2xl p-6 border border-[#282828] w-full">
          Chưa có dữ liệu
        </div>
      ) : post ? (
        <div className="p-[1px] w-full h-full flex flex-col min-h-0">
          <PostDetailEditor
            key={post.id}
            post={post}
            distributionPreview={distributionPreview}
            onSaveDraft={onSaveDraft}
            onApprove={onApprove}
            onLoadApprovePreview={onLoadApprovePreview}
            onScheduleApprove={onScheduleApprove}
            onPublish={onPublish}
            onDiscard={onDiscard}
            onRevoke={onRevoke}
            isSaving={isSaving}
            isApproving={isApproving}
            isScheduling={isScheduling}
            isPublishing={isPublishing}
            isRecalling={isRecalling}
          />
        </div>
      ) : null}
    </div>
  )
}
