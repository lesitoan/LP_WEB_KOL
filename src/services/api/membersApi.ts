import { apiV1Path } from './apiPath'
import type { ApiResponse, ListMembersQuery, MembersData, VolumePeriodsMembersData } from '@/types/api'
import { api } from './baseApi'

const buildMembersSearchParams = ({
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
}: ListMembersQuery) => {
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

  return params.toString().replace(/eligibilityStatus=FINAL_WARNING%2CWARNING/g, 'eligibilityStatus=FINAL_WARNING,WARNING')
}

export const membersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<MembersData, ListMembersQuery>({
      query: (query) => ({
        url: apiV1Path(`/kol/members?${buildMembersSearchParams(query)}`),
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<MembersData>) => {
        if (response.status !== 'success' || !response.data) {
          throw new Error(response.externalMessage || 'Khong the tai danh sach member')
        }

        return response.data
      },
      providesTags: ['Members'],
    }),
    getVolumePeriodsMembers: builder.query<VolumePeriodsMembersData, ListMembersQuery>({
      query: (query) => ({
        url: apiV1Path(`/kol/members/volume-periods?${buildMembersSearchParams(query)}`),
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<VolumePeriodsMembersData>) => {
        if (response.status !== 'success' || !response.data) {
          throw new Error(response.externalMessage || 'Khong the tai danh sach volume member')
        }
        return response.data
      },
      providesTags: ['Members'],
    }),
  }),
})

export const {
  useGetMembersQuery,
  useGetVolumePeriodsMembersQuery,
  useLazyGetMembersQuery,
  useLazyGetVolumePeriodsMembersQuery,
} = membersApi
