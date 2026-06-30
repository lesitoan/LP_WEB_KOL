export type CampaignRankingType = 'TOP_VOLUME' | 'TOP_TRADE_COUNT' | 'TOP_GROWTH'

export type CampaignStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'CANCELLED'

export type CampaignCreateStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE'

export type CampaignUpdateStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'CANCELLED'

export type CampaignScopeType = 'ALL_GROUPS' | 'SINGLE_GROUP'

export type CampaignAnnounceFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'END_ONLY'

export type CampaignHistoryFilter = 'ALL' | CampaignStatus

export interface CampaignReward {
  rankFrom: number
  rankTo: number
  label: string
}

export interface CampaignLeaderboardSummary {
  participantCount: number
  totalVolumeUsd: string
}

export interface Campaign {
  id: string
  kolId: string
  telegramGroupId: string | null
  name: string
  description: string | null
  rankingType: CampaignRankingType
  scopeType: CampaignScopeType
  status: CampaignStatus
  startAt: string
  endAt: string
  rewards: CampaignReward[]
  announceFrequency: CampaignAnnounceFrequency
  announceHour: number | null
  announceMinute: number | null
  announceDayOfWeek: number | null
  lastCalculatedAt: string | null
  finalizedAt: string | null
  createdAt: string
  updatedAt: string
  leaderboardSummary?: CampaignLeaderboardSummary
}

export interface CampaignLeaderboardMember {
  id: string
  lpexUid: string
  telegramUserId: string
  telegramUsername: string | null
  telegramFirstName: string | null
  telegramLastName: string | null
  countryCode: string | null
}

export interface CampaignLeaderboardItem {
  id: string
  campaignId: string
  memberId: string
  rank: number
  score: string
  totalVolumeUsd: string | null
  totalTradeCount: number | null
  growthPercent: string | null
  calculatedAt: string
  createdAt: string
  updatedAt: string
  member: CampaignLeaderboardMember
}

export interface Pagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface PaginatedData<TItem> {
  items: TItem[]
  pagination: Pagination
}

export interface GetCampaignsQuery {
  page?: number
  limit?: number
  status?: CampaignStatus
  rankingType?: CampaignRankingType
  search?: string
  telegramGroupId?: string
}

export interface GetCampaignLeaderboardQuery {
  campaignId: string
  page?: number
  limit?: number
  search?: string
}

export interface CreateCampaignRequest {
  name: string
  description?: string | null
  rankingType: CampaignRankingType
  scopeType?: CampaignScopeType
  telegramGroupId?: string | null
  startAt: string
  endAt: string
  rewards: CampaignReward[]
  announceFrequency?: CampaignAnnounceFrequency
  announceHour?: number | null
  announceMinute?: number | null
  announceDayOfWeek?: number | null
  status?: CampaignCreateStatus
}

export interface UpdateCampaignRequest {
  name?: string
  description?: string | null
  rankingType?: CampaignRankingType
  scopeType?: CampaignScopeType
  telegramGroupId?: string | null
  startAt?: string
  endAt?: string
  rewards?: CampaignReward[]
  announceFrequency?: CampaignAnnounceFrequency
  announceHour?: number | null
  announceMinute?: number | null
  announceDayOfWeek?: number | null
  status?: CampaignUpdateStatus
}

export interface UpdateCampaignArgs {
  campaignId: string
  body: UpdateCampaignRequest
}

export type CampaignCounts = Record<CampaignHistoryFilter, number>
