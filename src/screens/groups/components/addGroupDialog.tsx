'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CreateGroupBody } from '@/types/api'
import { GroupFormDialog } from './groupFormDialog'

interface AddGroupDialogProps {
  onAdd: (payload: CreateGroupBody) => Promise<void>
}

export function AddGroupDialog({ onAdd }: AddGroupDialogProps) {
  return (
    <GroupFormDialog
      dialogTitle="Thêm nhóm mới"
      submitText="Tạo nhóm"
      trigger={(
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhóm mới
        </Button>
      )}
      initialValues={{
        title: '',
        description: '',
        minVolumeRequired: '0',
        maxVolumeRequired: '10',
        warningCountBeforeKick: [2],
        gracePeriodDays: [7],
        autoKickEnabled: false,
        rejoinEnabled: true,
      }}
      onSubmitPayload={onAdd}
    />
  )
}

