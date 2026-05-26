import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminMemberGroupsData,
  AdminMemberItem,
  AdminMemberMetricsData,
  AdminMembersData,
  ListAdminMembersQuery,
} from '@/types/admin/members'

type AdminMembersEnvelope = ApiResponse<AdminMembersData>
type AdminMemberEnvelope = ApiResponse<AdminMemberItem>
type AdminMemberGroupsEnvelope = ApiResponse<AdminMemberGroupsData>
type AdminMemberMetricsEnvelope = ApiResponse<AdminMemberMetricsData>

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const normalizeMember = (member: AdminMemberItem): AdminMemberItem => ({
  ...member,
  telegramUserId: String(member.telegramUserId),
  usdVolume: toNumber(member.usdVolume),
})

const normalizeMembersData = (data: AdminMembersData): AdminMembersData => ({
  ...data,
  items: data.items.map(normalizeMember),
})

export const adminMembersApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMembers: builder.query<AdminMembersData, ListAdminMembersQuery>({
      query: ({ page, limit, search, countryCode, kolId, telegramStatus, lpexUserStatus }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })

        if (search) params.set('search', search)
        if (countryCode) params.set('countryCode', countryCode)
        if (kolId) params.set('kolId', kolId)
        if (telegramStatus) params.set('telegramStatus', telegramStatus)
        if (lpexUserStatus) params.set('lpexUserStatus', lpexUserStatus)

        return {
          url: apiV1Path(`/admin/members?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminMembersEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải danh sách thành viên'))
        }

        return normalizeMembersData(payload.data)
      },
      providesTags: ['Members'],
    }),

    getAdminMemberByLpexUid: builder.query<AdminMemberItem, { lpexUid: string }>({
      query: ({ lpexUid }) => ({
        url: apiV1Path(`/admin/members/by-lpex-uid/${encodeURIComponent(lpexUid)}`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminMemberEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải thành viên theo LPEX UID'))
        }

        return normalizeMember(payload.data)
      },
      providesTags: (_result, _error, { lpexUid }) => [{ type: 'Members', id: lpexUid }],
    }),

    getAdminMemberDetail: builder.query<AdminMemberItem, { memberId: string }>({
      query: ({ memberId }) => ({
        url: apiV1Path(`/admin/members/${memberId}`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminMemberEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải chi tiết thành viên'))
        }

        return normalizeMember(payload.data)
      },
      providesTags: (_result, _error, { memberId }) => [{ type: 'Members', id: memberId }],
    }),

    getAdminMemberGroups: builder.query<AdminMemberGroupsData, { memberId: string }>({
      query: ({ memberId }) => ({
        url: apiV1Path(`/admin/members/${memberId}/groups`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminMemberGroupsEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải nhóm của thành viên'))
        }

        return {
          ...payload.data,
          member: normalizeMember(payload.data.member),
        }
      },
      providesTags: (_result, _error, { memberId }) => [{ type: 'Members', id: `${memberId}-groups` }],
    }),

    getAdminMemberMetrics: builder.query<AdminMemberMetricsData, { memberId: string }>({
      query: ({ memberId }) => ({
        url: apiV1Path(`/admin/members/${memberId}/metrics`),
        method: 'GET',
      }),
      transformResponse: (payload: AdminMemberMetricsEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải chỉ số thành viên'))
        }

        return {
          ...payload.data,
          member: normalizeMember(payload.data.member),
        }
      },
      providesTags: (_result, _error, { memberId }) => [{ type: 'Members', id: `${memberId}-metrics` }],
    }),
  }),
})

export const {
  useGetAdminMembersQuery,
  useGetAdminMemberByLpexUidQuery,
  useLazyGetAdminMemberByLpexUidQuery,
  useGetAdminMemberDetailQuery,
  useGetAdminMemberGroupsQuery,
  useGetAdminMemberMetricsQuery,
} = adminMembersApi
