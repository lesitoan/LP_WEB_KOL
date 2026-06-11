'use client'

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DEFAULT_GROUP_LOGO_KEY } from '@/lib/groupLogo'
import type { GroupItem, UpdateGroupBody } from '@/types/api'
import { GroupFormDialog } from './groupFormDialog'

interface EditGroupDialogProps {
  group: GroupItem
  onSave: (groupId: string, payload: UpdateGroupBody) => Promise<void>
}

export function EditGroupDialog({ group, onSave }: EditGroupDialogProps) {
  const gracePeriodDays = typeof group.gracePeriodHours === 'number'
    ? Math.max(1, Math.round(group.gracePeriodHours / 24))
    : (group.gracePeriodDays ?? 7)

  const initialValues = {
    title: group.title ?? '',
    iconKey: group.iconKey ?? DEFAULT_GROUP_LOGO_KEY,
    telegramGroupId: group.telegramGroupId ?? '',
    description: group.description ?? '',
    minVolumeRequired: group.minVolumeRequired ?? '0',
    maxVolumeRequired: group.maxVolumeRequired ?? '0',
    warningCountBeforeKick: [group.warningCountBeforeKick ?? 2],
    gracePeriodDays: [gracePeriodDays],
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
      submitMode="update"
      onSubmitPayload={async (payload: UpdateGroupBody) => {
        await onSave(group.id, payload)
      }}
    />
  )
}

