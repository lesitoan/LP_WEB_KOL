export interface MemberItem {
  id: string
  lpexUid: string
  lpexUserStatus: string
  memberProgressStatus?: MemberProgressStatus | null
  registeredAtLpex: string
  telegramUserId: string
  telegramUsername: string
  telegramFirstName: string
  telegramLastName: string
  telegramStatus: string
  referrerKolId: string
  referrerKolCode: string
  countryCode: string
  usdVolume: string
  createdAt: string
  updatedAt: string
  eligibilityStatus?: string
  eligibleGroups?: {
    accessId: string
    groupId: string
    telegramGroupId: string
    title: string
    tierLabel: string
    minVolumeRequired: string
    maxVolumeRequired: string
    telegramMembershipState: string
    telegramMembershipStatus: string
    lastMembershipVerifiedAt: string | null
    iconKey?: string | null
  }[]
}

export type MemberProgressStatus = 'NOT_KYC' | 'KYC_COMPLETED' | 'DEPOSIT_COMPLETED' | 'TRADE_COMPLETED'

export interface MembersPagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface ListMembersQuery {
  page: number
  limit: number
  sortBy?: "telegramUsername" | "usdVolume" | "createdAt"
  sortOrder?: "asc" | "desc"
  search?: string
  countryCode?: string
  telegramStatus?: string
  lpexUserStatus?: string
  groupId?: string
  eligibilityStatus?: string
  membershipState?: string
  includeGroups?: boolean
}

export interface MembersData {
  items: MemberItem[]
  pagination: MembersPagination
}
