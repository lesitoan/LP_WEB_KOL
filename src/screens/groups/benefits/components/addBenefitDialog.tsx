'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CreateGroupBenefitBody } from '@/types/api'
import { BenefitFormDialog } from './benefitFormDialog'

type AddBenefitDialogProps = {
  onAdd: (payload: CreateGroupBenefitBody) => Promise<void>
}

export function AddBenefitDialog({ onAdd }: AddBenefitDialogProps) {
  return (
    <BenefitFormDialog
      dialogTitle="Thêm benefit"
      submitText="Tạo benefit"
      trigger={(
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm benefit
        </Button>
      )}
      initialValues={{
        benefitType: '',
        benefitName: '',
        benefitValue: '',
        sortOrder: '0',
      }}
      onSubmitPayload={onAdd}
    />
  )
}
