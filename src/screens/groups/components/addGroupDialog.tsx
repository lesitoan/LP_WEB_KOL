'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DEFAULT_GROUP_LOGO_KEY } from '@/lib/groupLogo'
import type { CreateGroupBody } from '@/types/api'
import { GroupFormDialog } from './groupFormDialog'

interface AddGroupDialogProps {
  onAdd: (payload: CreateGroupBody) => Promise<void>
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddGroupDialog({ onAdd, defaultOpen = false, open, onOpenChange }: AddGroupDialogProps) {
  return (
    <GroupFormDialog
      dialogTitle="Thêm nhóm mới"
      submitText="Tạo nhóm"
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      trigger={(
        <Button className="text-base font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhóm mới
        </Button>
      )}
      initialValues={{
        title: '',
        iconKey: DEFAULT_GROUP_LOGO_KEY,
        telegramGroupId: '',
        description: '',
        minVolumeRequired: '0',
        maxVolumeRequired: '10',
        warningCountBeforeKick: [2],
        gracePeriodDays: [7],
        autoKickEnabled: false,
        rejoinEnabled: true,
      }}
      onSubmitPayload={async (payload) => {
        await onAdd(payload as CreateGroupBody)
      }}
    />
  )
}
