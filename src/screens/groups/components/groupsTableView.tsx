'use client'

import { useRouter } from 'next/navigation'
import { Gift, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTablePagination, type DataTableColumn } from '@/components/ui/dataTable'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { GroupItem, UpdateGroupBody } from '@/types/api'
import { EditGroupDialog } from './editGroupDialog'
import { GroupSummaryDialog } from './groupSummaryDialog'

type GroupsTableViewProps = {
  groups: GroupItem[]
  isFetching?: boolean
  pagination: DataTablePagination
  onUpdateGroup: (groupId: string, payload: UpdateGroupBody) => Promise<void>
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
    <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium ${statusVariant}`}>
      {enabled ? 'Bật' : 'Tắt'}
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

export function GroupsTableView({ groups, isFetching = false, pagination, onUpdateGroup, onDeleteGroup }: GroupsTableViewProps) {
  const router = useRouter()

  const columns: DataTableColumn<GroupItem>[] = [
    {
      id: 'name',
      header: 'Tên nhóm',
      cell: (group) => (
        <div className="space-y-1 max-w-[240px]">
          <p className="font-medium truncate">{group.title}</p>
          <p className="text-xs text-muted-foreground">{truncateDescription(group.description)}</p>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (group) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium ${getStatusVariant(group.status || '')?.cssClass}`}>
          {getStatusVariant(group.status || '')?.label}
        </span>
      ),
    },
    {
      id: 'volume',
      header: 'Volume (USD)',
      cellClassName: 'font-geist-mono',
      cell: (group) => formatVolumeRange(group),
    },
    {
      id: 'warning',
      header: 'Cảnh báo',
      cell: (group) => `${group.warningCountBeforeKick} lần`,
    },
    {
      id: 'grace',
      header: 'Ân hạn',
      cell: (group) => `${group.gracePeriodDays ?? 7} ngày`,
    },
    {
      id: 'autoKick',
      header: 'Auto-kick',
      cell: (group) => <ToggleStatusBadge enabled={group.autoKickEnabled} />,
    },
    {
      id: 'rejoin',
      header: 'Rejoin',
      cell: (group) => <ToggleStatusBadge enabled={group.rejoinEnabled} />,
    },
    {
      id: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
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

  return (
    <DataTable
      columns={columns}
      data={groups}
      rowKey={(group) => group.id}
      isLoading={isFetching}
      emptyContent="Không có group phù hợp."
      className="border-none rounded-none"
      pagination={pagination}
    />
  )
}
