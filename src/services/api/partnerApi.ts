import { mockPartnerSettings } from '@/lib/mockData'
import type { PartnerSettings } from '@/types/api'
import { api, extractApiErrorMessage } from './baseApi'

async function requestPartnerSettings(): Promise<PartnerSettings> {
  return mockPartnerSettings
}

export const partnerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerSettings: builder.query<PartnerSettings, void>({
      queryFn: async () => {
        try {
          return { data: await requestPartnerSettings() }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: extractApiErrorMessage(error, 'Không thể tải cài đặt partner') },
            },
          }
        }
      },
      providesTags: ['Partner'],
    }),
  }),
})

export const { useGetPartnerSettingsQuery } = partnerApi
