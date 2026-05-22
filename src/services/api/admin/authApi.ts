import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type { AdminLoginRequest, AdminLoginResponse, AdminLoginResult } from '@/types/admin/auth'

type AdminLoginEnvelope = ApiResponse<AdminLoginResult>

export const adminAuthApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: apiV1Path('/admin/auth/login'),
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (payload: AdminLoginEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Đăng nhập quản trị thất bại'))
        }

        return {
          accessToken: payload.data.accessToken,
          refreshToken: payload.data.refreshToken,
          user: {
            id: payload.data.user.id,
            email: payload.data.user.email,
            name: payload.data.user.fullName,
            role: payload.data.user.role,
          },
        }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const { useAdminLoginMutation } = adminAuthApi
