import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminContentActionRequest,
  AdminInsight,
  AdminInsightDetail,
  AdminInsightDistributionPreview,
  AdminInsightDistributionPreviewBody,
  AdminInsightDistributionResult,
  AdminInsightRecallResult,
  AdminInsightStatusStats,
  CreateAdminContentActionRequestBody,
  CreateAdminInsightBody,
  GetAdminInsightDistributionPreviewQuery,
  ListAdminContentActionRequestsQuery,
  ListAdminInsightsQuery,
  PaginatedData,
  ScheduleAdminInsightBody,
  UpdateAdminInsightBody,
} from '@/types/api/adminInsight'

type AdminInsightsEnvelope = ApiResponse<PaginatedData<AdminInsight>>
type AdminInsightEnvelope = ApiResponse<AdminInsight>
type AdminInsightDetailEnvelope = ApiResponse<AdminInsightDetail>
type AdminInsightDistributionResultEnvelope = ApiResponse<AdminInsightDistributionResult>
type AdminInsightRecallResultEnvelope = ApiResponse<AdminInsightRecallResult>
type AdminInsightDistributionPreviewEnvelope = ApiResponse<AdminInsightDistributionPreview>
type AdminInsightStatusStatsEnvelope = ApiResponse<AdminInsightStatusStats>
type AdminContentActionRequestsEnvelope = ApiResponse<PaginatedData<AdminContentActionRequest>>
type AdminContentActionRequestEnvelope = ApiResponse<AdminContentActionRequest>
type DeleteAdminInsightEnvelope = ApiResponse<null>
type AdminInsightImageUploadEnvelope = ApiResponse<{ imageUrl: string }>

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

    getAdminInsightStatusStats: builder.query<AdminInsightStatusStats, void>({
      query: () => ({
        url: apiV1Path('/admin/insights/stats/by-status'),
        method: 'GET',
      }),
      transformResponse: (payload: AdminInsightStatusStatsEnvelope) =>
        ensureData(payload, 'Không thể tải thống kê trạng thái insight'),
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

    uploadAdminInsightImage: builder.mutation<{ imageUrl: string }, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('image', file)

        return {
          url: apiV1Path('/admin/insights/images'),
          method: 'POST',
          body: formData,
          headers: {
            'x-skip-json-content-type': 'true',
          },
        }
      },
      transformResponse: (payload: AdminInsightImageUploadEnvelope) => ensureData(payload, 'Khong the upload anh insight'),
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

    deleteAdminInsight: builder.mutation<void, { insightId: string }>({
      query: ({ insightId }) => ({
        url: apiV1Path(`/admin/insights/${insightId}`),
        method: 'DELETE',
      }),
      transformResponse: (payload: DeleteAdminInsightEnvelope | undefined) => {
        if (payload && payload.status !== 'success') {
          throw new Error(pickApiMessage(payload || {}, 'Không thể xóa insight'))
        }
      },
      invalidatesTags: ['Insights'],
    }),

    publishAdminInsight: builder.mutation<AdminInsightDetail, { insightId: string }>({
      query: ({ insightId }) => ({
        url: apiV1Path(`/admin/insights/${insightId}/publish`),
        method: 'POST',
        body: { pushlishNow: true },
      }),
      transformResponse: (payload: AdminInsightDistributionResultEnvelope) =>
        ensureData(payload, 'Không thể đăng insight').insight,
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    approveAdminInsight: builder.mutation<AdminInsightDetail, { insightId: string }>({
      query: ({ insightId }) => ({
        url: apiV1Path(`/admin/insights/${insightId}/approve`),
        method: 'POST',
      }),
      transformResponse: (payload: AdminInsightDistributionResultEnvelope) =>
        ensureData(payload, 'Không thể duyệt insight').insight,
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    scheduleAdminInsight: builder.mutation<AdminInsightDetail, { insightId: string; body: ScheduleAdminInsightBody }>({
      query: ({ insightId, body }) => ({
        url: apiV1Path(`/admin/insights/${insightId}/publish`),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: AdminInsightDistributionResultEnvelope) =>
        ensureData(payload, 'Không thể duyệt insight').insight,
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    recallAdminInsight: builder.mutation<AdminInsightDetail, { insightId: string }>({
      query: ({ insightId }) => ({
        url: apiV1Path(`/admin/insights/${insightId}/revoke`),
        method: 'POST',
      }),
      transformResponse: (payload: AdminInsightRecallResultEnvelope) =>
        ensureData(payload, 'Không thể thu hồi insight').insight,
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
  useGetAdminInsightStatusStatsQuery,
  useGetAdminInsightDetailQuery,
  useGetAdminInsightDistributionPreviewQuery,
  usePreviewAdminInsightDistributionMutation,
  useCreateAdminInsightMutation,
  useUploadAdminInsightImageMutation,
  useUpdateAdminInsightMutation,
  useDeleteAdminInsightMutation,
  usePublishAdminInsightMutation,
  useApproveAdminInsightMutation,
  useScheduleAdminInsightMutation,
  useRecallAdminInsightMutation,
  useListAdminContentActionRequestsQuery,
  useCreateAdminInsightActionRequestMutation,
} = adminInsightsApi
