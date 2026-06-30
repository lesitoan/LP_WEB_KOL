import PostDetailEditor from './PostDetailEditor'
import type { ReviewPost } from '../constants'
import type { AdminInsightDistributionPreview } from '@/types/api/adminInsight'
import { PostReviewDetailSkeleton } from '@/components/skeletons/post-review/PostReviewDetailSkeleton'

interface PostReviewDetailPanelProps {
  post: ReviewPost | undefined
  distributionPreview?: AdminInsightDistributionPreview
  isLoading: boolean
  showEmpty: boolean
  onSaveDraft: (post: ReviewPost) => void
  onPublish: (post: ReviewPost) => Promise<void> | void
  onDiscard: (postId: string) => void
  onRevoke: (postId: string) => Promise<void> | void
  isSaving: boolean
  isPublishing: boolean
  isRecalling: boolean
}

export default function PostReviewDetailPanel({
  post,
  distributionPreview,
  isLoading,
  showEmpty,
  onSaveDraft,
  onPublish,
  onDiscard,
  onRevoke,
  isSaving,
  isPublishing,
  isRecalling,
}: PostReviewDetailPanelProps) {
  return (
    <div className="flex-1 w-full min-h-0">
      {isLoading ? (
        <PostReviewDetailSkeleton />
      ) : showEmpty ? (
        <div className="h-48 flex items-center justify-center text-center text-[#828283] text-sm bg-[#171717] rounded-2xl p-6 border border-[#282828] w-full">
          Chưa có dữ liệu
        </div>
      ) : post ? (
        <PostDetailEditor
          key={post.id}
          post={post}
          distributionPreview={distributionPreview}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          onDiscard={onDiscard}
          onRevoke={onRevoke}
          isSaving={isSaving}
          isPublishing={isPublishing}
          isRecalling={isRecalling}
        />
      ) : null}
    </div>
  )
}
