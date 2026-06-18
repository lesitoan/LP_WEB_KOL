'use client'

import type { GroupItem, UpdateGroupBody } from '@/types/api'
import { GroupSettingsCard } from './groupSettingsCard'

type GroupsItemViewProps = {
  groups: GroupItem[]
  onUpdateGroup: (groupId: string, payload: UpdateGroupBody) => Promise<void>
  onToggleGroupStatus: (groupId: string, title: string, nextStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>
  onDeleteGroup: (groupId: string, title: string) => Promise<void>
}

export function GroupsItemView({ groups, onUpdateGroup, onToggleGroupStatus, onDeleteGroup }: GroupsItemViewProps) {
  return (
    <div className="grid items-start gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupSettingsCard
          key={group.id}
          group={group}
          onUpdateGroup={onUpdateGroup}
          onToggleGroupStatus={onToggleGroupStatus}
          onDeleteGroup={onDeleteGroup}
        />
      ))}
    </div>
  )
}
