import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type { AdminTier } from '@/types/admin/tiers'

type AdminTiersEnvelope = ApiResponse<AdminTier[]>

const ensureData = <TData>(payload: ApiResponse<TData>, fallback: string): TData => {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(pickApiMessage(payload || {}, fallback))
  }

  return payload.data
}

export const adminTiersApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTiers: builder.query<AdminTier[], void>({
      query: () => ({
        url: apiV1Path('/admin/tiers'),
        method: 'GET',
      }),
      transformResponse: (payload: AdminTiersEnvelope) => ensureData(payload, 'Khong the tai danh sach tier'),
      providesTags: ['Tiers'],
    }),
  }),
})

export const { useGetAdminTiersQuery } = adminTiersApi
