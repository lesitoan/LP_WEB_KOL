import { dashboardStats, mockReferrals } from '@/lib/mockData'
import type {
  ApiResponse,
  CashbackGrowthSummary,
  ChartPoint,
  CommissionGrowthSummary,
  DashboardStats,
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
    // Legacy dashboard summary (still used by commissions & referrals screens)
    getDashboardStats: builder.query<DashboardStats, void>({
      queryFn: async () => {
        try {
          return { data: await requestDashboardStats() }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: extractApiErrorMessage(error, 'Không thể tải thống kê dashboard') },
            },
          }
        }
      },
      providesTags: ['Dashboard'],
    }),

    // 1. Member statistics overview
    getMemberOverviewStats: builder.query<MemberOverviewStats, void>({
      query: () => ({
        url: apiV1Path('/kol/members/statistics/overview'),
        method: 'GET',
      }),
      transformResponse: (payload: ApiResponse<MemberOverviewStats>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(
            extractApiErrorMessage(payload, 'Không thể tải thống kê member'),
          )
        }
        return payload.data
      },
      providesTags: ['Dashboard'],
    }),

    // 3. Cashback monthly growth summary
    getCashbackGrowthSummary: builder.query<CashbackGrowthSummary, void>({
      query: () => ({
        url: apiV1Path('/kol/cashback/summary/cashback-growth'),
        method: 'GET',
      }),
      transformResponse: (payload: ApiResponse<CashbackGrowthSummary>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(
            extractApiErrorMessage(payload, 'Không thể tải thống kê cashback'),
          )
        }
        return payload.data
      },
      providesTags: ['Dashboard'],
    }),

    // 4. Commission monthly growth summary
    getCommissionGrowthSummary: builder.query<CommissionGrowthSummary, void>({
      query: () => ({
        url: apiV1Path('/kol/cashback/summary/commission-growth'),
        method: 'GET',
      }),
      transformResponse: (payload: ApiResponse<CommissionGrowthSummary>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(
            extractApiErrorMessage(payload, 'Không thể tải thống kê hoa hồng'),
          )
        }
        return payload.data
      },
      providesTags: ['Dashboard'],
    }),

    getReferralChart: builder.query<ChartPoint[], number>({
      query: (months) => ({
        url: apiV1Path(`/kol/members/statistics/monthly-joins?months=${months}`),
        method: 'GET',
      }),
      transformResponse: (payload: ApiResponse<MemberMonthlyJoinsData>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(extractApiErrorMessage(payload, 'Không thể tải biểu đồ referral'))
        }

        const { monthlyJoins } = payload.data

        return (monthlyJoins || []).map((point) => {
          const monthLabel = `${point.month.toString().padStart(2, '0')}-${
            point.year.toString().slice(-2)
          }`

          return {
            date: monthLabel,
            commission: 0,
            cashback: 0,
            referrals: point.count,
          }
        })
      },
      providesTags: ['Dashboard'],
    }),

    getRecentReferrals: builder.query<ReferralItem[], { limit?: number }>({
      queryFn: async ({ limit = 5 }) => {
        try {
          return { data: await requestRecentReferrals(limit) }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: extractApiErrorMessage(error, 'Không thể tải hoạt động gần đây') },
            },
          }
        }
      },
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetMemberOverviewStatsQuery,
  useGetCashbackGrowthSummaryQuery,
  useGetCommissionGrowthSummaryQuery,
  useGetReferralChartQuery,
  useGetRecentReferralsQuery,
} = dashboardApi
