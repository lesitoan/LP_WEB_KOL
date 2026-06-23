export type CampaignRankingType = 'TOP_VOLUME' | 'TOP_TRADE_COUNT' | 'TOP_GROWTH'
export type CampaignScopeType = 'ALL_GROUPS' | 'SINGLE_GROUP'
export type CampaignStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'CANCELLED' 
export type CampaignAnnounceFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'END_ONLY'

export interface CampaignReward {
  rankFrom: number
  rankTo: number
  label: string
}

export interface CampaignData {
  id: string
  name: string
  description?: string
  rankingType: CampaignRankingType
  scopeType: CampaignScopeType
  telegramGroupId?: string | null
  startAt: string
  endAt: string
  rewards: CampaignReward[]
  announceFrequency: CampaignAnnounceFrequency
  announceHour?: number | null
  announceMinute?: number | null
  announceDayOfWeek?: number | null
  status: CampaignStatus
  participantCount?: number
  totalVolumeUsd?: number
}

export interface LeaderboardEntry {
  rank: number
  lpexUid: string
  telegramUsername: string
  usdVolume: string
  tradeCount?: number
}

export interface GetCampaignsQuery {
  page?: number
  limit?: number
  status?: CampaignStatus
  rankingType?: CampaignRankingType
  search?: string
}
