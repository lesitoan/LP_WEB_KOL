import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminContentActionRequest,
  AdminInsight,
  AdminInsightDetail,
  AdminInsightDistributionPreview,
  AdminInsightDistributionPreviewBody,
  CreateAdminContentActionRequestBody,
  CreateAdminInsightBody,
  GetAdminInsightDistributionPreviewQuery,
  ListAdminContentActionRequestsQuery,
  ListAdminInsightsQuery,
  PaginatedData,
  UpdateAdminInsightBody,
} from '@/types/api/adminInsight'

type AdminInsightsEnvelope = ApiResponse<PaginatedData<AdminInsight>>
type AdminInsightEnvelope = ApiResponse<AdminInsight>
type AdminInsightDetailEnvelope = ApiResponse<AdminInsightDetail>
type AdminInsightDistributionPreviewEnvelope = ApiResponse<AdminInsightDistributionPreview>
type AdminContentActionRequestsEnvelope = ApiResponse<PaginatedData<AdminContentActionRequest>>
type AdminContentActionRequestEnvelope = ApiResponse<AdminContentActionRequest>

function ensureData<T>(payload: ApiResponse<T>, fallback: string): T {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(pickApiMessage(payload || {}, fallback))
  }

  return payload.data
}

function appendIfPresent(params: URLSearchParams, key: string, value: string | number | undefined) {
  if (value !== undefined && value !== null && `${value}`.trim() !== '') {
    params.set(key, `${value}`)
  }
}

export const adminInsightsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminInsights: builder.query<PaginatedData<AdminInsight>, ListAdminInsightsQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', query.page ?? 1)
        appendIfPresent(params, 'limit', query.limit ?? 100)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'contentType', query.contentType)
        appendIfPresent(params, 'sourceType', query.sourceType)
        appendIfPresent(params, 'organizationScope', query.organizationScope)
        appendIfPresent(params, 'fromDate', query.fromDate)
        appendIfPresent(params, 'toDate', query.toDate)
        appendIfPresent(params, 'search', query.search)

        return {
          url: apiV1Path(`/admin/insights?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminInsightsEnvelope) => ensureData(payload, 'Không thể tải danh sách insight'),
      providesTags: ['Insights'],
    }),

    getAdminInsightDetail: builder.query<AdminInsightDetail, string>({
      query: (insightId) => ({
        url: apiV1Path(`/admin/insights/${insightId}`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminInsightDetailEnvelope) => ensureData(payload, 'Không thể tải chi tiết insight'),
      providesTags: (_result, _error, insightId) => [{ type: 'Insights', id: insightId }],
    }),

    getAdminInsightDistributionPreview: builder.query<AdminInsightDistributionPreview, GetAdminInsightDistributionPreviewQuery>({
      query: ({ insightId, scheduledAt }) => {
        const params = new URLSearchParams()
        appendIfPresent(params, 'scheduledAt', scheduledAt)
        const queryString = params.toString()

        return {
          url: apiV1Path(`/admin/insights/${insightId}/distribution-preview${queryString ? `?${queryString}` : ''}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminInsightDistributionPreviewEnvelope) => ensureData(payload, 'Không thể tải preview phân phối insight'),
      providesTags: (_result, _error, { insightId }) => [{ type: 'Insights', id: `${insightId}-distribution-preview` }],
    }),

    previewAdminInsightDistribution: builder.mutation<AdminInsightDistributionPreview, AdminInsightDistributionPreviewBody>({
      query: (body) => ({
        url: apiV1Path('/admin/insights/distribution-preview'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: AdminInsightDistributionPreviewEnvelope) => ensureData(payload, 'KhĂ´ng thá»ƒ preview phĂ¢n phá»‘i insight'),
    }),

    createAdminInsight: builder.mutation<AdminInsight, CreateAdminInsightBody>({
      query: (body) => ({
        url: apiV1Path('/admin/insights'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: AdminInsightEnvelope) => ensureData(payload, 'Không thể tạo insight'),
      invalidatesTags: ['Insights'],
    }),

    updateAdminInsight: builder.mutation<AdminInsight, { insightId: string; body: UpdateAdminInsightBody }>({
      query: ({ insightId, body }) => ({
        url: apiV1Path(`/admin/insights/${insightId}`),
        method: 'PATCH',
        body,
      }),
      transformResponse: (payload: AdminInsightEnvelope) => ensureData(payload, 'Không thể cập nhật insight'),
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    publishAdminInsight: builder.mutation<AdminInsightDetail, { insightId: string }>({
      query: ({ insightId }) => ({
        url: apiV1Path(`/admin/insights/${insightId}/publish`),
        method: 'POST',
      }),
      transformResponse: (payload: AdminInsightDetailEnvelope) => ensureData(payload, 'Không thể đăng insight'),
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    recallAdminInsight: builder.mutation<AdminInsightDetail, { insightId: string }>({
      query: ({ insightId }) => ({
        url: apiV1Path(`/admin/insights/${insightId}/recall`),
        method: 'POST',
      }),
      transformResponse: (payload: AdminInsightDetailEnvelope) => ensureData(payload, 'Không thể thu hồi insight'),
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    listAdminContentActionRequests: builder.query<PaginatedData<AdminContentActionRequest>, ListAdminContentActionRequestsQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', query.page ?? 1)
        appendIfPresent(params, 'limit', query.limit ?? 100)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'contentItemId', query.contentItemId)
        appendIfPresent(params, 'contentType', query.contentType)
        appendIfPresent(params, 'requestedByUserId', query.requestedByUserId)
        appendIfPresent(params, 'fromDate', query.fromDate)
        appendIfPresent(params, 'toDate', query.toDate)

        return {
          url: apiV1Path(`/admin/content-action-requests?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminContentActionRequestsEnvelope) =>
        ensureData(payload, 'Khong the tai danh sach yeu cau xu ly'),
      providesTags: ['Insights'],
    }),

    createAdminInsightActionRequest: builder.mutation<
      AdminContentActionRequest,
      { insightId: string; body: CreateAdminContentActionRequestBody }
    >({
      query: ({ insightId, body }) => ({
        url: apiV1Path(`/admin/insights/${insightId}/action-requests`),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: AdminContentActionRequestEnvelope) =>
        ensureData(payload, 'Khong the tao yeu cau xu ly'),
      invalidatesTags: ['Insights'],
    }),
  }),
})

export const {
  useListAdminInsightsQuery,
  useGetAdminInsightDetailQuery,
  useGetAdminInsightDistributionPreviewQuery,
  usePreviewAdminInsightDistributionMutation,
  useCreateAdminInsightMutation,
  useUpdateAdminInsightMutation,
  usePublishAdminInsightMutation,
  useRecallAdminInsightMutation,
  useListAdminContentActionRequestsQuery,
  useCreateAdminInsightActionRequestMutation,
} = adminInsightsApi
