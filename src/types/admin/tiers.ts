export interface AdminTier {
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
