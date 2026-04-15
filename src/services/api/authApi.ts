import { apiV1Path } from './apiPath'
import type {
  ApiResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  LoginResult,
  UserProfile,
  ChangePasswordData
} from '@/types/api'
import { api, pickApiMessage } from './baseApi'

type CurrentUserApiData = {
  user: {
    id: string
    email: string
    fullName: string
    role?: string
    status?: string
    lastLoginAt?: string
    createdAt?: string
    updatedAt?: string
  }
  kol?: {
    id?: string
    displayName?: string | null
    lpexRefCode?: string | null
    code?: string | null
    currentTierId?: string | null
    telegramContact?: string | null
    zaloContact?: string | null
    defaultLanguage?: string | null
  }
}

type CurrentUserApiEnvelope = ApiResponse<CurrentUserApiData>
type LoginApiEnvelope = ApiResponse<LoginResult>
export type ChangePasswordResponse = ApiResponse<ChangePasswordData>

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: apiV1Path('/kol/auth/login'),
        method: 'POST',
        body: credentials,
      }),

      transformResponse: (payload: LoginApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Đăng nhập thất bại'))
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
          status: payload.data.user.status,
          lastLoginAt: payload.data.user.lastLoginAt,
          createdAt: payload.data.user.createdAt,
          updatedAt: payload.data.user.updatedAt,
          referralCode: payload.data.kol?.lpexRefCode || payload.data.kol?.code || undefined,
          tier: payload.data.kol?.currentTierId || undefined,
          kolId: payload.data.kol?.id || undefined,
          kolCode: payload.data.kol?.code || undefined,
          kolDisplayName: payload.data.kol?.displayName || undefined,
          lpexRefCode: payload.data.kol?.lpexRefCode || undefined,
          telegramContact: payload.data.kol?.telegramContact || undefined,
          zaloContact: payload.data.kol?.zaloContact || undefined,
          defaultLanguage: payload.data.kol?.defaultLanguage || undefined,
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
  }),
})

export const { useLoginMutation, useGetCurrentUserQuery, useChangePasswordMutation } = authApi
