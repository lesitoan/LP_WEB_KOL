export interface KolTier {
  id: string
  code: string
  name: string
  minActiveMembers: number
  maxActiveMembers: number | null
  commissionRatePct: string
  dataPackageCode: string
  description: string | null
  createdAt: string
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
