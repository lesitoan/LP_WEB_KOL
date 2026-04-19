'use client'

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CreateGroupBody, GroupItem, UpdateGroupBody } from '@/types/api'
import { GroupFormDialog } from './groupFormDialog'

interface EditGroupDialogProps {
  group: GroupItem
  onSave: (groupId: string, payload: UpdateGroupBody) => Promise<void>
}

export function EditGroupDialog({ group, onSave }: EditGroupDialogProps) {
  const initialValues = {
    title: group.title ?? '',
    telegramGroupId: group.telegramGroupId ?? '',
    description: group.description ?? '',
    minVolumeRequired: group.minVolumeRequired ?? '0',
    maxVolumeRequired: group.maxVolumeRequired ?? '0',
    warningCountBeforeKick: [group.warningCountBeforeKick ?? 2],
    gracePeriodDays: [group.gracePeriodDays ?? 7],
    autoKickEnabled: group.autoKickEnabled,
    rejoinEnabled: group.rejoinEnabled,
  }

  return (
    <GroupFormDialog
      dialogTitle="Chỉnh sửa group"
      submitText="Lưu thay đổi"
      trigger={(
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Chỉnh sửa</span>
        </Button>
      )}
      initialValues={initialValues}
      onSubmitPayload={async (payload: CreateGroupBody) => {
        await onSave(group.id, payload)
      }}
    />
  )
}

