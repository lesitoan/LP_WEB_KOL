export interface MemberItem {
  id: string
  lpexUid: string
  lpexUserStatus: string
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
  }[]
}

export interface MembersPagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface ListMembersQuery {
  page: number
  limit: number
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
