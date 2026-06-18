import { dashboardStats, mockReferrals } from '@/lib/mockData'
import type {
  ApiResponse,
  CashbackGrowthSummary,
  ChartPoint,
  CommissionGrowthSummary,
  DashboardStats,
  KolDashboardGroupSummaryQuery,
  KolDashboardSummary,
  KolDashboardSummaryQuery,
  KolDashboardStats,
  KolRecentActivitiesQuery,
  KolRecentActivityItem,
  MemberMonthlyJoinsData,
  MemberOverviewStats,
  ReferralItem,
} from '@/types/api'
import { api, extractApiErrorMessage } from './baseApi'
import { apiV1Path } from './apiPath'

async function requestDashboardStats(): Promise<DashboardStats> {
  return { ...dashboardStats }
}

async function requestRecentReferrals(limit = 5): Promise<ReferralItem[]> {
  return mockReferrals.slice(0, limit).map((r) => ({
    ...r,
    registeredAt: r.registeredAt.toISOString(),
  }))
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({


    getKolDashboardSummary: builder.query<KolDashboardSummary, KolDashboardSummaryQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()

        if (params?.startDate) {
          searchParams.set('startDate', params.startDate)
        }

        if (params?.endDate) {
          searchParams.set('endDate', params.endDate)
        }

        const queryString = searchParams.toString()

        return {
          url: `${apiV1Path('/kol/dashboard')}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (payload: ApiResponse<KolDashboardSummary>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(extractApiErrorMessage(payload, 'Không thể tải tổng quan dashboard'))
        }

        return payload.data
      },
      providesTags: ['Dashboard'],
    }),

    getKolDashboardStats: builder.query<KolDashboardStats, KolDashboardGroupSummaryQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()

        if (params?.startDate) {
          searchParams.set('startDate', params.startDate)
        }

        if (params?.endDate) {
          searchParams.set('endDate', params.endDate)
        }

        if (params?.groupId) {
          searchParams.set('groupId', params.groupId)
        }

        const queryString = searchParams.toString()

        return {
          url: `${apiV1Path('/kol/dashboard/stats')}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (payload: ApiResponse<KolDashboardStats>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(extractApiErrorMessage(payload, 'Không thể tải thống kê dashboard'))
        }

        return payload.data
      },
      providesTags: ['Dashboard'],
    }),

    getKolRecentActivities: builder.query<KolRecentActivityItem[], KolRecentActivitiesQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()

        if (params?.limit) {
          searchParams.set('limit', String(params.limit))
        }

        const queryString = searchParams.toString()

        return {
          url: `${apiV1Path('/kol/activities/recent')}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (payload: ApiResponse<KolRecentActivityItem[]>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(extractApiErrorMessage(payload, 'Không thể tải hoạt động gần đây'))
        }

        return payload.data
      },
      providesTags: ['Dashboard'],
    }),

    // 1. Member statistics overview
    // getMemberOverviewStats: builder.query<MemberOverviewStats, void>({
    //   query: () => ({
    //     url: apiV1Path('/kol/members/statistics/overview'),
    //     method: 'GET',
    //   }),
    //   transformResponse: (payload: ApiResponse<MemberOverviewStats>) => {
    //     if (!payload || payload.status !== 'success' || !payload.data) {
    //       throw new Error(
    //         extractApiErrorMessage(payload, 'Không thể tải thống kê member'),
    //       )
    //     }
    //     return payload.data
    //   },
    //   providesTags: ['Dashboard'],
    // }),

    // 3. Cashback monthly growth summary
    // getCashbackGrowthSummary: builder.query<CashbackGrowthSummary, void>({
    //   query: () => ({
    //     url: apiV1Path('/kol/cashback/summary/cashback-growth'),
    //     method: 'GET',
    //   }),
    //   transformResponse: (payload: ApiResponse<CashbackGrowthSummary>) => {
    //     if (!payload || payload.status !== 'success' || !payload.data) {
    //       throw new Error(
    //         extractApiErrorMessage(payload, 'Không thể tải thống kê cashback'),
    //       )
    //     }
    //     return payload.data
    //   },
    //   providesTags: ['Dashboard'],
    // }),

    // 4. Commission monthly growth summary
    // getCommissionGrowthSummary: builder.query<CommissionGrowthSummary, void>({
    //   query: () => ({
    //     url: apiV1Path('/kol/cashback/summary/commission-growth'),
    //     method: 'GET',
    //   }),
    //   transformResponse: (payload: ApiResponse<CommissionGrowthSummary>) => {
    //     if (!payload || payload.status !== 'success' || !payload.data) {
    //       throw new Error(
    //         extractApiErrorMessage(payload, 'Không thể tải thống kê hoa hồng'),
    //       )
    //     }
    //     return payload.data
    //   },
    //   providesTags: ['Dashboard'],
    // }),

    // getReferralChart: builder.query<ChartPoint[], number>({
    //   query: (months) => ({
    //     url: apiV1Path(`/kol/members/statistics/monthly-joins?months=${months}`),
    //     method: 'GET',
    //   }),
    //   transformResponse: (payload: ApiResponse<MemberMonthlyJoinsData>) => {
    //     if (!payload || payload.status !== 'success' || !payload.data) {
    //       throw new Error(extractApiErrorMessage(payload, 'Không thể tải biểu đồ referral'))
    //     }

    //     const { monthlyJoins } = payload.data

    //     return (monthlyJoins || []).map((point) => {
    //       const monthLabel = `${point.month.toString().padStart(2, '0')}-${
    //         point.year.toString().slice(-2)
    //       }`

    //       return {
    //         date: monthLabel,
    //         commission: 0,
    //         cashback: 0,
    //         referrals: point.count,
    //       }
    //     })
    //   },
    //   providesTags: ['Dashboard'],
    // }),
  }),
})

export const {
  useGetKolDashboardStatsQuery,
  useGetKolDashboardSummaryQuery,
  useGetKolRecentActivitiesQuery,
  // useGetMemberOverviewStatsQuery,
  // useGetCashbackGrowthSummaryQuery,
  // useGetCommissionGrowthSummaryQuery,
  // useGetReferralChartQuery,
} = dashboardApi
