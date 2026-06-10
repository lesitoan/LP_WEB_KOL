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
  return `${group.minVolumeRequired}-${group.maxVolumeRequired}`
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
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        enabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-muted-foreground'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${enabled ? 'bg-emerald-400' : 'bg-muted-foreground'}`} />
      {enabled ? 'Bật' : 'Tắt'}
    </span>
  )
}

function MetricRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-6 items-center justify-between gap-3 text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right font-medium text-foreground">{children}</div>
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
    <article className="relative overflow-visible rounded-xl border border-[#4A4A4A] bg-[#171717] p-4 shadow-sm">
      <div className="absolute left-0 top-7 h-8 w-1 rounded-r-full bg-[#FFCC00]" />

      <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#3D3D3D] pb-4">
        <div className="min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="truncate text-sm font-semibold text-foreground">{group.title || 'Tên group'}</h3>
            </TooltipTrigger>
            <TooltipContent>{group.title || 'Tên group'}</TooltipContent>
          </Tooltip>
          <p className="mt-1 truncate text-xs text-muted-foreground">{truncateDescription(group.description)}</p>
        </div>

        <div className="relative shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg bg-[#28282880] hover:bg-[#333333]"
            onClick={() => setActionsOpen((open) => !open)}
            aria-label="Mở hành động"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {actionsOpen ? (
            <div className="absolute right-0 top-10 z-20 flex items-center gap-1 rounded-lg border border-border bg-[#222222] p-1 shadow-xl">
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

      <div className="space-y-2.5">
        <MetricRow label="Ngưỡng volume">{formatVolumeRange(group)}</MetricRow>
        <MetricRow label="Trạng thái">
          <span className="inline-flex items-center gap-2">
            <Switch
              className="scale-90"
              checked={isActive}
              disabled={isUpdatingStatus}
              onCheckedChange={(checked) => {
                void handleToggleStatus(checked)
              }}
              aria-label={isActive ? 'Tắt nhóm' : 'Bật nhóm'}
            />
            {isActive ? 'Bật' : 'Tắt'}
          </span>
        </MetricRow>
        <MetricRow label="Số lượng TV">{group.memberCount ?? 0}</MetricRow>
        <MetricRow label="Cảnh báo">{group.warningCountBeforeKick} lần</MetricRow>
        <MetricRow label="Ân hạn">{formatGracePeriodInDays(group)}</MetricRow>
        <MetricRow label="Auto-kick">
          <TogglePill enabled={group.autoKickEnabled} />
        </MetricRow>
        <MetricRow label="Rejoin">
          <TogglePill enabled={group.rejoinEnabled} />
        </MetricRow>
      </div>
    </article>
  )
}
