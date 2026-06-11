export interface KolTier {
  id: string
  code: string
  name: string
  iconKey?: string | null
  themeKey?: string | null
  shortDescription?: string | null
  minActiveMembers: number
  maxActiveMembers: number | null
  commissionRatePct: string
  dataPackageCode: string
  sortOrder?: number
  isActive?: boolean
  features?: KolTierFeature[]
  description: string | null
  createdAt: string
}

export interface KolTierFeature {
  id: string
  label: string
  sortOrder: number
  isIncluded: boolean
}

export interface KolTierKOLProfile {
  id: string
  code: string
  displayName: string
  currentTierId: string | null
  currentCommissionRate: string | null
}

export interface KolCurrentTierData {
  kol: KolTierKOLProfile
  activeMemberCount: number
  currentTier: KolTier | null
  matchedTier: KolTier | null
  nextTier: KolTier | null
  membersNeededForNextTier: number | null
}
