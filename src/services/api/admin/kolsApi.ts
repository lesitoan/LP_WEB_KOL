import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminKolItem,
  AdminKolStatusAction,
  AdminKolsData,
  CreateAdminKolBody,
  ListAdminKolsQuery,
  UpdateAdminKolBody,
} from '@/types/admin/kols'

type AdminKolsEnvelope = ApiResponse<AdminKolsData>
type AdminKolEnvelope = ApiResponse<AdminKolItem>
type DeleteAdminKolEnvelope = ApiResponse<null>

const normalizeNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const normalizeKol = (kol: AdminKolItem): AdminKolItem => ({
  ...kol,
  currentCommissionRate: normalizeNumber(kol.currentCommissionRate),
})

export const adminKolsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminKols: builder.query<AdminKolsData, ListAdminKolsQuery>({
      query: ({ page, limit, search, status }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })

        if (search) params.set('search', search)
        if (status) params.set('status', status)

        return {
          url: apiV1Path(`/admin/kols?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminKolsEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải danh sách Partner'))
        }

        return {
          ...payload.data,
          items: payload.data.items.map(normalizeKol),
        }
      },
      providesTags: ['Kols'],
    }),

    getAdminKolDetail: builder.query<AdminKolItem, { kolId: string }>({
      query: ({ kolId }) => ({
        url: apiV1Path(`/admin/kols/${kolId}`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminKolEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải thông tin Partner'))
        }

        return normalizeKol(payload.data)
      },
      providesTags: (_result, _error, { kolId }) => [{ type: 'Kols', id: kolId }],
    }),

    createAdminKol: builder.mutation<AdminKolItem, CreateAdminKolBody>({
      query: (data) => ({
        url: apiV1Path('/admin/kols'),
        method: 'POST',
        body: data,
      }),
      transformResponse: (payload: AdminKolEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tạo Partner'))
        }

        return normalizeKol(payload.data)
      },
      invalidatesTags: ['Kols', 'Dashboard'],
    }),

    updateAdminKol: builder.mutation<AdminKolItem, { kolId: string; data: UpdateAdminKolBody }>({
      query: ({ kolId, data }) => ({
        url: apiV1Path(`/admin/kols/${kolId}`),
        method: 'PUT',
        body: data,
      }),
      transformResponse: (payload: AdminKolEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể cập nhật Partner'))
        }

        return normalizeKol(payload.data)
      },
      invalidatesTags: (_result, _error, { kolId }) => ['Kols', 'Dashboard', { type: 'Kols', id: kolId }],
    }),

    updateAdminKolStatus: builder.mutation<AdminKolItem, { kolId: string; action: AdminKolStatusAction }>({
      query: ({ kolId, action }) => ({
        url: apiV1Path(`/admin/kols/${kolId}/${action}`),
        method: 'POST',
      }),
      transformResponse: (payload: AdminKolEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể cập nhật trạng thái Partner'))
        }

        return normalizeKol(payload.data)
      },
      invalidatesTags: (_result, _error, { kolId }) => ['Kols', 'Dashboard', { type: 'Kols', id: kolId }],
    }),

    deleteAdminKol: builder.mutation<void, { kolId: string }>({
      query: ({ kolId }) => ({
        url: apiV1Path(`/admin/kols/${kolId}`),
        method: 'DELETE',
      }),
      transformResponse: (payload: DeleteAdminKolEnvelope) => {
        if (!payload || payload.status !== 'success') {
          throw new Error(pickApiMessage(payload || {}, 'Không thể xóa Partner'))
        }
      },
      invalidatesTags: ['Kols', 'Dashboard'],
    }),
  }),
})

export const {
  useGetAdminKolsQuery,
  useGetAdminKolDetailQuery,
  useLazyGetAdminKolDetailQuery,
  useCreateAdminKolMutation,
  useUpdateAdminKolMutation,
  useUpdateAdminKolStatusMutation,
  useDeleteAdminKolMutation,
} = adminKolsApi
