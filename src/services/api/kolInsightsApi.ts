import { apiV1Path } from './apiPath'
import { api, pickApiMessage } from './baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  KolInsight,
  KolInsightDelivery,
  KolInsightsData,
  KolInsightCustomizationBody,
  ListKolInsightsQuery,
  PublishKolInsightBody,
} from '@/types/api/kolInsight'

type KolInsightsEnvelope = ApiResponse<KolInsightsData>
type KolInsightEnvelope = ApiResponse<KolInsight>
type KolInsightDeliveryEnvelope = ApiResponse<KolInsightDelivery>

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

export const kolInsightsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listKolInsights: builder.query<KolInsightsData, ListKolInsightsQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', query.page ?? 1)
        appendIfPresent(params, 'limit', query.limit ?? 20)
        appendIfPresent(params, 'contentType', query.contentType)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'fromDate', query.fromDate)
        appendIfPresent(params, 'toDate', query.toDate)
        appendIfPresent(params, 'search', query.search)

        return {
          url: apiV1Path(`/kol/insights?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: KolInsightsEnvelope) => ensureData(payload, 'Không thể tải danh sách insight'),
      providesTags: ['Insights'],
    }),

    getKolInsightDetail: builder.query<KolInsight, string>({
      query: (insightId) => ({
        url: apiV1Path(`/kol/insights/${insightId}`),
        method: 'GET',
      }),
      transformResponse: (payload: KolInsightEnvelope) => ensureData(payload, 'Không thể tải chi tiết insight'),
      providesTags: (_result, _error, insightId) => [{ type: 'Insights', id: insightId }],
    }),

    saveKolInsightCustomization: builder.mutation<
      KolInsightDelivery,
      { insightId: string; body: KolInsightCustomizationBody }
    >({
      query: ({ insightId, body }) => ({
        url: apiV1Path(`/kol/insights/${insightId}/customization`),
        method: 'PATCH',
        body,
      }),
      transformResponse: (payload: KolInsightDeliveryEnvelope) => ensureData(payload, 'Không thể lưu chỉnh sửa insight'),
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    publishKolInsight: builder.mutation<KolInsightDelivery, { insightId: string; body: PublishKolInsightBody }>({
      query: ({ insightId, body }) => ({
        url: apiV1Path(`/kol/insights/${insightId}/publish`),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: KolInsightDeliveryEnvelope) => ensureData(payload, 'Không thể đăng insight'),
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),

    skipKolInsight: builder.mutation<KolInsightDelivery, { insightId: string }>({
      query: ({ insightId }) => ({
        url: apiV1Path(`/kol/insights/${insightId}/skip`),
        method: 'POST',
      }),
      transformResponse: (payload: KolInsightDeliveryEnvelope) => ensureData(payload, 'Không thể bỏ qua insight'),
      invalidatesTags: (_result, _error, { insightId }) => ['Insights', { type: 'Insights', id: insightId }],
    }),
  }),
})

export const {
  useListKolInsightsQuery,
  useGetKolInsightDetailQuery,
  useSaveKolInsightCustomizationMutation,
  usePublishKolInsightMutation,
  useSkipKolInsightMutation,
} = kolInsightsApi
