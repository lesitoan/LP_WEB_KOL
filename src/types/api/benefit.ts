export interface GroupBenefit {
  id: string
  telegramGroupId: string
  benefitType: string
  benefitName: string
  benefitValue: string | null
  sortOrder: number
  createdAt: string
}

export interface CreateGroupBenefitBody {
  benefitType: string
  benefitName: string
  benefitValue?: string
  sortOrder?: number
}

export interface UpdateGroupBenefitBody {
  benefitType?: string
  benefitName?: string
  benefitValue?: string
  sortOrder?: number
}