import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminLoginAttemptResponse,
  AdminLoginRequest,
  AdminLoginResult,
  AdminTwoFactorChallenge,
  AdminTwoFactorCodeRequest,
  AdminTwoFactorSetupResult,
  AdminTwoFactorStatusResult,
  AdminVerifyTwoFactorRequest,
} from '@/types/admin/auth'

type AdminLoginAttemptApiData = AdminLoginResult | AdminTwoFactorChallenge
type AdminLoginEnvelope = ApiResponse<AdminLoginAttemptApiData>

const isAdminTwoFactorChallenge = (value: AdminLoginAttemptApiData): value is AdminTwoFactorChallenge => {
  return 'requiresTwoFactor' in value && value.requiresTwoFactor === true
}

const mapAdminLoginResult = (data: AdminLoginResult): AdminLoginAttemptResponse => ({
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
  user: {
    id: data.user.id,
    email: data.user.email,
    name: data.user.fullName,
    role: data.user.role,
    twoFactorEnabled: data.user.twoFactorEnabled,
  },
})

export const adminAuthApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminLoginAttemptResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: apiV1Path('/admin/auth/login'),
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (payload: AdminLoginEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Đăng nhập quản trị thất bại'))
        }

        if (isAdminTwoFactorChallenge(payload.data)) return payload.data

        return mapAdminLoginResult(payload.data)
      },
      invalidatesTags: ['Auth'],
    }),

    verifyAdminTwoFactorLogin: builder.mutation<AdminLoginAttemptResponse, AdminVerifyTwoFactorRequest>({
      query: (body) => ({
        url: apiV1Path('/admin/auth/verify-2fa'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: AdminLoginEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data || isAdminTwoFactorChallenge(payload.data)) {
          throw new Error(pickApiMessage(payload || {}, 'Xác thực 2FA quản trị thất bại'))
        }

        return mapAdminLoginResult(payload.data)
      },
      invalidatesTags: ['Auth'],
    }),

    setupAdminTwoFactor: builder.mutation<ApiResponse<AdminTwoFactorSetupResult>, void>({
      query: () => ({
        url: apiV1Path('/admin/auth/2fa/setup'),
        method: 'POST',
      }),
      transformResponse: (payload: ApiResponse<AdminTwoFactorSetupResult>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tạo cấu hình 2FA quản trị'))
        }

        return payload
      },
    }),

    enableAdminTwoFactor: builder.mutation<ApiResponse<AdminTwoFactorStatusResult>, AdminTwoFactorCodeRequest>({
      query: (body) => ({
        url: apiV1Path('/admin/auth/2fa/enable'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: ApiResponse<AdminTwoFactorStatusResult>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể bật 2FA quản trị'))
        }

        return payload
      },
      invalidatesTags: ['Auth'],
    }),

    disableAdminTwoFactor: builder.mutation<ApiResponse<AdminTwoFactorStatusResult>, AdminTwoFactorCodeRequest>({
      query: (body) => ({
        url: apiV1Path('/admin/auth/2fa/disable'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: ApiResponse<AdminTwoFactorStatusResult>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tắt 2FA quản trị'))
        }

        return payload
      },
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useAdminLoginMutation,
  useVerifyAdminTwoFactorLoginMutation,
  useSetupAdminTwoFactorMutation,
  useEnableAdminTwoFactorMutation,
  useDisableAdminTwoFactorMutation,
} = adminAuthApi
