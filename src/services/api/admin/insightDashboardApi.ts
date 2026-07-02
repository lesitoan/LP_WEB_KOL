import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminInsightDashboardAdminPerformance,
  AdminInsightDashboardAdminPerformanceQuery,
  AdminInsightDashboardDateRangeQuery,
  AdminInsightDashboardForwardByContentType,
  AdminInsightDashboardForwardByContentTypeQuery,
  AdminInsightDashboardSummary,
} from '@/types/api/adminInsightDashboard'

type AdminInsightDashboardSummaryEnvelope = ApiResponse<AdminInsightDashboardSummary>
type AdminInsightDashboardForwardByContentTypeEnvelope = ApiResponse<AdminInsightDashboardForwardByContentType>
type AdminInsightDashboardAdminPerformanceEnvelope = ApiResponse<AdminInsightDashboardAdminPerformance>

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

function appendNumberIfPresent(params: URLSearchParams, key: string, value: number | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    params.set(key, String(value))
  }
}

export const adminInsightDashboardApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminInsightDashboardSummary: builder.query<
      AdminInsightDashboardSummary,
      AdminInsightDashboardDateRangeQuery | void
    >({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'startDate', query.startDate)
        appendIfPresent(params, 'endDate', query.endDate)

        const queryString = params.toString()

        return {
          url: apiV1Path(`/admin/insight-dashboard/summary${queryString ? `?${queryString}` : ''}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminInsightDashboardSummaryEnvelope) =>
        ensureData(payload, 'Khong the tai chi so tong quan insight'),
      providesTags: ['Insights'],
    }),
    getAdminInsightDashboardForwardByContentType: builder.query<
      AdminInsightDashboardForwardByContentType,
      AdminInsightDashboardForwardByContentTypeQuery | void
    >({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'startDate', query.startDate)
        appendIfPresent(params, 'endDate', query.endDate)
        appendNumberIfPresent(params, 'limit', query.limit)

        const queryString = params.toString()

        return {
          url: apiV1Path(`/admin/insight-dashboard/forward-by-content-type${queryString ? `?${queryString}` : ''}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminInsightDashboardForwardByContentTypeEnvelope) =>
        ensureData(payload, 'Khong the tai luot forward theo loai noi dung'),
      providesTags: ['Insights'],
    }),
    getAdminInsightDashboardAdminPerformance: builder.query<
      AdminInsightDashboardAdminPerformance,
      AdminInsightDashboardAdminPerformanceQuery | void
    >({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'startDate', query.startDate)
        appendIfPresent(params, 'endDate', query.endDate)
        appendNumberIfPresent(params, 'page', query.page)
        appendNumberIfPresent(params, 'limit', query.limit)

        const queryString = params.toString()

        return {
          url: apiV1Path(`/admin/insight-dashboard/admin-performance${queryString ? `?${queryString}` : ''}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminInsightDashboardAdminPerformanceEnvelope) =>
        ensureData(payload, 'Khong the tai hieu suat theo tung admin'),
      providesTags: ['Insights'],
    }),
  }),
})

export const {
  useGetAdminInsightDashboardAdminPerformanceQuery,
  useGetAdminInsightDashboardForwardByContentTypeQuery,
  useGetAdminInsightDashboardSummaryQuery,
} = adminInsightDashboardApi
