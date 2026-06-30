import { useEffect, useState } from 'react'
import type { AdminInsight } from '@/types/api/adminInsight'
import type { PostReviewTab, ReviewPost } from '../constants'

interface UsePostReviewSelectionParams {
  activeTab: PostReviewTab
  activeItems: AdminInsight[]
  localDraft: ReviewPost | undefined
  localDraftVisible: boolean
  isFetching: boolean
  selectedPostIdParam: string | undefined
  setSelectedPostIdParam: (postId: string | undefined) => void
  clearSelectedPostId: () => void
}

export function usePostReviewSelection({
  activeTab,
  activeItems,
  localDraft,
  localDraftVisible,
  isFetching,
  selectedPostIdParam,
  setSelectedPostIdParam,
  clearSelectedPostId,
}: UsePostReviewSelectionParams) {
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(selectedPostIdParam)

  useEffect(() => {
    if (isFetching) return

    if (localDraftVisible && localDraft) {
      setSelectedPostId(localDraft.id)
      clearSelectedPostId()
      return
    }

    if (activeItems.length === 0) {
      setSelectedPostId(undefined)
      clearSelectedPostId()
      return
    }

    if (selectedPostIdParam && activeItems.some((item) => item.id === selectedPostIdParam)) {
      setSelectedPostId(selectedPostIdParam)
      return
    }

    const fallbackId = activeItems[0].id
    setSelectedPostId(fallbackId)
    setSelectedPostIdParam(fallbackId)
  }, [
    activeItems,
    activeTab,
    clearSelectedPostId,
    isFetching,
    localDraft,
    localDraftVisible,
    selectedPostIdParam,
    setSelectedPostIdParam,
  ])

  const selectPost = (post: ReviewPost) => {
    setSelectedPostId(post.id)

    if (post.isLocalDraft) {
      clearSelectedPostId()
      return
    }

    setSelectedPostIdParam(post.id)
  }

  const clearSelection = () => {
    setSelectedPostId(undefined)
    clearSelectedPostId()
  }

  return {
    selectedPostId,
    selectPost,
    clearSelection,
  }
}
