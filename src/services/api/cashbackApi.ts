import { apiV1Path } from './apiPath'
import { api } from './baseApi'
import type {
  ApiResponse,
  CashbackConfigData,
  CashbackCycleData,
  CashbackPayoutData,
  CashbackSummaryData,
  CashbackChartData,
  KolCashbackCommissionData,
  CreateCashbackConfigBody,
  ListCashbackConfigsQuery,
  ListCashbackCyclePayoutsQuery,
  ListCashbackCyclesQuery,
  ListCashbackPayoutsQuery,
  PaginatedData,
  UpdateCashbackConfigBody,
  ChartPoint,
} from '@/types/api'

type CashbackSummaryEnvelope = ApiResponse<CashbackSummaryData>
type KolCashbackCommissionEnvelope = ApiResponse<KolCashbackCommissionData>
type CashbackConfigEnvelope = ApiResponse<CashbackConfigData>
type CashbackConfigsEnvelope = ApiResponse<PaginatedData<CashbackConfigData>>
type CashbackCycleEnvelope = ApiResponse<CashbackCycleData>
type CashbackCyclesEnvelope = ApiResponse<PaginatedData<CashbackCycleData>>
type CashbackPayoutEnvelope = ApiResponse<CashbackPayoutData>
type CashbackPayoutsEnvelope = ApiResponse<PaginatedData<CashbackPayoutData>>
type CashbackChartEnvelope = ApiResponse<CashbackChartData>

function ensureData<T>(payload: ApiResponse<T>, fallback: string): T {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(payload?.externalMessage || fallback)
  }

  return payload.data
}

function appendIfPresent(params: URLSearchParams, key: string, value: string | number | undefined) {
  if (value !== undefined && value !== null && `${value}`.trim() !== '') {
    params.set(key, `${value}`)
  }
}

export const cashbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCashbackSummary: builder.query<CashbackSummaryData, void>({
      query: () => ({
        url: apiV1Path('/kol/cashback/summary'),
        method: 'GET',
      }),
      transformResponse: (payload: CashbackSummaryEnvelope) => ensureData(payload, 'Không thể tải tổng quan cashback'),
      providesTags: ['Cashback'],
    }),

    getCashbackCommissionChart: builder.query<ChartPoint[], number | void>({
      query: (days = 30) => ({
        url: apiV1Path(`/kol/cashback/summary/chart?days=${days}`),
        method: 'GET',
      }),
      transformResponse: (payload: CashbackChartEnvelope) => {
        const data = ensureData(payload, 'Không thể tải biểu đồ cashback & hoa hồng')

        return data.dailyChart.map((point) => {
          const date = new Date(point.date)
          const formattedDate = Number.isNaN(date.getTime())
            ? point.date
            : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })

          return {
            date: formattedDate,
            commission: point.commissionUsd,
            cashback: point.cashbackUsd,
            referrals: 0,
          }
        })
      },
      providesTags: ['Dashboard'],
    }),

    getKolCashbackCommission: builder.query<KolCashbackCommissionData, { lpexUid: string }>({
      query: ({ lpexUid }) => {
        const params = new URLSearchParams()
        appendIfPresent(params, 'lpexUid', lpexUid)

        return {
          url: apiV1Path(`/kol/cashback/commission?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: KolCashbackCommissionEnvelope) => ensureData(payload, 'Không thể tải hoa hồng cashback của KOL'),
      providesTags: ['Cashback'],
    }),

    listCashbackConfigs: builder.query<PaginatedData<CashbackConfigData>, ListCashbackConfigsQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', query.page ?? 1)
        appendIfPresent(params, 'limit', query.limit ?? 20)
        appendIfPresent(params, 'telegramGroupId', query.telegramGroupId)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'distributionCycle', query.distributionCycle)

        return {
          url: apiV1Path(`/kol/cashback/configs?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: CashbackConfigsEnvelope) => ensureData(payload, 'Không thể tải danh sách config cashback'),
      providesTags: ['Cashback'],
    }),

    getCashbackConfigDetail: builder.query<CashbackConfigData, string>({
      query: (configId) => ({
        url: apiV1Path(`/kol/cashback/configs/${configId}`),
        method: 'GET',
      }),
      transformResponse: (payload: CashbackConfigEnvelope) => ensureData(payload, 'Không thể tải chi tiết config cashback'),
      providesTags: ['Cashback'],
    }),

    createCashbackConfig: builder.mutation<CashbackConfigData, CreateCashbackConfigBody>({
      query: (data) => ({
        url: apiV1Path('/kol/cashback/configs'),
        method: 'POST',
        body: data,
      }),
      transformResponse: (payload: CashbackConfigEnvelope) => ensureData(payload, 'Không thể tạo config cashback'),
      invalidatesTags: ['Cashback'],
    }),

    updateCashbackConfig: builder.mutation<CashbackConfigData, { configId: string; data: UpdateCashbackConfigBody }>({
      query: ({ configId, data }) => ({
        url: apiV1Path(`/kol/cashback/configs/${configId}`),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (payload: CashbackConfigEnvelope) => ensureData(payload, 'Không thể cập nhật config cashback'),
      invalidatesTags: ['Cashback'],
    }),

    listCashbackCycles: builder.query<PaginatedData<CashbackCycleData>, ListCashbackCyclesQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', query.page ?? 1)
        appendIfPresent(params, 'limit', query.limit ?? 20)
        appendIfPresent(params, 'cycleType', query.cycleType)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'periodStartFrom', query.periodStartFrom)
        appendIfPresent(params, 'periodEndTo', query.periodEndTo)

        return {
          url: apiV1Path(`/kol/cashback/cycles?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: CashbackCyclesEnvelope) => ensureData(payload, 'Không thể tải danh sách cycle cashback'),
      providesTags: ['Cashback'],
    }),

    getCashbackCycleDetail: builder.query<CashbackCycleData, string>({
      query: (cycleId) => ({
        url: apiV1Path(`/kol/cashback/cycles/${cycleId}`),
        method: 'GET',
      }),
      transformResponse: (payload: CashbackCycleEnvelope) => ensureData(payload, 'Không thể tải chi tiết cycle cashback'),
      providesTags: ['Cashback'],
    }),

    listCashbackCyclePayouts: builder.query<PaginatedData<CashbackPayoutData>, { cycleId: string; query?: ListCashbackCyclePayoutsQuery }>({
      query: ({ cycleId, query }) => {
        const params = new URLSearchParams()
        const value = query ?? {}

        appendIfPresent(params, 'page', value.page ?? 1)
        appendIfPresent(params, 'limit', value.limit ?? 20)
        appendIfPresent(params, 'memberId', value.memberId)
        appendIfPresent(params, 'telegramGroupId', value.telegramGroupId)
        appendIfPresent(params, 'payoutStatus', value.payoutStatus)

        return {
          url: apiV1Path(`/kol/cashback/cycles/${cycleId}/payouts?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: CashbackPayoutsEnvelope) => ensureData(payload, 'Không thể tải payout theo cycle'),
      providesTags: ['Cashback'],
    }),

    listCashbackPayouts: builder.query<PaginatedData<CashbackPayoutData>, ListCashbackPayoutsQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', query.page ?? 1)
        appendIfPresent(params, 'limit', query.limit ?? 20)
        appendIfPresent(params, 'memberId', query.memberId)
        appendIfPresent(params, 'cycleId', query.cycleId)
        appendIfPresent(params, 'telegramGroupId', query.telegramGroupId)
        appendIfPresent(params, 'payoutStatus', query.payoutStatus)

        return {
          url: apiV1Path(`/kol/cashback/payouts?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: CashbackPayoutsEnvelope) => ensureData(payload, 'Không thể tải danh sách payout cashback'),
      providesTags: ['Cashback'],
    }),

    getCashbackPayoutDetail: builder.query<CashbackPayoutData, string>({
      query: (payoutId) => ({
        url: apiV1Path(`/kol/cashback/payouts/${payoutId}`),
        method: 'GET',
      }),
      transformResponse: (payload: CashbackPayoutEnvelope) => ensureData(payload, 'Không thể tải chi tiết payout cashback'),
      providesTags: ['Cashback'],
    }),
  }),
})

export const {
  useGetCashbackSummaryQuery,
  useGetCashbackCommissionChartQuery,
  useGetKolCashbackCommissionQuery,
  useListCashbackConfigsQuery,
  useGetCashbackConfigDetailQuery,
  useCreateCashbackConfigMutation,
  useUpdateCashbackConfigMutation,
  useListCashbackCyclesQuery,
  useGetCashbackCycleDetailQuery,
  useListCashbackCyclePayoutsQuery,
  useListCashbackPayoutsQuery,
  useGetCashbackPayoutDetailQuery,
} = cashbackApi
