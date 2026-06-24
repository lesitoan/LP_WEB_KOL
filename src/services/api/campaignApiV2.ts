import { apiV1Path } from './apiPath'
import { api } from './baseApi'
import type { ApiResponse } from '@/types/api'
import type {
  Campaign,
  CampaignCounts,
  CampaignHistoryFilter,
  CampaignLeaderboardItem,
  CreateCampaignRequest,
  GetCampaignLeaderboardQuery,
  GetCampaignsQuery,
  PaginatedData,
  UpdateCampaignArgs,
} from '@/types/api/campaignV2'

type CampaignListEnvelope = ApiResponse<PaginatedData<Campaign>>
type CampaignEnvelope = ApiResponse<Campaign>
type CampaignLeaderboardEnvelope = ApiResponse<PaginatedData<CampaignLeaderboardItem>>

const CAMPAIGN_FILTERS: CampaignHistoryFilter[] = [
  'ALL',
  'ACTIVE',
  'UPCOMING',
  'DRAFT',
  'ENDED',
  'CANCELLED',
]

function ensureData<TData>(payload: ApiResponse<TData>, fallback: string): TData {
  if (!payload || payload.status !== 'success' || payload.data == null) {
    throw new Error(payload?.externalMessage || fallback)
  }
  return payload.data
}

function emptyCampaignCounts(): CampaignCounts {
  return CAMPAIGN_FILTERS.reduce((acc, filter) => {
    acc[filter] = 0
    return acc
  }, {} as CampaignCounts)
}

export const campaignApiV2 = api.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint keys keep the v2 suffix so this slice can coexist with the old campaignApi.
    getCampaignsV2: builder.query<PaginatedData<Campaign>, GetCampaignsQuery | void>({
      query: (params) => ({
        url: apiV1Path('/kol/campaigns'),
        params: params ?? {},
      }),
      transformResponse: (payload: CampaignListEnvelope) =>
        ensureData(payload, 'Unable to load campaigns'),
      providesTags: ['Campaigns'],
    }),

    getCampaignByIdV2: builder.query<Campaign, string>({
      query: (campaignId) => ({
        url: apiV1Path(`/kol/campaigns/${campaignId}`),
      }),
      transformResponse: (payload: CampaignEnvelope) =>
        ensureData(payload, 'Unable to load campaign detail'),
      providesTags: (result, error, campaignId) => [{ type: 'Campaigns', id: campaignId }],
    }),

    getCampaignLeaderboardV2: builder.query<
      PaginatedData<CampaignLeaderboardItem>,
      GetCampaignLeaderboardQuery
    >({
      query: ({ campaignId, ...params }) => ({
        url: apiV1Path(`/kol/campaigns/${campaignId}/leaderboard`),
        params,
      }),
      transformResponse: (payload: CampaignLeaderboardEnvelope) =>
        ensureData(payload, 'Unable to load campaign leaderboard'),
      providesTags: (result, error, arg) => [
        { type: 'Campaigns', id: `${arg.campaignId}-leaderboard` },
      ],
    }),

    getCampaignCountsV2: builder.query<CampaignCounts, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const entries = await Promise.all(
          CAMPAIGN_FILTERS.map(async (filter) => {
            const params: GetCampaignsQuery = { page: 1, limit: 1 }
            if (filter !== 'ALL') {
              params.status = filter
            }

            const result = await baseQuery({
              url: apiV1Path('/kol/campaigns'),
              params,
            })

            if (result.error) {
              return { filter, count: 0 }
            }

            const payload = result.data as CampaignListEnvelope
            const count =
              payload?.status === 'success'
                ? payload.data?.pagination.totalItems ?? payload.data?.items.length ?? 0
                : 0

            return { filter, count }
          }),
        )

        const counts = emptyCampaignCounts()
        entries.forEach(({ filter, count }) => {
          counts[filter] = count
        })

        return { data: counts }
      },
      providesTags: ['Campaigns'],
    }),

    createCampaignV2: builder.mutation<Campaign, CreateCampaignRequest>({
      query: (body) => ({
        url: apiV1Path('/kol/campaigns'),
        method: 'POST',
        body,
      }),
      transformResponse: (payload: CampaignEnvelope) =>
        ensureData(payload, 'Unable to create campaign'),
      invalidatesTags: ['Campaigns'],
    }),

    updateCampaignV2: builder.mutation<Campaign, UpdateCampaignArgs>({
      query: ({ campaignId, body }) => ({
        url: apiV1Path(`/kol/campaigns/${campaignId}`),
        method: 'PATCH',
        body,
      }),
      transformResponse: (payload: CampaignEnvelope) =>
        ensureData(payload, 'Unable to update campaign'),
      invalidatesTags: (result, error, arg) => [
        'Campaigns',
        { type: 'Campaigns', id: arg.campaignId },
        { type: 'Campaigns', id: `${arg.campaignId}-leaderboard` },
      ],
    }),

    deleteCampaignV2: builder.mutation<Campaign, string>({
      query: (campaignId) => ({
        url: apiV1Path(`/kol/campaigns/${campaignId}`),
        method: 'DELETE',
      }),
      transformResponse: (payload: CampaignEnvelope) =>
        ensureData(payload, 'Unable to delete campaign'),
      invalidatesTags: (result, error, campaignId) => [
        'Campaigns',
        { type: 'Campaigns', id: campaignId },
        { type: 'Campaigns', id: `${campaignId}-leaderboard` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCampaignsV2Query: useGetCampaignsQuery,
  useGetCampaignByIdV2Query: useGetCampaignByIdQuery,
  useGetCampaignLeaderboardV2Query: useGetCampaignLeaderboardQuery,
  useGetCampaignCountsV2Query: useGetCampaignCountsQuery,
  useCreateCampaignV2Mutation: useCreateCampaignMutation,
  useUpdateCampaignV2Mutation: useUpdateCampaignMutation,
  useDeleteCampaignV2Mutation: useDeleteCampaignMutation,
} = campaignApiV2
