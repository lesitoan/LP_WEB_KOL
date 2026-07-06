import { useMemo } from 'react'
import {
  useGetAdminInsightDashboardShiftCoverageQuery,
  useGetAdminInsightDashboardSlaSummaryQuery,
} from '@/services/api/admin/insightDashboardApi'
import type {
  AdminInsightDashboardDateRangeQuery,
  AdminInsightDashboardShiftCoverageQuery,
  AdminInsightDashboardShiftCoverageStatus,
} from '@/types/api/adminInsightDashboard'
import type { AdminReviewsDateRange } from './useAdminReviewsUrlState'

export interface ReviewCoverageMetric {
  key: 'apiReceived' | 'handledUnder15Rate' | 'missedOver30' | 'shiftCheckIns'
  label: string
  value: string | number
}

export interface ReviewCoverageTimelineSlot {
  key: string
  label: string
  status: AdminInsightDashboardShiftCoverageStatus
  plannedShiftCount: number
  checkInCount: number
  activeAdminCount: number
}

interface UseReviewCoverageDataInput {
  dateRange: AdminReviewsDateRange
}

function buildCoverageQuery({ dateRange }: UseReviewCoverageDataInput): AdminInsightDashboardDateRangeQuery {
  if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
    return {}
  }

  return {
    startDate: dateRange.from,
    endDate: dateRange.to,
  }
}

function buildShiftCoverageQuery({ dateRange }: UseReviewCoverageDataInput): AdminInsightDashboardShiftCoverageQuery {
  return {
    date: dateRange.isGetAllTime || !dateRange.to ? undefined : dateRange.to,
    slotMinutes: 60,
  }
}

function roundMetric(value: number) {
  return Math.round(value * 10) / 10
}

export function useReviewCoverageData(input: UseReviewCoverageDataInput) {
  const { dateRange } = input
  const slaQueryParams = useMemo(() => buildCoverageQuery({ dateRange }), [dateRange])
  const shiftCoverageQueryParams = useMemo(() => buildShiftCoverageQuery({ dateRange }), [dateRange])
  const slaQuery = useGetAdminInsightDashboardSlaSummaryQuery(slaQueryParams)
  const shiftCoverageQuery = useGetAdminInsightDashboardShiftCoverageQuery(shiftCoverageQueryParams)
  const metrics = slaQuery.data?.metrics

  const items = useMemo<ReviewCoverageMetric[]>(() => {
    return [
      {
        key: 'apiReceived',
        label: 'TIN API VỀ',
        value: metrics ? metrics?.apiReceived : '--',
      },
      {
        key: 'handledUnder15Rate',
        label: 'XỬ LÝ <15’',
        value: metrics ? `${roundMetric(metrics?.handledUnder15Rate)}%` : '--',
      },
      {
        key: 'missedOver30',
        label: 'LỖ HỔNG (>30’ KHÔNG AI XỬ LÝ)',
        value: metrics ? metrics?.pendingOver30 : '--',
      },
      {
        key: 'shiftCheckIns',
        label: 'CA TRỰC GHI NHẬN',
        value: metrics ? metrics?.shiftCheckIns : '--',
      },
    ]
  }, [metrics])

  const timelineSlots = useMemo<ReviewCoverageTimelineSlot[]>(() => {
    const slots = shiftCoverageQuery.data?.slots

    if (!slots || slots.length === 0) {
      return Array.from({ length: 24 }, (_, hour) => ({
        key: `placeholder-${hour}`,
        label: `${String(hour).padStart(2, '0')}:00-${String(hour + 1).padStart(2, '0')}:00`,
        status: 'empty',
        plannedShiftCount: 0,
        checkInCount: 0,
        activeAdminCount: 0,
      }))
    }

    return slots.map((slot) => ({
      key: `${slot.index}-${slot.startAt}`,
      label: slot.label,
      status: slot.status,
      plannedShiftCount: slot.plannedShiftCount,
      checkInCount: slot.checkInCount,
      activeAdminCount: slot.activeAdminCount,
    }))
  }, [shiftCoverageQuery.data])

  return {
    query: slaQuery,
    shiftCoverageQuery,
    items,
    timelineSlots,
    isLoading: slaQuery.isLoading || slaQuery.isFetching || shiftCoverageQuery.isLoading || shiftCoverageQuery.isFetching,
    isError: slaQuery.isError || shiftCoverageQuery.isError,
  }
}
