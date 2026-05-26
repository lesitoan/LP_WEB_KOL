import { apiV1Path } from '@/services/api/apiPath'
import { adminApi, pickApiMessage } from '@/services/api/baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  AdminDashboardOverviewData,
  AdminDashboardOverviewQuery,
  AdminRecentActivitiesQuery,
  AdminRecentActivityItem,
} from '@/types/admin/dashboard'

type AdminDashboardOverviewEnvelope = ApiResponse<AdminDashboardOverviewData>
type AdminRecentActivitiesEnvelope = ApiResponse<AdminRecentActivityItem[]>

const normalizeNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const normalizeOverviewData = (data: AdminDashboardOverviewData): AdminDashboardOverviewData => ({
  ...data,
  summary: {
    ...data.summary,
    totalMemberVolumeUsd: normalizeNumber(data.summary.totalMemberVolumeUsd),
  },
  items: data.items.map((item) => ({
    ...item,
    currentCommissionRate: normalizeNumber(item.currentCommissionRate),
    totalMemberVolumeUsd: normalizeNumber(item.totalMemberVolumeUsd),
    members: item.members.map((member) => ({
      ...member,
      usdVolume: normalizeNumber(member.usdVolume),
    })),
  })),
})

export const adminDashboardApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardOverview: builder.query<AdminDashboardOverviewData, AdminDashboardOverviewQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()

        if (params?.page) searchParams.set('page', String(params.page))
        if (params?.limit) searchParams.set('limit', String(params.limit))
        if (params?.memberLimit) searchParams.set('memberLimit', String(params.memberLimit))
        if (params?.search) searchParams.set('search', params.search)
        if (params?.status) searchParams.set('status', params.status)

        const queryString = searchParams.toString()

        return {
          url: `${apiV1Path('/admin/dashboard/overview')}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminDashboardOverviewEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải tổng quan dashboard quản trị'))
        }

        return normalizeOverviewData(payload.data)
      },
      providesTags: ['Dashboard'],
    }),

    getAdminRecentActivities: builder.query<AdminRecentActivityItem[], AdminRecentActivitiesQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params?.limit) searchParams.set('limit', String(params.limit))

        const queryString = searchParams.toString()

        return {
          url: `${apiV1Path('/admin/activities/recent')}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (payload: AdminRecentActivitiesEnvelope) => {
        if (!payload || payload.status !== 'success' || !payload.data) {
          throw new Error(pickApiMessage(payload || {}, 'Không thể tải hoạt động gần đây'))
        }

        return payload.data
      },
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetAdminDashboardOverviewQuery,
  useGetAdminRecentActivitiesQuery,
} = adminDashboardApi
