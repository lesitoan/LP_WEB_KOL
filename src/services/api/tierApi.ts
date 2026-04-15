import { apiV1Path } from './apiPath'
import { api } from './baseApi'
import type { ApiResponse, KolCurrentTierData, KolTier } from '@/types/api'

function ensureData<T>(payload: ApiResponse<T>, fallback: string): T {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(payload?.externalMessage || fallback)
  }

  return payload.data
}

type TiersEnvelope = ApiResponse<KolTier[]>
type CurrentTierEnvelope = ApiResponse<KolCurrentTierData>

export const tierApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getKolTiers: builder.query<KolTier[], void>({
      query: () => ({
        url: apiV1Path('/kol/tiers'),
        method: 'GET',
      }),
      transformResponse: (payload: TiersEnvelope) => ensureData(payload, 'Không thể tải danh sách tier'),
    }),
    getKolCurrentTier: builder.query<KolCurrentTierData, void>({
      query: () => ({
        url: apiV1Path('/kol/tiers/current'),
        method: 'GET',
      }),
      transformResponse: (payload: CurrentTierEnvelope) => ensureData(payload, 'Không thể tải tier hiện tại'),
    }),
  }),
})

export const { useGetKolTiersQuery, useGetKolCurrentTierQuery } = tierApi
