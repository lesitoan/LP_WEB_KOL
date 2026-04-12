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
  groupId?: string
  eligibilityStatus?: string
  membershipState?: string
  includeGroups?: boolean
}

export interface MembersData {
  items: MemberItem[]
  pagination: MembersPagination
}