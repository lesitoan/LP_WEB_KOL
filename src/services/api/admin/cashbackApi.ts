import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminCashbackConfig,
  AdminCashbackCycle,
  AdminCashbackPaginatedData,
  AdminCashbackPayout,
  ListAdminCashbackConfigsQuery,
  ListAdminCashbackCyclePayoutsQuery,
  ListAdminCashbackCyclesQuery,
  ListAdminCashbackPayoutsQuery,
} from '@/types/admin/cashback'

type AdminCashbackConfigsEnvelope = ApiResponse<AdminCashbackPaginatedData<AdminCashbackConfig>>
type AdminCashbackConfigEnvelope = ApiResponse<AdminCashbackConfig>
type AdminCashbackCyclesEnvelope = ApiResponse<AdminCashbackPaginatedData<AdminCashbackCycle>>
type AdminCashbackCycleEnvelope = ApiResponse<AdminCashbackCycle>
type AdminCashbackPayoutsEnvelope = ApiResponse<AdminCashbackPaginatedData<AdminCashbackPayout>>
type AdminCashbackPayoutEnvelope = ApiResponse<AdminCashbackPayout>

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const appendIfPresent = (params: URLSearchParams, key: string, value: string | number | undefined) => {
  if (value !== undefined && `${value}`.trim() !== '') {
    params.set(key, String(value))
  }
}

const ensureData = <TData>(payload: ApiResponse<TData>, fallback: string): TData => {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(pickApiMessage(payload || {}, fallback))
  }

  return payload.data
}

const normalizeAppliedConfig = (config: AdminCashbackPayout['appliedConfig']) =>
  config
    ? {
        ...config,
        cashbackRatePct: toNumber(config.cashbackRatePct),
        minPayoutUsd: toNumber(config.minPayoutUsd),
      }
    : config

const normalizeConfig = (config: AdminCashbackConfig): AdminCashbackConfig => ({
  ...config,
  cashbackRatePct: toNumber(config.cashbackRatePct),
  minPayoutUsd: toNumber(config.minPayoutUsd),
})

const normalizeCycle = (cycle: AdminCashbackCycle): AdminCashbackCycle => ({
  ...cycle,
  totalCommissionUsd: toNumber(cycle.totalCommissionUsd),
  totalCashbackUsd: toNumber(cycle.totalCashbackUsd),
})

const normalizePayout = (payout: AdminCashbackPayout): AdminCashbackPayout => ({
  ...payout,
  volumeUsd: payout.volumeUsd == null ? payout.volumeUsd : toNumber(payout.volumeUsd),
  grossFeeUsd: payout.grossFeeUsd == null ? payout.grossFeeUsd : toNumber(payout.grossFeeUsd),
  kolCommissionUsd: toNumber(payout.kolCommissionUsd),
  cashbackAmountUsd: toNumber(payout.cashbackAmountUsd),
  cashbackRatePct: payout.cashbackRatePct == null ? payout.cashbackRatePct : toNumber(payout.cashbackRatePct),
  cashbackCycle: payout.cashbackCycle ? normalizeCycle(payout.cashbackCycle) : payout.cashbackCycle,
  appliedConfig: normalizeAppliedConfig(payout.appliedConfig),
})

export const adminCashbackApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCashbackConfigs: builder.query<AdminCashbackPaginatedData<AdminCashbackConfig>, ListAdminCashbackConfigsQuery>({
      query: (query) => {
        const params = new URLSearchParams({
          page: String(query.page),
          limit: String(query.limit),
        })

        appendIfPresent(params, 'kolId', query.kolId)
        appendIfPresent(params, 'telegramGroupId', query.telegramGroupId)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'distributionCycle', query.distributionCycle)

        return {
          url: apiV1Path(`/admin/cashback/configs?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminCashbackConfigsEnvelope) => {
        const data = ensureData(payload, 'Khong the tai danh sach cau hinh cashback')
        return {
          ...data,
          items: data.items.map(normalizeConfig),
        }
      },
      providesTags: ['Cashback'],
    }),

    getAdminCashbackConfigDetail: builder.query<AdminCashbackConfig, { configId: string }>({
      query: ({ configId }) => ({
        url: apiV1Path(`/admin/cashback/configs/${configId}`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminCashbackConfigEnvelope) =>
        normalizeConfig(ensureData(payload, 'Khong the tai chi tiet cau hinh cashback')),
      providesTags: (_result, _error, { configId }) => [{ type: 'Cashback', id: `config-${configId}` }],
    }),

    getAdminCashbackCycles: builder.query<AdminCashbackPaginatedData<AdminCashbackCycle>, ListAdminCashbackCyclesQuery>({
      query: (query) => {
        const params = new URLSearchParams({
          page: String(query.page),
          limit: String(query.limit),
        })

        appendIfPresent(params, 'kolId', query.kolId)
        appendIfPresent(params, 'cycleType', query.cycleType)
        appendIfPresent(params, 'status', query.status)
        appendIfPresent(params, 'periodStartFrom', query.periodStartFrom)
        appendIfPresent(params, 'periodEndTo', query.periodEndTo)

        return {
          url: apiV1Path(`/admin/cashback/cycles?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminCashbackCyclesEnvelope) => {
        const data = ensureData(payload, 'Khong the tai danh sach chu ky cashback')
        return {
          ...data,
          items: data.items.map(normalizeCycle),
        }
      },
      providesTags: ['Cashback'],
    }),

    getAdminCashbackCycleDetail: builder.query<AdminCashbackCycle, { cycleId: string }>({
      query: ({ cycleId }) => ({
        url: apiV1Path(`/admin/cashback/cycles/${cycleId}`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminCashbackCycleEnvelope) =>
        normalizeCycle(ensureData(payload, 'Khong the tai chi tiet chu ky cashback')),
      providesTags: (_result, _error, { cycleId }) => [{ type: 'Cashback', id: `cycle-${cycleId}` }],
    }),

    getAdminCashbackCyclePayouts: builder.query<
      AdminCashbackPaginatedData<AdminCashbackPayout>,
      { cycleId: string; query: ListAdminCashbackCyclePayoutsQuery }
    >({
      query: ({ cycleId, query }) => {
        const params = new URLSearchParams({
          page: String(query.page),
          limit: String(query.limit),
        })

        appendIfPresent(params, 'memberId', query.memberId)
        appendIfPresent(params, 'telegramGroupId', query.telegramGroupId)
        appendIfPresent(params, 'payoutStatus', query.payoutStatus)

        return {
          url: apiV1Path(`/admin/cashback/cycles/${cycleId}/payouts?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminCashbackPayoutsEnvelope) => {
        const data = ensureData(payload, 'Khong the tai payout theo chu ky cashback')
        return {
          ...data,
          items: data.items.map(normalizePayout),
        }
      },
      providesTags: (_result, _error, { cycleId }) => [{ type: 'Cashback', id: `cycle-${cycleId}-payouts` }],
    }),

    getAdminCashbackPayouts: builder.query<AdminCashbackPaginatedData<AdminCashbackPayout>, ListAdminCashbackPayoutsQuery>({
      query: (query) => {
        const params = new URLSearchParams({
          page: String(query.page),
          limit: String(query.limit),
        })

        appendIfPresent(params, 'kolId', query.kolId)
        appendIfPresent(params, 'memberId', query.memberId)
        appendIfPresent(params, 'cycleId', query.cycleId)
        appendIfPresent(params, 'telegramGroupId', query.telegramGroupId)
        appendIfPresent(params, 'payoutStatus', query.payoutStatus)

        return {
          url: apiV1Path(`/admin/cashback/payouts?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminCashbackPayoutsEnvelope) => {
        const data = ensureData(payload, 'Khong the tai danh sach payout cashback')
        return {
          ...data,
          items: data.items.map(normalizePayout),
        }
      },
      providesTags: ['Cashback'],
    }),

    getAdminCashbackPayoutDetail: builder.query<AdminCashbackPayout, { payoutId: string }>({
      query: ({ payoutId }) => ({
        url: apiV1Path(`/admin/cashback/payouts/${payoutId}`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminCashbackPayoutEnvelope) =>
        normalizePayout(ensureData(payload, 'Khong the tai chi tiet payout cashback')),
      providesTags: (_result, _error, { payoutId }) => [{ type: 'Cashback', id: `payout-${payoutId}` }],
    }),
  }),
})

export const {
  useGetAdminCashbackConfigsQuery,
  useGetAdminCashbackConfigDetailQuery,
  useGetAdminCashbackCyclesQuery,
  useGetAdminCashbackCycleDetailQuery,
  useGetAdminCashbackCyclePayoutsQuery,
  useGetAdminCashbackPayoutsQuery,
  useGetAdminCashbackPayoutDetailQuery,
} = adminCashbackApi
