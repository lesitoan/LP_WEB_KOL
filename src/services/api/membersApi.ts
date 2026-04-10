import { apiV1Path } from './apiPath'
import type { ApiResponse, ListMembersQuery, MembersData } from '@/types/api'
import { api } from './baseApi'

export const membersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<MembersData, ListMembersQuery>({
      query: ({ page, limit, search, countryCode }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })

        if (search) {
          params.set('search', search)
        }

        if (countryCode) {
          params.set('countryCode', countryCode)
        }

        return {
          url: apiV1Path(`/kol/members?${params.toString()}`),
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

export const { useGetMembersQuery } = membersApi
