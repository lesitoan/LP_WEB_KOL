export interface AdminInsightDashboardDateRangeQuery {
  startDate?: string
  endDate?: string
}

export interface AdminInsightDashboardForwardByContentTypeQuery extends AdminInsightDashboardDateRangeQuery {
  limit?: number
}

export interface AdminInsightDashboardAdminPerformanceQuery extends AdminInsightDashboardDateRangeQuery {
  page?: number
  limit?: number
}

export interface AdminInsightDashboardShiftCoverageQuery {
  date?: string
  slotMinutes?: 15 | 30 | 60
}

export interface AdminInsightDashboardMetricTrend {
  current: number
  previous: number
  delta: number
  growthPercentage: number
}

export interface AdminInsightDashboardBestContentType {
  contentType: string
  label: string
  deliveredCount: number
  kolPublishedCount: number
  usageRate: number
  previousUsageRate: number
  usageRateDelta: number
}

export interface AdminInsightDashboardSummary {
  comparisonPeriod: {
    current: {
      startDate: string | null
      endDate: string
    }
    previous: {
      startDate: string | null
      endDate: string
    }
  }
  metrics: {
    publishedContents: AdminInsightDashboardMetricTrend
    kolPublishedActions: AdminInsightDashboardMetricTrend
    usageRate: AdminInsightDashboardMetricTrend
    bestContentType: AdminInsightDashboardBestContentType | null
    deliveredActions: AdminInsightDashboardMetricTrend
  }
}

export interface AdminInsightDashboardSlaSummary {
  period: {
    startDate: string | null
    endDate: string
  }
  metrics: {
    apiReceived: number
    handledUnder15Rate: number
    pendingOver30: number
    shiftCheckIns: number
  }
}

export type AdminInsightDashboardShiftCoverageStatus = 'covered' | 'uncovered' | 'planned' | 'empty'

export type AdminInsightDashboardShiftCoverageColor = 'green' | 'red' | 'gray'

export interface AdminInsightDashboardShiftCoverageSlot {
  index: number
  startAt: string
  endAt: string
  label: string
  status: AdminInsightDashboardShiftCoverageStatus
  color: AdminInsightDashboardShiftCoverageColor
  plannedShiftCount: number
  checkInCount: number
  activeAdminCount: number
  adminIds: string[]
}

export interface AdminInsightDashboardShiftCoverage {
  date: string
  timeZone: string
  slotMinutes: number
  range: {
    startAt: string
    endAt: string
  }
  legend: Record<AdminInsightDashboardShiftCoverageStatus, {
    color: AdminInsightDashboardShiftCoverageColor
    label: string
  }>
  summary: {
    totalSlots: number
    coveredSlots: number
    uncoveredSlots: number
    plannedSlots: number
    emptySlots: number
    coveragePercentage: number
  }
  slots: AdminInsightDashboardShiftCoverageSlot[]
}

export interface AdminInsightDashboardForwardByContentTypeItem {
  contentType: string
  label: string
  forwardCount: number
  previousForwardCount: number
  delta: number
  growthPercentage: number
}

export interface AdminInsightDashboardForwardByContentType {
  comparisonPeriod: {
    current: {
      startDate: string | null
      endDate: string
    }
    previous: {
      startDate: string | null
      endDate: string
    }
  }
  items: AdminInsightDashboardForwardByContentTypeItem[]
}

export interface AdminInsightDashboardReceivedForwardRateByContentTypeItem {
  contentType: string
  label: string
  receivedCount: number
  forwardedCount: number
  forwardRate: number
}

export interface AdminInsightDashboardReceivedForwardRateByContentType {
  period: {
    startDate: string | null
    endDate: string
  }
  items: AdminInsightDashboardReceivedForwardRateByContentTypeItem[]
}

export interface AdminInsightDashboardAdminPerformanceItem {
  admin: {
    id: string
    name: string
    email: string
    role: string
  }
  approvedCount: number
  avgResponseTimeMinutes: number
  editPercentage: number
  recallAfterPublishPercentage: number
  activeHours: number | null
}

export interface AdminInsightDashboardAdminPerformance {
  comparisonPeriod: {
    current: {
      startDate: string | null
      endDate: string
    }
    previous: {
      startDate: string | null
      endDate: string
    }
  }
  trend: {
    approvedContents: AdminInsightDashboardMetricTrend
  }
  items: AdminInsightDashboardAdminPerformanceItem[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}
