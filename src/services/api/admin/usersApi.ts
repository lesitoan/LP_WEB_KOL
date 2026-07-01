import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminPermissionProfileBody,
  AdminUser,
  CreateAdminUserBody,
  CreateAdminUserResult,
  ListAdminUsersQuery,
  PaginatedAdminUsers,
  UpdateAdminUserBody,
  UpdateAdminUserStatusBody,
} from '@/types/api/adminUser'

type AdminUsersEnvelope = ApiResponse<PaginatedAdminUsers>
type AdminUserEnvelope = ApiResponse<AdminUser>
type CreateAdminUserEnvelope = ApiResponse<CreateAdminUserResult>

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

export const adminUsersApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminUsers: builder.query<PaginatedAdminUsers, ListAdminUsersQuery | void>({
      query: (queryArg) => {
        const query = queryArg ?? {}
        const params = new URLSearchParams()

        appendIfPresent(params, 'page', query.page ?? 1)
        appendIfPresent(params, 'limit', query.limit ?? 8)
        appendIfPresent(params, 'search', query.search)
        appendIfPresent(params, 'role', query.role)
        appendIfPresent(params, 'status', query.status)

        return {
          url: apiV1Path(`/admin/users?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminUsersEnvelope) => ensureData(payload, 'Không thể tải danh sách admin'),
      providesTags: ['AdminUsers'],
    }),

    createAdminUser: builder.mutation<CreateAdminUserResult, CreateAdminUserBody>({
      query: (body) => ({
        url: apiV1Path('/admin/users'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: CreateAdminUserEnvelope) => ensureData(payload, 'Không thể tạo admin'),
      invalidatesTags: ['AdminUsers'],
    }),

    updateAdminUser: builder.mutation<AdminUser, { userId: string; body: UpdateAdminUserBody }>({
      query: ({ userId, body }) => ({
        url: apiV1Path(`/admin/users/${userId}`),
        method: 'PATCH',
        body,
      }),
      transformResponse: (payload: AdminUserEnvelope) => ensureData(payload, 'Không thể cập nhật admin'),
      invalidatesTags: (_result, _error, { userId }) => ['AdminUsers', { type: 'AdminUsers', id: userId }],
    }),

    updateAdminUserStatus: builder.mutation<AdminUser, { userId: string; body: UpdateAdminUserStatusBody }>({
      query: ({ userId, body }) => ({
        url: apiV1Path(`/admin/users/${userId}/status`),
        method: 'PATCH',
        body,
      }),
      transformResponse: (payload: AdminUserEnvelope) => ensureData(payload, 'Không thể cập nhật trạng thái admin'),
      invalidatesTags: (_result, _error, { userId }) => ['AdminUsers', { type: 'AdminUsers', id: userId }],
    }),

    updateAdminUserPermissions: builder.mutation<AdminUser, { userId: string; body: AdminPermissionProfileBody }>({
      query: ({ userId, body }) => ({
        url: apiV1Path(`/admin/users/${userId}/permissions`),
        method: 'PATCH',
        body,
      }),
      transformResponse: (payload: AdminUserEnvelope) => ensureData(payload, 'Không thể cập nhật quyền admin'),
      invalidatesTags: (_result, _error, { userId }) => ['AdminUsers', { type: 'AdminUsers', id: userId }],
    }),
  }),
})

export const {
  useListAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useUpdateAdminUserStatusMutation,
  useUpdateAdminUserPermissionsMutation,
} = adminUsersApi
