'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Gift, MoreHorizontal, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { GroupItem, UpdateGroupBody } from '@/types/api'
import { EditGroupDialog } from './editGroupDialog'
import { GroupSummaryDialog } from './groupSummaryDialog'

interface GroupSettingsCardProps {
  group: GroupItem
  onUpdateGroup: (groupId: string, payload: UpdateGroupBody) => Promise<void>
  onToggleGroupStatus: (groupId: string, title: string, nextStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>
  onDeleteGroup: (groupId: string, title: string) => Promise<void>
}

function truncateDescription(value: string | null, maxLength = 32) {
  const description = (value || '').trim()
  if (!description) return 'Mô tả về group'
  return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description
}

function formatVolumeRange(group: GroupItem) {
  return `${group.minVolumeRequired} - ${group.maxVolumeRequired}`
}

function formatGracePeriodInDays(group: GroupItem) {
  const rawHours =
    typeof group.gracePeriodHours === 'number'
      ? group.gracePeriodHours
      : typeof group.gracePeriodDays === 'number'
        ? group.gracePeriodDays * 24
        : 24 * 7

  const days = rawHours / 24
  const formattedDays = Number.isInteger(days) ? String(days) : days.toFixed(1).replace(/\.0$/, '')
  return `${formattedDays} ngày`
}

function TogglePill({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal ${
        enabled ? 'bg-[#003F27] text-[#15C982]' : 'bg-[#2B2B2B] text-[#D7D7D7]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${enabled ? 'bg-[#15C982]' : 'bg-[#D7D7D7]'}`} />
      {enabled ? 'Bật' : 'Tắt'}
    </span>
  )
}

function MetricBlock({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`min-w-0 ${className || ''}`}>
      <p className="text-xs font-normal text-[#A5A5A5]">{label}</p>
      <div className="mt-2 break-words text-base font-normal text-[#F4F4F4]">{children}</div>
    </div>
  )
}

export function GroupSettingsCard({
  group,
  onUpdateGroup,
  onToggleGroupStatus,
  onDeleteGroup,
}: GroupSettingsCardProps) {
  const router = useRouter()
  const [actionsOpen, setActionsOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const status = (group.status || '').trim().toLowerCase()
  const isActive = status === 'active'

  const handleToggleStatus = async (checked: boolean) => {
    const nextStatus = checked ? 'ACTIVE' : 'INACTIVE'
    setIsUpdatingStatus(true)
    try {
      await onToggleGroupStatus(group.id, group.title, nextStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <article className="relative overflow-visible rounded-[20px] sm:rounded-[28px] border border-[#4A4A4A] bg-[#171717] p-4 sm:p-6 shadow-sm">
      <div className="mb-6 sm:mb-8 flex items-center justify-between gap-1.5 sm:gap-4">
        <div className="min-w-0 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="truncate text-base font-normal text-[#F4F4F4]">{group.title || 'Tên group'}</h3>
              </TooltipTrigger>
              <TooltipContent>{group.title || 'Tên group'}</TooltipContent>
            </Tooltip>
            <p className="truncate text-sm font-normal text-[#A5A5A5]">{truncateDescription(group.description)}</p>
        </div>

        <div className="relative shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-[#282828] text-[#F4F4F4] hover:bg-[#333333] hover:text-white"
            onClick={() => setActionsOpen((open) => !open)}
            aria-label="Mở hành động"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {actionsOpen ? (
            <div className="absolute right-0 top-11 z-20 flex items-center gap-1 rounded-lg border border-border bg-[#222222] p-1 shadow-xl">
              <GroupSummaryDialog groupId={group.id} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push(`/groups/${group.id}/members`)}
                  >
                    <Users className="h-4 w-4" />
                    <span className="sr-only">Xem thành viên</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xem thành viên</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push(`/groups/${group.id}/benefits`)}
                  >
                    <Gift className="h-4 w-4" />
                    <span className="sr-only">Quản lý benefit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quản lý benefit</TooltipContent>
              </Tooltip>
              <EditGroupDialog group={group} onSave={onUpdateGroup} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDeleteGroup(group.id, group.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xóa</TooltipContent>
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex min-h-[72px] sm:min-h-[84px] items-center justify-between gap-2 sm:gap-4 rounded-xl border border-[#2A2A2A] px-3 py-2 sm:px-4 sm:py-3">
        <span className="text-xs font-normal text-[#A5A5A5]">Trạng thái</span>
        <span className="inline-flex items-center gap-3 text-base font-normal text-[#F4F4F4]">
          <Switch
            className="h-6 w-[38px] border-0 bg-[#2B2B2B] data-[state=checked]:bg-[#15C982] data-[state=unchecked]:bg-[#2B2B2B] [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-4 [&_[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-0.5"
            checked={isActive}
            disabled={isUpdatingStatus}
            onCheckedChange={(checked) => {
              void handleToggleStatus(checked)
            }}
            aria-label={isActive ? 'Tắt nhóm' : 'Bật nhóm'}
          />
          {isActive ? 'Bật' : 'Tắt'}
        </span>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-4">
        <MetricBlock label="Volume (VNĐ)">{formatVolumeRange(group)}</MetricBlock>
        <MetricBlock label="Số lượng TV" className="text-right flex flex-col items-end">{group.memberCount ?? 0}</MetricBlock>
        <MetricBlock label="Cảnh báo">{group.warningCountBeforeKick} lần</MetricBlock>
        <MetricBlock label="Ân hạn" className="text-right flex flex-col items-end">{formatGracePeriodInDays(group)}</MetricBlock>
        <MetricBlock label="Auto-kick">
          <TogglePill enabled={group.autoKickEnabled} />
        </MetricBlock>
        <MetricBlock label="Rejoin" className="text-right flex flex-col items-end">
          <TogglePill enabled={group.rejoinEnabled} />
        </MetricBlock>
      </div>
    </article>
  )
}
