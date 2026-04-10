import { dashboardStats, mockReferrals } from '@/lib/mockData'
import type { ReferralItem, ReferralStats } from '@/types/api'
import { api, extractApiErrorMessage } from './baseApi'

async function requestReferralStats(): Promise<ReferralStats> {
  return {
    totalReferrals: dashboardStats.totalReferrals,
    activeReferrals: dashboardStats.activeReferrals,
    pendingReferrals: dashboardStats.pendingReferrals,
    conversionRate: dashboardStats.conversionRate,
  }
}

async function requestReferrals(): Promise<ReferralItem[]> {
  return mockReferrals.map((r) => ({
    ...r,
    registeredAt: r.registeredAt.toISOString(),
  }))
}

export const referralsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReferralStats: builder.query<ReferralStats, void>({
      queryFn: async () => {
        try {
          return { data: await requestReferralStats() }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: extractApiErrorMessage(error, 'Không thể tải thống kê referral') },
            },
          }
        }
      },
      providesTags: ['Referrals'],
    }),

    getReferrals: builder.query<ReferralItem[], void>({
      queryFn: async () => {
        try {
          return { data: await requestReferrals() }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: extractApiErrorMessage(error, 'Không thể tải danh sách referral') },
            },
          }
        }
      },
      providesTags: ['Referrals'],
    }),
  }),
})

export const { useGetReferralStatsQuery, useGetReferralsQuery } = referralsApi
