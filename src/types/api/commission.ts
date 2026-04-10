export interface CommissionSummary {
  totalCommission: number
  totalCashback: number
}

export interface CommissionItem {
  id: string
  amount: number
  type: 'commission' | 'cashback'
  createdAt: string
  note?: string
}
