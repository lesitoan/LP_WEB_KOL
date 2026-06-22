import { apiV1Path } from './apiPath'
import type {
  ApiResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginAttemptResponse,
  LoginResult,
  UserProfile,
  ChangePasswordData,
  TwoFactorChallenge,
  TwoFactorCodeRequest,
  TwoFactorSetupResult,
  TwoFactorStatusResult,
  VerifyTwoFactorRequest,
} from '@/types/api'
import { api, pickApiMessage } from './baseApi'

type CurrentUserApiData = {
  user: {
    id: string
    email: string
    fullName: string
    role?: string
    status?: string
    twoFactorEnabled?: boolean
    lastLoginAt?: string
    createdAt?: string
    updatedAt?: string
  }
  kol?: {
    id?: string
    displayName?: string | null
    lpexUid?: string | null
    lpexRefCode?: string | null
    code?: string | null
    currentTierId?: string | null
    telegramContact?: string | null
    zaloContact?: string | null
    defaultLanguage?: string | null
    telegramUsername?: string | null
  }
}

type CurrentUserApiEnvelope = ApiResponse<CurrentUserApiData>
type LoginAttemptApiData = LoginResult | TwoFactorChallenge
type LoginApiEnvelope = ApiResponse<LoginAttemptApiData>
export type ChangePasswordResponse = ApiResponse<ChangePasswordData>

const isTwoFactorChallenge = (value: LoginAttemptApiData): value is TwoFactorChallenge => {
  return 'requiresTwoFactor' in value && value.requiresTwoFactor === true
}

const mapLoginResult = (data: LoginResult): LoginAttemptResponse => ({
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

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginAttemptResponse, LoginRequest>({
      query: (credentials) => ({
        url: apiV1Path('/kol/auth/login'),
        method: 'POST',
        body: credentials,
      }),

      transformResponse: (payload: LoginApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Đăng nhập thất bại'))
        }

        if (isTwoFactorChallenge(payload.data)) return payload.data

        return mapLoginResult(payload.data)
      },
      invalidatesTags: ['Auth'],
    }),

    verifyTwoFactorLogin: builder.mutation<LoginAttemptResponse, VerifyTwoFactorRequest>({
      query: (body) => ({
        url: apiV1Path('/kol/auth/verify-2fa'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: LoginApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data || isTwoFactorChallenge(payload.data)) {
          throw new Error(pickApiMessage(payload || {}, 'Xác thực 2FA thất bại'))
        }

        return mapLoginResult(payload.data)
      },
      invalidatesTags: ['Auth'],
    }),

    getCurrentUser: builder.query<UserProfile, void>({
      query: () => ({
        url: apiV1Path('/kol/auth/me'),
        method: 'GET',
      }),

      transformResponse: (payload: CurrentUserApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải thông tin người dùng'))
        }

        return {
          id: payload.data.user.id,
          email: payload.data.user.email,
          name: payload.data.kol?.displayName || payload.data.user.fullName,
            role: payload.data.user.role,
            twoFactorEnabled: payload.data.user.twoFactorEnabled,
            status: payload.data.user.status,
          lastLoginAt: payload.data.user.lastLoginAt,
          createdAt: payload.data.user.createdAt,
          updatedAt: payload.data.user.updatedAt,
          referralCode: payload.data.kol?.lpexRefCode || payload.data.kol?.code || undefined,
          tier: payload.data.kol?.currentTierId || undefined,
          kolId: payload.data.kol?.id || undefined,
          kolCode: payload.data.kol?.code || undefined,
          kolDisplayName: payload.data.kol?.displayName || undefined,
          lpexUid: payload.data.kol?.lpexUid || undefined,
          lpexRefCode: payload.data.kol?.lpexRefCode || undefined,
          telegramContact: payload.data.kol?.telegramContact || undefined,
          zaloContact: payload.data.kol?.zaloContact || undefined,
          defaultLanguage: payload.data.kol?.defaultLanguage || undefined,
          telegramUsername: payload.data.kol?.telegramUsername || undefined,
        }
      },
      providesTags: ['Auth'],
    }),

    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: apiV1Path('/kol/auth/change-password'),
        method: 'POST',
        body,
      }),

      transformResponse: (payload: ApiResponse<{ message: string }>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Đổi mật khẩu thất bại'))
        }

        return {
          status: payload.status,
          internalMessage: payload.internalMessage,
          externalMessage: payload.externalMessage,
          data: {
            message: payload.data.message,
          },
        }
      },
      invalidatesTags: ['Auth'],
    }),

    setupTwoFactor: builder.mutation<ApiResponse<TwoFactorSetupResult>, void>({
      query: () => ({
        url: apiV1Path('/kol/auth/2fa/setup'),
        method: 'POST',
      }),
      transformResponse: (payload: ApiResponse<TwoFactorSetupResult>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tạo cấu hình 2FA'))
        }

        return payload
      },
    }),

    enableTwoFactor: builder.mutation<ApiResponse<TwoFactorStatusResult>, TwoFactorCodeRequest>({
      query: (body) => ({
        url: apiV1Path('/kol/auth/2fa/enable'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: ApiResponse<TwoFactorStatusResult>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể bật 2FA'))
        }

        return payload
      },
      invalidatesTags: ['Auth'],
    }),

    disableTwoFactor: builder.mutation<ApiResponse<TwoFactorStatusResult>, TwoFactorCodeRequest>({
      query: (body) => ({
        url: apiV1Path('/kol/auth/2fa/disable'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: ApiResponse<TwoFactorStatusResult>) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tắt 2FA'))
        }

        return payload
      },
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useLoginMutation,
  useVerifyTwoFactorLoginMutation,
  useGetCurrentUserQuery,
  useChangePasswordMutation,
  useSetupTwoFactorMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
} = authApi
