'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Gift, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DataTable, type DataTablePagination, type DataTableColumn } from '@/components/ui/dataTable'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { GroupItem, UpdateGroupBody } from '@/types/api'
import { EditGroupDialog } from './editGroupDialog'
import { GroupLogoBadge } from './groupLogoBadge'
import { GroupSummaryDialog } from './groupSummaryDialog'

type GroupsTableViewProps = {
  groups: GroupItem[]
  isFetching?: boolean
  pagination: DataTablePagination
  onUpdateGroup: (groupId: string, payload: UpdateGroupBody) => Promise<void>
  onToggleGroupStatus: (groupId: string, title: string, nextStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>
  onDeleteGroup: (groupId: string, title: string) => Promise<void>
}

export function getStatusVariant(status: string) {
  const normalized = status.toLowerCase()
  if (normalized === 'active') return {
    cssClass: 'bg-success/[0.12] text-success border border-success/20',
    label: "Hoạt động"
  }
  if (normalized === 'inactive' || normalized === 'disabled') return {
    cssClass: 'bg-muted text-muted-foreground border border-border',
    label: "Không hoạt động"
  }
  if (normalized === 'paused') return {
    cssClass: 'bg-warning/[0.12] text-warning border border-warning/20',
    label: "Tạm dừng"
  }
  if (normalized === 'blocked') return {
    cssClass: 'bg-destructive/[0.12] text-destructive border border-destructive/20',
    label: "Bị chặn"
  }
  return {
    cssClass: 'bg-info/[0.12] text-info border border-info/20',
    label: "Không xác định"
  }
}

function ToggleStatusBadge({ enabled }: { enabled: boolean }) {
  const statusVariant = enabled ? getStatusVariant('active').cssClass : getStatusVariant('inactive').cssClass
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-base font-medium ${statusVariant}`}>
      {enabled ? 'Bật' : 'Tắt'}
    </span>
  )
}

function GroupToggleBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-base font-medium ${
        enabled ? 'bg-[#003F27] text-[#15C982]' : 'bg-[#2B2B2B] text-[#B7B7B7]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${enabled ? 'bg-[#15C982]' : 'bg-[#B7B7B7]'}`} />
      {enabled ? 'Bật' : 'Tắt'}
    </span>
  )
}

function GroupStatusSwitch({
  checked,
  disabled,
  onCheckedChange,
}: {
  checked: boolean
  disabled?: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Switch
        className="h-5 w-9 border-0 bg-[#2B2B2B] data-[state=checked]:bg-[#15C982] data-[state=unchecked]:bg-[#2B2B2B] [&_[data-slot=switch-thumb]]:size-4 [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-4 [&_[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-0.5"
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={checked ? 'Tắt nhóm' : 'Bật nhóm'}
      />
      <span className="text-base font-medium text-[#D7D7D7]">{checked ? 'Bật' : 'Tắt'}</span>
    </span>
  )
}

function truncateDescription(value: string | null, maxLength = 30) {
  const description = (value || '').trim()
  if (!description) return 'Chưa có mô tả'
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

export function GroupsTableView({ groups, isFetching = false, pagination, onUpdateGroup, onToggleGroupStatus, onDeleteGroup }: GroupsTableViewProps) {
  const router = useRouter()
  const [updatingStatusById, setUpdatingStatusById] = useState<Record<string, boolean>>({})

  const handleToggleGroupStatus = async (group: GroupItem, checked: boolean) => {
    const nextStatus = checked ? 'ACTIVE' : 'INACTIVE'
    setUpdatingStatusById((prev) => ({ ...prev, [group.id]: true }))
    try {
      await onToggleGroupStatus(group.id, group.title, nextStatus)
    } finally {
      setUpdatingStatusById((prev) => ({ ...prev, [group.id]: false }))
    }
  }

  const columns: DataTableColumn<GroupItem>[] = [
    {
      id: 'name',
      header: 'Tên nhóm',
      cell: (group) => (
        <div className="flex max-w-[260px] items-center gap-3">
          <GroupLogoBadge iconKey={group.iconKey} title={group.title} className="h-7 w-8" textClassName="text-sm" />
          <div className="min-w-0 space-y-1">
            <p className="truncate font-medium">{group.title}</p>
            <p className="truncate text-sm text-muted-foreground">{truncateDescription(group.description)}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (group) => {
        const isActive = (group.status || '').trim().toLowerCase() === 'active'
        const isUpdating = Boolean(updatingStatusById[group.id])

        return (
          <span className="inline-flex items-center gap-2">
          <Switch
            className="h-5 w-9 border-0 bg-[#2B2B2B] data-[state=checked]:bg-[#15C982] data-[state=unchecked]:bg-[#2B2B2B] [&_[data-slot=switch-thumb]]:size-4 [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-4 [&_[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-0.5"
            checked={isActive}
            disabled={isUpdating}
            onCheckedChange={(checked) => {
              void handleToggleGroupStatus(group, checked)
            }}
            aria-label={isActive ? 'Tắt nhóm' : 'Bật nhóm'}
          />
          <span className="text-base font-medium text-[#D7D7D7]">{isActive ? 'Bật' : 'Tắt'}</span>
          </span>
        )
      },
    },
    {
      id: 'volume',
      header: 'Volume (USD)',
      cell: (group) => formatVolumeRange(group),
    },
    {
      id: 'memberCount',
      header: 'Số lượng TV',
      cell: (group) => group.memberCount ?? 0,
    },
    {
      id: 'warning',
      header: 'Cảnh báo',
      cell: (group) => `${group.warningCountBeforeKick} lần`,
    },
    {
      id: 'grace',
      header: 'Ân hạn',
      cell: (group) => formatGracePeriodInDays(group),
    },
    {
      id: 'autoKick',
      header: 'Auto-kick',
      cell: (group) => <GroupToggleBadge enabled={group.autoKickEnabled} />,
    },
    {
      id: 'rejoin',
      header: 'Rejoin',
      cell: (group) => <GroupToggleBadge enabled={group.rejoinEnabled} />,
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: (group) => (
        <div className="flex items-center justify-end gap-1">
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDeleteGroup(group.id, group.title)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        </div>
      ),
    },
  ]
  const tableColumns = columns.map((column) => ({
    ...column,
    headerClassName: `!text-xs ${column.headerClassName ?? ''}`,
    cellClassName: `!text-base ${column.cellClassName ?? ''}`,
  }))

  return (
    <DataTable
      columns={tableColumns}
      data={groups}
      rowKey={(group) => group.id}
      isLoading={isFetching}
      emptyContent="Không có group phù hợp."
      className="border-none rounded-none"
      pagination={pagination}
    />
  )
}

