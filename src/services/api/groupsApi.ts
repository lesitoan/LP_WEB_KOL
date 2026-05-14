import { apiV1Path } from './apiPath'
import type {
  ApiResponse,
  CreateGroupBenefitBody,
  CreateGroupBody,
  GroupBenefit,
  GroupAccessSummaryData,
  GroupItem,
  GroupsData,
  ListGroupMembersQuery,
  ListGroupsQuery,
  MembersData,
  UpdateGroupBenefitBody,
  UpdateGroupBody,
} from '@/types/api'
import { api } from './baseApi'

type GroupsApiEnvelope = ApiResponse<GroupsData>
type GroupApiEnvelope = ApiResponse<GroupItem>
type GroupMembersApiEnvelope = ApiResponse<MembersData>
type GroupAccessSummaryApiEnvelope = ApiResponse<GroupAccessSummaryData>
type GroupBenefitsApiEnvelope = ApiResponse<GroupBenefit[]>
type GroupBenefitApiEnvelope = ApiResponse<GroupBenefit>
type DeleteGroupApiEnvelope = ApiResponse<null>


export const groupsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<GroupsData, ListGroupsQuery>({
      query: ({ page, limit, search, status }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })

        if (search) {
          params.set('search', search)
        }

        if (status) {
          params.set('status', status)
        }

        return {
          url: apiV1Path(`/kol/groups?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: GroupsApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể tải danh sách group')
        }

        return payload.data
      },
      providesTags: ['Groups'],
    }),

    updateGroupTitle: builder.mutation<GroupItem, { groupId: string; title: string }>({
      query: ({ groupId, title }) => ({
        url: apiV1Path(`/kol/groups/${groupId}`),
        method: 'PATCH',
        body: { title },
      }),
      transformResponse: (payload: GroupApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể cập nhật tên group')
        }
        return payload.data
      },
      invalidatesTags: ['Groups'],
    }),

    getGroupDetail: builder.query<GroupItem, { groupId: string }>({
      query: ({ groupId }) => ({
        url: apiV1Path(`/kol/groups/${groupId}`),
        method: 'GET',
      }),
      transformResponse: (payload: GroupApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể tải thông tin group')
        }

        return payload.data
      },
      providesTags: ['Groups'],
    }),

    updateGroup: builder.mutation<GroupItem, { groupId: string; data: UpdateGroupBody }>({
      query: ({ groupId, data }) => ({
        url: apiV1Path(`/kol/groups/${groupId}`),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (payload: GroupApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể cập nhật group')
        }
        return payload.data
      },
      invalidatesTags: ['Groups'],
    }),

    createGroup: builder.mutation<GroupItem, CreateGroupBody>({
      query: (data) => ({
        url: apiV1Path('/kol/groups'),
        method: 'POST',
        body: data,
      }),
      transformResponse: (payload: GroupApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể tạo group')
        }
        return payload.data
      },
      invalidatesTags: ['Groups'],
    }),

    getGroupMembers: builder.query<MembersData, { groupId: string; query: ListGroupMembersQuery }>({
      query: ({ groupId, query }) => {
        const params = new URLSearchParams({
          page: String(query.page),
          limit: String(query.limit),
        })

        if (query.search) {
          params.set('search', query.search)
        }

        if (query.countryCode) {
          params.set('countryCode', query.countryCode)
        }

        if (query.telegramStatus) {
          params.set('telegramStatus', query.telegramStatus.toLowerCase())
        }

        if (query.lpexUserStatus) {
          params.set('lpexUserStatus', query.lpexUserStatus.toLowerCase())
        }

        return {
          url: apiV1Path(`/kol/groups/${groupId}/members?${params.toString()}`),
          method: 'GET',
        }
      },
      transformResponse: (payload: GroupMembersApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể tải danh sách thành viên trong group')
        }

        return payload.data
      },
      providesTags: ['Members'],
    }),

    getGroupAccessSummary: builder.query<GroupAccessSummaryData, { groupId: string }>({
      query: ({ groupId }) => ({
        url: apiV1Path(`/kol/groups/${groupId}/access-summary`),
        method: 'GET',
      }),
      transformResponse: (payload: GroupAccessSummaryApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể tải tổng quan group')
        }

        return payload.data
      },
      providesTags: ['Groups'],
    }),

    getGroupBenefits: builder.query<GroupBenefit[], { groupId: string }>({
      query: ({ groupId }) => ({
        url: apiV1Path(`/kol/groups/${groupId}/benefits`),
        method: 'GET',
      }),
      transformResponse: (payload: GroupBenefitsApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể tải danh sách benefit')
        }

        return payload.data
      },
      providesTags: (_result, _error, { groupId }) => [{ type: 'Benefits', id: groupId }],
    }),

    createGroupBenefit: builder.mutation<GroupBenefit, { groupId: string; data: CreateGroupBenefitBody }>({
      query: ({ groupId, data }) => ({
        url: apiV1Path(`/kol/groups/${groupId}/benefits`),
        method: 'POST',
        body: data,
      }),
      transformResponse: (payload: GroupBenefitApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể tạo benefit')
        }

        return payload.data
      },
      invalidatesTags: (_result, _error, { groupId }) => [{ type: 'Benefits', id: groupId }],
    }),

    updateGroupBenefit: builder.mutation<
      GroupBenefit,
      { groupId: string; benefitId: string; data: UpdateGroupBenefitBody }
    >({
      query: ({ groupId, benefitId, data }) => ({
        url: apiV1Path(`/kol/groups/${groupId}/benefits/${benefitId}`),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (payload: GroupBenefitApiEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(payload?.externalMessage || 'Không thể cập nhật benefit')
        }

        return payload.data
      },
      invalidatesTags: (_result, _error, { groupId }) => [{ type: 'Benefits', id: groupId }],
    }),

    deleteGroupBenefit: builder.mutation<void, { groupId: string; benefitId: string }>({
      query: ({ groupId, benefitId }) => ({
        url: apiV1Path(`/kol/groups/${groupId}/benefits/${benefitId}`),
        method: 'DELETE',
      }),
      transformResponse: (payload: DeleteGroupApiEnvelope) => {
        if (!payload || payload.status !== 'success') {
          throw new Error(payload?.externalMessage || 'Không thể xóa benefit')
        }
      },
      invalidatesTags: (_result, _error, { groupId }) => [{ type: 'Benefits', id: groupId }],
    }),

    deleteGroup: builder.mutation<void, { groupId: string }>({
      query: ({ groupId }) => ({
        url: apiV1Path(`/kol/groups/${groupId}`),
        method: 'DELETE',
      }),
      transformResponse: (payload: DeleteGroupApiEnvelope) => {
        if (!payload || payload.status !== 'success') {
          throw new Error(payload?.externalMessage || 'Không thể xóa group')
        }
      },
      invalidatesTags: ['Groups'],
    }),
  }),
})

export const {
  useGetGroupsQuery,
  useUpdateGroupTitleMutation,
  useGetGroupDetailQuery,
  useUpdateGroupMutation,
  useCreateGroupMutation,
  useGetGroupMembersQuery,
  useGetGroupAccessSummaryQuery,
  useGetGroupBenefitsQuery,
  useCreateGroupBenefitMutation,
  useUpdateGroupBenefitMutation,
  useDeleteGroupBenefitMutation,
  useDeleteGroupMutation,
} = groupsApi
