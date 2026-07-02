import { useCallback, useEffect, useMemo } from 'react'
import { useUrlFilterState } from '@/hooks/useUrlFilterState'
import type { ContentAnalyticsDateRange } from './useContentOverviewMetricsData'

const CONTENT_ANALYTICS_DATE_RANGE_INITIAL_VALUES = {
  startDate: '',
  endDate: '',
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

interface DateRangeChangeInput {
  from?: string
  to?: string
  isGetAllTime?: boolean
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

export function useContentAnalyticsDateRangeUrlState() {
  const { values, setMany } = useUrlFilterState({
    initialValues: CONTENT_ANALYTICS_DATE_RANGE_INITIAL_VALUES,
  })

  const hasCompleteRange = Boolean(values.startDate && values.endDate)
  const hasInvalidRange = hasCompleteRange && !isValidDateRange(values.startDate, values.endDate)
  const hasPartialRange = Boolean(values.startDate || values.endDate) && !hasCompleteRange

  useEffect(() => {
    if (!hasPartialRange && !hasInvalidRange) return

    setMany(
      {
        startDate: '',
        endDate: '',
      },
      { immediate: true },
    )
  }, [hasInvalidRange, hasPartialRange, setMany])

  const dateRange = useMemo<ContentAnalyticsDateRange>(() => {
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
        },
        { immediate: true },
      )
      return
    }

    setMany(
      {
        startDate: range.from,
        endDate: range.to,
      },
      { immediate: true },
    )
  }, [setMany])

  return {
    dateRange,
    setDateRange,
  }
}
