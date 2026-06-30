import { useCallback, useEffect, useMemo } from 'react'
import { useUrlFilterState } from '@/hooks/useUrlFilterState'
import type { PostReviewTab } from '../constants'
import { isLocalDraftId, isValidPostReviewTab } from '../utils'

const POST_REVIEW_URL_INITIAL_VALUES = {
  status: '',
  postId: '',
}

interface SetManyParamsInput {
  status?: PostReviewTab
  postId?: string
}

export function usePostReviewUrlState() {
  const { values, setFilter, setMany, clearFilter } = useUrlFilterState({
    initialValues: POST_REVIEW_URL_INITIAL_VALUES,
  })

  const activeTab = useMemo<PostReviewTab>(() => {
    if (!values.status) return 'ALL'
    return isValidPostReviewTab(values.status) ? values.status : 'ALL'
  }, [values.status])

  const selectedPostIdParam = useMemo(() => {
    if (!values.postId || isLocalDraftId(values.postId)) return undefined
    return values.postId
  }, [values.postId])

  useEffect(() => {
    if (values.status && !isValidPostReviewTab(values.status)) {
      clearFilter('status', { immediate: true })
    }

    if (isLocalDraftId(values.postId)) {
      clearFilter('postId', { immediate: true })
    }
  }, [clearFilter, values.postId, values.status])

  const setActiveTab = useCallback((tab: PostReviewTab) => {
    setMany(
      {
        status: tab === 'ALL' ? '' : tab,
        postId: '',
      },
      { immediate: true }
    )
  }, [setMany])

  const setSelectedPostIdParam = useCallback((postId: string | undefined) => {
    if (isLocalDraftId(postId)) {
      clearFilter('postId', { immediate: true })
      return
    }

    setFilter('postId', postId ?? '', { immediate: true })
  }, [clearFilter, setFilter])

  const setManyParams = useCallback((next: SetManyParamsInput) => {
    const hasStatus = Object.prototype.hasOwnProperty.call(next, 'status')
    const hasPostId = Object.prototype.hasOwnProperty.call(next, 'postId')

    setMany(
      {
        ...(hasStatus ? { status: next.status === 'ALL' ? '' : next.status ?? '' } : {}),
        ...(hasPostId ? { postId: next.postId && !isLocalDraftId(next.postId) ? next.postId : '' } : {}),
      },
      { immediate: true }
    )
  }, [setMany])

  const clearSelectedPostId = useCallback(() => {
    clearFilter('postId', { immediate: true })
  }, [clearFilter])

  return {
    activeTab,
    selectedPostIdParam,
    setActiveTab,
    setSelectedPostIdParam,
    setManyParams,
    clearSelectedPostId,
  }
}
