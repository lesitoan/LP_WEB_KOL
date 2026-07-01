import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminDistributionConfig,
  UpdateAdminDistributionConfigBody,
} from '@/types/api/adminDistributionConfig'

type AdminDistributionConfigEnvelope = ApiResponse<AdminDistributionConfig>

function ensureData<T>(payload: ApiResponse<T>, fallback: string): T {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(pickApiMessage(payload || {}, fallback))
  }

  return payload.data
}

export const adminDistributionConfigApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDistributionConfig: builder.query<AdminDistributionConfig, void>({
      query: () => ({
        url: apiV1Path('/admin/distribution-config'),
        method: 'GET',
      }),
      transformResponse: (payload: AdminDistributionConfigEnvelope) =>
        ensureData(payload, 'Không thể tải cấu hình phân phối'),
      providesTags: ['DistributionConfig'],
    }),

    updateAdminDistributionConfig: builder.mutation<AdminDistributionConfig, UpdateAdminDistributionConfigBody>({
      query: (body) => ({
        url: apiV1Path('/admin/distribution-config'),
        method: 'PATCH',
        body,
      }),
      transformResponse: (payload: AdminDistributionConfigEnvelope) =>
        ensureData(payload, 'Không thể cập nhật cấu hình phân phối'),
      invalidatesTags: ['DistributionConfig'],
    }),
  }),
})

export const {
  useGetAdminDistributionConfigQuery,
  useUpdateAdminDistributionConfigMutation,
} = adminDistributionConfigApi
