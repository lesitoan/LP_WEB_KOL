import { useCallback, useEffect, useMemo } from 'react'
import { useUrlFilterState } from '@/hooks/useUrlFilterState'
import type { PostReviewTab } from '../constants'
import { isLocalDraftId, isValidPostReviewTab } from '../utils'

const POST_REVIEW_URL_INITIAL_VALUES = {
  status: '',
  postId: '',
  page: '',
}

interface SetManyParamsInput {
  status?: PostReviewTab
  postId?: string
  page?: number
}

function parsePageParam(value: string): number {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
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

  const page = useMemo(() => parsePageParam(values.page), [values.page])

  useEffect(() => {
    if (values.status && !isValidPostReviewTab(values.status)) {
      clearFilter('status', { immediate: true })
    }

    if (isLocalDraftId(values.postId)) {
      clearFilter('postId', { immediate: true })
    }

    if (values.page && parsePageParam(values.page) !== Number(values.page)) {
      clearFilter('page', { immediate: true })
    }
  }, [clearFilter, values.page, values.postId, values.status])

  const setActiveTab = useCallback((tab: PostReviewTab) => {
    setMany(
      {
        status: tab === 'ALL' ? '' : tab,
        postId: '',
        page: '',
      },
      { immediate: true }
    )
  }, [setMany])

  const setPage = useCallback((nextPage: number) => {
    const safePage = Math.max(1, Math.floor(nextPage))
    setMany(
      {
        page: safePage <= 1 ? '' : `${safePage}`,
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
    const hasPage = Object.prototype.hasOwnProperty.call(next, 'page')

    setMany(
      {
        ...(hasStatus ? { status: next.status === 'ALL' ? '' : next.status ?? '' } : {}),
        ...(hasPostId ? { postId: next.postId && !isLocalDraftId(next.postId) ? next.postId : '' } : {}),
        ...(hasPage ? { page: next.page && next.page > 1 ? `${next.page}` : '' } : hasStatus ? { page: '' } : {}),
      },
      { immediate: true }
    )
  }, [setMany])

  const clearSelectedPostId = useCallback(() => {
    clearFilter('postId', { immediate: true })
  }, [clearFilter])

  return {
    activeTab,
    page,
    selectedPostIdParam,
    setActiveTab,
    setPage,
    setSelectedPostIdParam,
    setManyParams,
    clearSelectedPostId,
  }
}
