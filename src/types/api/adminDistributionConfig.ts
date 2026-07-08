import type { ContentDistributionScheduleType, ContentTypeCode } from './adminInsight'

export type DistributionTierCode = 'STARTER' | 'PARTNER' | 'ELITE' | 'LEGEND'

export interface AdminDistributionTierConfig {
  tierId: string
  tierCode: DistributionTierCode
  label: string
  memberRangeLabel: string
  memberRangeMin: number
  memberRangeMax: number | null
  commissionRatePct: number
  offsetMinutes: number
  sortOrder: number
  count?: number | null
}

export interface AdminDistributionTierAssignment {
  tierId: string
  tierCode: DistributionTierCode
  tierName: string
}

export interface AdminDistributionContentTypeConfig {
  code: ContentTypeCode
  groupKey: string
  label: string
  defaultScheduleType: ContentDistributionScheduleType
  defaultHour: number | null
  defaultMinute: number | null
  defaultDayOfWeek: number | null
  relativeMinutesMin: number | null
  relativeMinutesMax: number | null
  defaultTimeLabel: string | null
  triggerCondition: string | null
  enabledTiers: {
    starter: boolean
    partner: boolean
    elite: boolean
    legend: boolean
  }
  tierAssignments: AdminDistributionTierAssignment[]
  sortOrder: number
}

export interface AdminDistributionConfig {
  tiers: AdminDistributionTierConfig[]
  contentTypes: AdminDistributionContentTypeConfig[]
}

export interface UpdateAdminDistributionTierConfigBodyItem {
  tierCode: DistributionTierCode
  offsetMinutes: number
}

export interface UpdateAdminDistributionContentTypeConfigBodyItem {
  code: ContentTypeCode
  starterEnabled?: boolean
  partnerEnabled?: boolean
  eliteEnabled?: boolean
  legendEnabled?: boolean
}

export interface UpdateAdminDistributionConfigBody {
  tiers?: UpdateAdminDistributionTierConfigBodyItem[]
  contentTypes?: UpdateAdminDistributionContentTypeConfigBodyItem[]
}
