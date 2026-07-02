import { useMemo } from 'react'
import { useGetAdminInsightDashboardAdminPerformanceQuery } from '@/services/api/admin/insightDashboardApi'
import type { AdminInsightDashboardAdminPerformanceQuery } from '@/types/api/adminInsightDashboard'
import type { AdminPerformanceRow } from '../constants'
import type { AdminReviewsDateRange } from './useAdminReviewsUrlState'

const ADMIN_PERFORMANCE_LIMIT = 8

interface UseAdminPerformanceDataInput {
  dateRange: AdminReviewsDateRange
  page: number
}

function buildAdminPerformanceQuery({
  dateRange,
  page,
}: UseAdminPerformanceDataInput): AdminInsightDashboardAdminPerformanceQuery {
  const baseQuery = {
    page,
    limit: ADMIN_PERFORMANCE_LIMIT,
  }

  if (dateRange.isGetAllTime || !dateRange.from || !dateRange.to) {
    return baseQuery
  }

  return {
    ...baseQuery,
    startDate: dateRange.from,
    endDate: dateRange.to,
  }
}

function roundMetric(value: number) {
  return Math.round(value * 10) / 10
}

export function useAdminPerformanceData(input: UseAdminPerformanceDataInput) {
  const queryParams = useMemo(() => buildAdminPerformanceQuery(input), [input])
  const query = useGetAdminInsightDashboardAdminPerformanceQuery(queryParams)

  const rows = useMemo<AdminPerformanceRow[]>(() => {
    const items = query.data?.items ?? []

    return items.map((item) => ({
      id: item.admin.id,
      name: item.admin.name,
      avatarColor: '#9B692C',
      reviewedCount: item.approvedCount,
      avgResponseTime: roundMetric(item.avgResponseTimeMinutes),
      editRate: roundMetric(item.editPercentage),
      recallRate: roundMetric(item.recallAfterPublishPercentage),
      activeHours: item.activeHours === null ? null : roundMetric(item.activeHours),
    }))
  }, [query.data])

  const pagination = query.data?.pagination ?? {
    page: input.page,
    limit: ADMIN_PERFORMANCE_LIMIT,
    totalItems: 0,
    totalPages: 1,
  }

  return {
    query,
    rows,
    pagination,
    isLoading: query.isLoading || query.isFetching,
    showEmpty: !query.isLoading && !query.isFetching && (query.isError || rows.length === 0),
  }
}
