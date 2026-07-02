import { useCallback, useEffect, useMemo } from 'react'
import { useUrlFilterState } from '@/hooks/useUrlFilterState'

const ADMIN_REVIEWS_INITIAL_VALUES = {
  startDate: '',
  endDate: '',
  page: '',
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

interface DateRangeChangeInput {
  from?: string
  to?: string
  isGetAllTime?: boolean
}

export interface AdminReviewsDateRange {
  from: string
  to: string
  isGetAllTime: boolean
}

function isValidDateOnly(value: string) {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime())
}

function isValidDateRange(startDate: string, endDate: string) {
  if (!isValidDateOnly(startDate) || !isValidDateOnly(endDate)) {
    return false
  }

  return new Date(startDate).getTime() <= new Date(endDate).getTime()
}

function parsePage(value: string) {
  const page = Number.parseInt(value, 10)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export function useAdminReviewsUrlState() {
  const { values, setMany, setFilter } = useUrlFilterState({
    initialValues: ADMIN_REVIEWS_INITIAL_VALUES,
  })

  const hasCompleteRange = Boolean(values.startDate && values.endDate)
  const hasInvalidRange = hasCompleteRange && !isValidDateRange(values.startDate, values.endDate)
  const hasPartialRange = Boolean(values.startDate || values.endDate) && !hasCompleteRange
  const page = parsePage(values.page)

  useEffect(() => {
    if (!hasPartialRange && !hasInvalidRange) return

    setMany(
      {
        startDate: '',
        endDate: '',
        page: '',
      },
      { immediate: true },
    )
  }, [hasInvalidRange, hasPartialRange, setMany])

  useEffect(() => {
    if (!values.page || page > 1) return

    setFilter('page', '', { immediate: true })
  }, [page, setFilter, values.page])

  const dateRange = useMemo<AdminReviewsDateRange>(() => {
    if (!hasCompleteRange || hasInvalidRange) {
      return {
        from: '',
        to: '',
        isGetAllTime: true,
      }
    }

    return {
      from: values.startDate,
      to: values.endDate,
      isGetAllTime: false,
    }
  }, [hasCompleteRange, hasInvalidRange, values.endDate, values.startDate])

  const setDateRange = useCallback((range: DateRangeChangeInput) => {
    if (range.isGetAllTime || !range.from || !range.to) {
      setMany(
        {
          startDate: '',
          endDate: '',
          page: '',
        },
        { immediate: true },
      )
      return
    }

    setMany(
      {
        startDate: range.from,
        endDate: range.to,
        page: '',
      },
      { immediate: true },
    )
  }, [setMany])

  const setPage = useCallback((nextPage: number) => {
    setFilter('page', nextPage > 1 ? String(nextPage) : '', { immediate: true })
  }, [setFilter])

  return {
    dateRange,
    page,
    setDateRange,
    setPage,
  }
}
