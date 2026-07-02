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
