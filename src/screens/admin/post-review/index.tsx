"use client"

import { useState } from 'react'
import CreatePostModal from './components/CreatePostModal'
import PostReviewDetailPanel from './components/PostReviewDetailPanel'
import PostReviewHeader from './components/PostReviewHeader'
import PostReviewList from './components/PostReviewList'
import { usePostReviewActions } from './hooks/usePostReviewActions'
import { usePostReviewData } from './hooks/usePostReviewData'
import { usePostReviewDetail } from './hooks/usePostReviewDetail'
import { usePostReviewSelection } from './hooks/usePostReviewSelection'
import { usePostReviewUrlState } from './hooks/usePostReviewUrlState'
import type { PostReviewTab, ReviewPost } from './constants'

export default function AdminPostReviewScreen() {
  const [localDraft, setLocalDraft] = useState<ReviewPost | undefined>()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const {
    activeTab,
    selectedPostIdParam,
    setActiveTab,
    setSelectedPostIdParam,
    setManyParams,
    clearSelectedPostId,
  } = usePostReviewUrlState()

  const data = usePostReviewData({
    activeTab,
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
    refetchAll: data.allInsightsQuery.refetch,
    refetchActive: data.activeInsightsQuery.refetch,
    refetchDetail: detail.detailQuery.refetch,
  })

  const handleTabChange = (tab: PostReviewTab) => {
    const count = data.statusCounts[tab] ?? 0
    if (tab !== 'ALL' && count === 0) return
    setActiveTab(tab)
  }

  return (
    <>
      <div className="space-y-6">
        <PostReviewHeader
          activeTab={activeTab}
          statusCounts={data.statusCounts}
          onTabChange={handleTabChange}
          onCreateClick={() => setCreateDialogOpen(true)}
        />

        <div className="flex flex-col xl:flex-row items-start gap-6 w-full min-h-0">
          <PostReviewList
            posts={data.activePosts}
            selectedPostId={selection.selectedPostId}
            isLoading={data.listIsLoading}
            showEmpty={data.showListEmpty}
            onSelectPost={selection.selectPost}
          />

          <PostReviewDetailPanel
            post={detail.selectedPost}
            distributionPreview={detail.distributionPreview}
            isLoading={detail.detailIsLoading}
            showEmpty={detail.showDetailEmpty}
            onSaveDraft={actions.handleSaveDraft}
            onApprove={actions.handleApprove}
            onPublish={actions.handlePublish}
            onDiscard={actions.handleDiscard}
            onRevoke={actions.handleRevoke}
            isSaving={actions.isSaving}
            isApproving={actions.isApproving}
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
    </>
  )
}
