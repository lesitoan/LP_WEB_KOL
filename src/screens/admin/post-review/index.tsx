"use client"

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { usePopup } from '@/hooks/usePopup'
import { cn } from '@/lib/utils'
import CreatePostModal from './components/CreatePostModal'
import PostReviewDetailPanel from './components/PostReviewDetailPanel'
import PostReviewHeader from './components/PostReviewHeader'
import PostReviewList from './components/PostReviewList'
import { usePostReviewActions } from './hooks/usePostReviewActions'
import { usePostReviewData } from './hooks/usePostReviewData'
import { usePostReviewDetail } from './hooks/usePostReviewDetail'
import { usePostReviewSelection } from './hooks/usePostReviewSelection'
import { usePostReviewUrlState } from './hooks/usePostReviewUrlState'
import { CATEGORIES, STATUS_CONFIGS, type PostReviewTab, type ReviewPost } from './constants'

export default function AdminPostReviewScreen() {
  const [localDraft, setLocalDraft] = useState<ReviewPost | undefined>()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { showConfirm, Popup } = usePopup()

  const {
    activeTab,
    page,
    selectedPostIdParam,
    setActiveTab,
    setPage,
    setSelectedPostIdParam,
    setManyParams,
    clearSelectedPostId,
  } = usePostReviewUrlState()

  const data = usePostReviewData({
    activeTab,
    page,
    localDraft,
  })

  const selection = usePostReviewSelection({
    activeTab,
    activeItems: data.activeItems,
    localDraft,
    localDraftVisible: data.localDraftVisible,
    isFetching: data.activeInsightsQuery.isFetching,
    selectedPostIdParam,
    setSelectedPostIdParam,
    clearSelectedPostId,
  })

  const detail = usePostReviewDetail({
    selectedPostId: selection.selectedPostId,
    localDraft,
  })

  const actions = usePostReviewActions({
    selectedPost: detail.selectedPost,
    setLocalDraft,
    setCreateDialogOpen,
    setManyParams,
    clearSelection: selection.clearSelection,
    refetchStatusStats: data.statusStatsQuery.refetch,
    refetchActive: data.activeInsightsQuery.refetch,
    refetchDetail: detail.detailQuery.refetch,
  })

  const handleTabChange = (tab: PostReviewTab) => {
    const count = data.statusCounts[tab] ?? 0
    if (tab !== 'ALL' && count === 0) return
    setActiveTab(tab)
  }

  const handleDeletePost = async (post: ReviewPost) => {
    const categoryConfig = CATEGORIES[post.contentType]
    const statusConfig = STATUS_CONFIGS[post.status]
    const categoryLabel = categoryConfig?.label ?? post.contentType
    const statusLabel = statusConfig?.label ?? post.status

    const accepted = await showConfirm({
      title: 'Xác nhận xóa bài viết',
      description: (
        <span className="block space-y-4">
          <span className="flex gap-3 rounded-lg border border-[#EF4444]/35 bg-[#3A1111]/45 p-3 text-left shadow-[0_0_0_1px_rgba(239,68,68,0.08)]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#EF4444]/15 text-[#FCA5A5]">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <span className="block min-w-0">
              <span className="block text-sm font-semibold text-[#FCA5A5]">
                Bài viết sẽ bị xóa vĩnh viễn
              </span>
              <span className="mt-1 block text-sm leading-5 text-[#E5E5E5]">
                Hành động này không thể hoàn tác. Vui lòng kiểm tra kỹ thông tin bên dưới trước khi xác nhận.
              </span>
            </span>
          </span>

          <span className="block rounded-lg border border-[#2A2A2A] bg-[#101010] p-3 text-left">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#828283]">
              Bài viết cần xóa
            </span>
            <span className="mt-2 block text-sm font-semibold leading-5 text-foreground break-words">
              {post.title}
            </span>
            <span className="mt-3 flex flex-wrap gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  categoryConfig?.bgClass,
                  categoryConfig?.textClass
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: categoryConfig?.iconColor }}
                />
                {categoryLabel}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  statusConfig?.bgClass,
                  statusConfig?.textClass
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: statusConfig?.iconColor }}
                />
                {statusLabel}
              </span>
            </span>
          </span>
        </span>
      ),
      confirmText: 'Xóa',
      cancelText: 'Hủy bỏ',
      destructive: true,
    })

    if (!accepted) return

    await actions.handleDeletePost(post)
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-6">
        <PostReviewHeader
          activeTab={activeTab}
          statusCounts={data.statusCounts}
          onTabChange={handleTabChange}
          onCreateClick={() => setCreateDialogOpen(true)}
        />

        <div className="flex min-h-0 flex-1 flex-col items-start gap-6 w-full xl:flex-row xl:items-stretch">
          <PostReviewList
            posts={data.activePosts}
            selectedPostId={selection.selectedPostId}
            isLoading={data.listIsLoading}
            showEmpty={data.showListEmpty}
            pagination={data.activePagination}
            onPageChange={setPage}
            onSelectPost={selection.selectPost}
            onDeletePost={handleDeletePost}
          />

          <PostReviewDetailPanel
            post={detail.selectedPost}
            distributionPreview={detail.distributionPreview}
            isLoading={detail.detailIsLoading}
            showEmpty={detail.showDetailEmpty}
            onSaveDraft={actions.handleSaveDraft}
            onApprove={actions.handleApprove}
            onLoadApprovePreview={() => detail.distributionPreviewQuery.refetch().unwrap()}
            onScheduleApprove={actions.handleScheduleApprove}
            onPublish={actions.handlePublish}
            onDiscard={actions.handleDiscard}
            onRevoke={actions.handleRevoke}
            isSaving={actions.isSaving}
            isApproving={actions.isApproving}
            isScheduling={actions.isScheduling}
            isPublishing={actions.isPublishing}
            isRecalling={actions.isRecalling}
          />
        </div>
      </div>

      <CreatePostModal
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={actions.handleCreateNewPost}
        isCreating={actions.isCreatingDraft}
      />
      <Popup />
    </>
  )
}
