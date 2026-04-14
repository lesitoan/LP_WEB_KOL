import { useForm } from 'react-hook-form'
import type { CashbackConfigStatus, DistributionCycle } from '@/types/api'
import { toDateInputValue } from '../constants'

export type CashbackConfigFormValues = {
  telegramGroupId: string
  cashbackRatePct: string
  distributionCycle: DistributionCycle
  minPayoutUsd: string
  effectiveFrom: string
  effectiveTo: string
  status: CashbackConfigStatus
}

export function useCashbackConfigForm() {
  const now = new Date()
  const inThirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return useForm<CashbackConfigFormValues>({
    defaultValues: {
      telegramGroupId: '',
      cashbackRatePct: '10',
      distributionCycle: 'weekly',
      minPayoutUsd: '1',
      effectiveFrom: toDateInputValue(now),
      effectiveTo: toDateInputValue(inThirtyDays),
      status: 'active',
    },
  })
}
