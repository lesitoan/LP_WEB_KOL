import { apiV1Path } from './apiPath'
import type { ApiResponse, ListMembersQuery, MembersData } from '@/types/api'
import { api } from './baseApi'

export const membersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<MembersData, ListMembersQuery>({
      query: ({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        countryCode,
        telegramStatus,
        lpexUserStatus,
        groupId,
        eligibilityStatus,
        inactiveDays,
        membershipState,
        includeGroups,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })

        if (sortBy) {
          params.set('sortBy', sortBy)
        }

        if (sortOrder) {
          params.set('sortOrder', sortOrder)
        }

        if (search) {
          params.set('search', search)
        }

        if (countryCode) {
          params.set('countryCode', countryCode)
        }

        if (telegramStatus) {
          params.set('telegramStatus', telegramStatus.toLowerCase())
        }

        if (lpexUserStatus) {
          params.set('lpexUserStatus', lpexUserStatus.toLowerCase())
        }

        if (groupId) {
          params.set('groupId', groupId)
        }

        if (eligibilityStatus) {
          params.set('eligibilityStatus', eligibilityStatus)
        }

        if (inactiveDays !== undefined) {
          params.set('inactiveDays', String(inactiveDays))
        }

        if (membershipState) {
          params.set('membershipState', membershipState)
        }

        if (includeGroups !== undefined) {
          params.set('includeGroups', includeGroups ? 'true' : 'false')
        }

        return {
          url: apiV1Path(
            `/kol/members?${params
              .toString()
              .replace(/eligibilityStatus=FINAL_WARNING%2CWARNING/g, 'eligibilityStatus=FINAL_WARNING,WARNING')}`,
          ),
          method: 'GET',
        }
      },
      transformResponse: (response: ApiResponse<MembersData>) => {
        if (response.status !== 'success' || !response.data) {
          throw new Error(response.externalMessage || 'Không thể tải danh sách member')
        }
        return response.data
      },
      providesTags: ['Members'],
    }),
  }),
})

export const { useGetMembersQuery, useLazyGetMembersQuery } = membersApi
