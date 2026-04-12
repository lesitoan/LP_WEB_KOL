'use client'

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GroupBenefit, UpdateGroupBenefitBody } from '@/types/api'
import { BenefitFormDialog } from './benefitFormDialog'

type EditBenefitDialogProps = {
  benefit: GroupBenefit
  onSave: (benefitId: string, payload: UpdateGroupBenefitBody) => Promise<void>
}

export function EditBenefitDialog({ benefit, onSave }: EditBenefitDialogProps) {
  return (
    <BenefitFormDialog
      dialogTitle="Chỉnh sửa benefit"
      submitText="Lưu thay đổi"
      trigger={(
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Chỉnh sửa benefit</span>
        </Button>
      )}
      initialValues={{
        benefitType: benefit.benefitType,
        benefitName: benefit.benefitName,
        benefitValue: benefit.benefitValue || '',
        sortOrder: String(benefit.sortOrder),
      }}
      onSubmitPayload={async (payload) => {
        await onSave(benefit.id, payload)
      }}
    />
  )
}
