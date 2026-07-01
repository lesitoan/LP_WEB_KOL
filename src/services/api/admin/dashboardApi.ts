import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminDashboardGrowthChart,
  AdminDashboardGrowthChartQuery,
  AdminDashboardKolCommissions,
  AdminDashboardKolCommissionsQuery,
  AdminDashboardKolTierDistribution,
  AdminDashboardOverviewStats,
  AdminDashboardOverviewStatsQuery,
} from '@/types/api/adminDashboard'

type AdminDashboardGrowthChartEnvelope = ApiResponse<AdminDashboardGrowthChart>
type AdminDashboardKolTierDistributionEnvelope = ApiResponse<AdminDashboardKolTierDistribution>
type AdminDashboardKolCommissionsEnvelope = ApiResponse<AdminDashboardKolCommissions>
type AdminDashboardOverviewStatsEnvelope = ApiResponse<AdminDashboardOverviewStats>

function ensureData<T>(payload: ApiResponse<T>, fallback: string): T {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(pickApiMessage(payload || {}, fallback))
  }

  return payload.data
}

function appendIfPresent(params: URLSearchParams, key: string, value: string | undefined) {
  if (value !== undefined && value !== null && value.trim() !== '') {
    params.set(key, value)
  }
}

export const adminDashboardApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardOverviewStats: builder.query<AdminDashboardOverviewStats, AdminDashboardOverviewStatsQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'search', query.search)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'startDate', query.startDate)
        appendIfPresent(params, 'endDate', query.endDate)

        const queryString = params.toString()

        return {
          url: apiV1Path(`/admin/dashboard/overview/stats${queryString ? `?${queryString}` : ''}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminDashboardOverviewStatsEnvelope) =>
        ensureData(payload, 'Khong the tai thong ke tong quan dashboard'),
      providesTags: ['Dashboard'],
    }),

    getAdminDashboardGrowthChart: builder.query<AdminDashboardGrowthChart, AdminDashboardGrowthChartQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'search', query.search)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'startDate', query.startDate)
        appendIfPresent(params, 'endDate', query.endDate)

        const queryString = params.toString()

        return {
          url: apiV1Path(`/admin/dashboard/charts/growth${queryString ? `?${queryString}` : ''}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminDashboardGrowthChartEnvelope) =>
        ensureData(payload, 'Khong the tai bieu do tang truong KOL'),
      providesTags: ['Dashboard'],
    }),

    getAdminDashboardKolTierDistribution: builder.query<AdminDashboardKolTierDistribution, void>({
      query: () => ({
        url: apiV1Path('/admin/dashboard/kols/tier-distribution'),
        method: 'GET',
      }),
      transformResponse: (payload: AdminDashboardKolTierDistributionEnvelope) =>
        ensureData(payload, 'Khong the tai thong ke phan bo KOL theo tier'),
      providesTags: ['Dashboard'],
    }),

    getAdminDashboardKolCommissions: builder.query<AdminDashboardKolCommissions, AdminDashboardKolCommissionsQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', String(query.page ?? 1))
        appendIfPresent(params, 'limit', String(query.limit ?? 5))
        appendIfPresent(params, 'search', query.search)
        appendIfPresent(params, 'sortBy', query.sortBy ?? 'totalCommission')
        appendIfPresent(params, 'sortOrder', query.sortOrder ?? 'desc')

        if (typeof query.startDate === 'number') {
          params.set('startDate', String(query.startDate))
        }

        if (typeof query.endDate === 'number') {
          params.set('endDate', String(query.endDate))
        }

        return {
          url: apiV1Path(`/admin/dashboard/kols/commissions?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminDashboardKolCommissionsEnvelope) =>
        ensureData(payload, 'Khong the tai danh sach commission KOL'),
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetAdminDashboardOverviewStatsQuery,
  useGetAdminDashboardGrowthChartQuery,
  useGetAdminDashboardKolCommissionsQuery,
  useGetAdminDashboardKolTierDistributionQuery,
} = adminDashboardApi
