import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminLoginAttemptResponse,
  AdminLoginRequest,
  AdminLoginResult,
  AdminMeResult,
  AdminProfile,
  AdminTwoFactorChallenge,
  AdminTwoFactorCodeRequest,
  AdminTwoFactorSetupResult,
  AdminTwoFactorStatusResult,
  AdminUserApiData,
  AdminVerifyTwoFactorRequest,
} from '@/types/admin/auth'

type AdminLoginAttemptApiData = AdminLoginResult | AdminTwoFactorChallenge
type AdminLoginEnvelope = ApiResponse<AdminLoginAttemptApiData>
type AdminMeEnvelope = ApiResponse<AdminMeResult>

const isAdminTwoFactorChallenge = (value: AdminLoginAttemptApiData): value is AdminTwoFactorChallenge => {
  return 'requiresTwoFactor' in value && value.requiresTwoFactor === true
}

const mapAdminUserToProfile = (user: AdminUserApiData): AdminProfile => ({
  id: user.id,
  email: user.email,
  name: user.fullName || user.email,
  role: user.role,
  status: user.status,
  lastLoginAt: user.lastLoginAt,
  twoFactorEnabled: user.twoFactorEnabled,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

const mapAdminLoginResult = (data: AdminLoginResult): AdminLoginAttemptResponse => ({
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
  user: mapAdminUserToProfile(data.user),
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

    getCurrentAdmin: builder.query<AdminProfile, void>({
      query: () => ({
        url: apiV1Path('/admin/auth/me'),
        method: 'GET',
      }),
      transformResponse: (payload: AdminMeEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data?.user) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải thông tin quản trị viên'))
        }

        return mapAdminUserToProfile(payload.data.user)
      },
      providesTags: ['Auth'],
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
  useGetCurrentAdminQuery,
  useSetupAdminTwoFactorMutation,
  useEnableAdminTwoFactorMutation,
  useDisableAdminTwoFactorMutation,
} = adminAuthApi
