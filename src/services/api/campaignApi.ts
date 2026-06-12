import { apiV1Path } from './apiPath'
import { api } from './baseApi'
import type { ApiResponse, PaginatedData } from '@/types/api'
import type {
  CampaignData,
  GetCampaignsQuery,
  LeaderboardEntry,
} from '@/types/api/campaign'

type CampaignListEnvelope = ApiResponse<PaginatedData<CampaignData>>
type CampaignEnvelope = ApiResponse<CampaignData>
type LeaderboardEnvelope = ApiResponse<LeaderboardEntry[]>

function ensureData<T>(payload: ApiResponse<T>, fallback: string): T {
  if (!payload || payload.status !== 'success' || !payload.data) {
    throw new Error(payload?.externalMessage || fallback)
  }
  return payload.data
}

export const campaignApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // GET /kol/campaigns
    getCampaigns: builder.query<PaginatedData<CampaignData>, GetCampaignsQuery | void>({
      query: (params) => ({
        url: apiV1Path('/kol/campaigns'),
        params: params ?? {},
      }),
      transformResponse: (payload: CampaignListEnvelope) =>
        ensureData(payload, 'Không thể tải danh sách chiến dịch'),
      providesTags: ['Campaigns'],
    }),

    // GET /kol/campaigns/:id
    getCampaignById: builder.query<CampaignData, string>({
      query: (id) => ({
        url: apiV1Path(`/kol/campaigns/${id}`),
      }),
      transformResponse: (payload: CampaignEnvelope) =>
        ensureData(payload, 'Không thể tải chi tiết chiến dịch'),
      providesTags: (result, error, id) => [{ type: 'Campaigns', id }],
    }),

    // GET /kol/campaigns/:id/leaderboard
    getCampaignLeaderboard: builder.query<LeaderboardEntry[], string>({
      query: (id) => ({
        url: apiV1Path(`/kol/campaigns/${id}/leaderboard`),
      }),
      transformResponse: (payload: ApiResponse<any>) => {
        const data = ensureData(payload, 'Không thể tải bảng xếp hạng')
        if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
          return data.items
        }
        return Array.isArray(data) ? data : []
      },
      providesTags: (result, error, id) => [{ type: 'Campaigns', id: `${id}-leaderboard` }],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useGetCampaignLeaderboardQuery,
} = campaignApi