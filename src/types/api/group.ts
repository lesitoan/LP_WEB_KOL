export interface GroupItem {
  id: string
  kolId: string
  telegramGroupId: string | null
  title: string
  iconKey: string | null
  tierLabel: string | null
  description: string | null
  minVolumeRequired: string
  maxVolumeRequired: string
  autoKickEnabled: boolean
  rejoinEnabled: boolean
  warningCountBeforeKick: number
  gracePeriodHours?: number | null
  gracePeriodDays: number | null
  announcementEnabled: boolean
  status: string
  memberCount?: number
  createdAt: string
  updatedAt: string
}

export interface UpdateGroupBody {
  telegramGroupId?: string
  title?: string
  iconKey?: string | null
  tierLabel?: string
  description?: string
  minVolumeRequired?: number
  maxVolumeRequired?: number
  autoKickEnabled?: boolean
  rejoinEnabled?: boolean
  warningCountBeforeKick?: number
  gracePeriodHours?: number
  announcementEnabled?: boolean
}

export type GroupStatusUpdateValue = 'ACTIVE' | 'INACTIVE'

export interface UpdateGroupStatusBody {
  status: GroupStatusUpdateValue
}

export interface CreateGroupBody {
  telegramGroupId?: string
  title: string
  iconKey?: string | null
  tierLabel?: string
  description?: string
  minVolumeRequired?: number
  maxVolumeRequired?: number
  autoKickEnabled?: boolean
  rejoinEnabled?: boolean
  warningCountBeforeKick?: number
  gracePeriodHours?: number
  announcementEnabled?: boolean
  status?: string
}

export interface ListGroupsQuery {
  page: number
  limit: number
  search?: string
  status?: string
}

export interface ListGroupMembersQuery {
  page: number
  limit: number
  sortBy?: "telegramUsername" | "usdVolume" | "createdAt"
  sortOrder?: "asc" | "desc"
  search?: string
  countryCode?: string
  telegramStatus?: string
  lpexUserStatus?: string
}

export interface GroupSummaryGroupInfo {
  id: string
  kolId: string
  minVolumeRequired: string
  maxVolumeRequired: string
  title: string
  status: string
}

export interface GroupAccessSummaryData {
  group: GroupSummaryGroupInfo
  accessSummary: Record<string, number | string | null>
}

export type UpdateGroupPayload = UpdateGroupBody

export interface GroupsPagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface GroupsData {
  items: GroupItem[]
  pagination: GroupsPagination
}
