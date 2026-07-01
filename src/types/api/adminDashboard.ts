export type AdminKolStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'PAUSED'

export interface AdminDashboardGrowthChartQuery {
  search?: string
  status?: AdminKolStatus
  startDate?: string
  endDate?: string
}

export interface AdminDashboardOverviewStatsQuery {
  search?: string
  status?: AdminKolStatus
  startDate?: string
  endDate?: string
}

export interface AdminDashboardMetricTrend {
  current: number
  previous: number
  delta: number
  growthPercentage: number
}

export interface AdminDashboardOverviewStats {
  comparisonPeriod: {
    current: {
      startDate: string
      endDate: string
    }
    previous: {
      startDate: string
      endDate: string
    }
  }
  metrics: {
    totalKols: AdminDashboardMetricTrend
    totalMembers: AdminDashboardMetricTrend
  }
}

export type AdminDashboardKolCommissionsSortBy =
  | 'totalCommission'
  | 'totalVolume'
  | 'totalVolumn'
  | 'joinedAt'
  | 'joinAt'

export interface AdminDashboardKolCommissionsQuery {
  page?: number
  limit?: number
  search?: string
  sortBy?: AdminDashboardKolCommissionsSortBy
  sortOrder?: 'asc' | 'desc'
  startDate?: number
  endDate?: number
}

export type AdminDashboardGrowthSeriesKey = 'totalKols' | 'totalMembers'

export interface AdminDashboardGrowthSeries {
  key: AdminDashboardGrowthSeriesKey
  label: string
  values: Array<number | null>
}

export interface AdminDashboardGrowthChart {
  range: {
    startDate: string
    endDate: string
  }
  points: string[]
  series: AdminDashboardGrowthSeries[]
}

export interface AdminDashboardKolTierDistributionItem {
  tierId: string | null
  code: string
  name: string
  iconKey: string | null
  themeKey: string | null
  sortOrder: number
  count: number
}

export interface AdminDashboardKolTierDistribution {
  totalKols: number
  tiers: AdminDashboardKolTierDistributionItem[]
}

export interface AdminDashboardKolCommissionSide {
  volume: number
  commission: number
  commissionRate: number
}

export interface AdminDashboardKolCommissionItem {
  lpexUid: string
  username: string
  fullName: string
  refCode: string
  accountStatus: string
  spot: AdminDashboardKolCommissionSide
  future: AdminDashboardKolCommissionSide
  total: {
    volume: number
    commission: number
  }
  lastCommissionAt: string | null
  joinedAt: string | null
}

export interface AdminDashboardKolCommissions {
  items: AdminDashboardKolCommissionItem[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
  }
}
