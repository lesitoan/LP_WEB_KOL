'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Gift, Power, Trash2, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field'
import type { GroupItem, UpdateGroupBody } from '@/types/api'
import { EditGroupDialog } from './editGroupDialog'
import { GroupSummaryDialog } from './groupSummaryDialog'

interface GroupSettingsCardProps {
  group: GroupItem
  onUpdateGroup: (groupId: string, payload: UpdateGroupBody) => Promise<void>
  onToggleGroupStatus: (groupId: string, title: string, nextStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>
  onDeleteGroup: (groupId: string, title: string) => Promise<void>
}

export function GroupSettingsCard({
  group,
  onUpdateGroup,
  onToggleGroupStatus,
  onDeleteGroup,
}: GroupSettingsCardProps) {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const volumeLabel = `${group.minVolumeRequired} - ${group.maxVolumeRequired} USD`
  const status = (group.status || '').toLowerCase()
  const titleFull = (group.title || '').trim()
  const titleDisplay = titleFull.length > 30 ? `${titleFull.slice(0, 30)}...` : titleFull

  const truncateDescription = (value: string | null, maxLength = 30) => {
    const description = (value || '').trim()
    if (!description) return 'Chưa có mô tả'
    return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description
  }

  const getStatusVariant = () => {
    if (status === 'active') return 'border-emerald-700 bg-emerald-200 text-emerald-950'
    if (status === 'inactive') return 'border-[#8f8f8f] bg-[#a3a3a3] text-[#262626] opacity-70'
    if (status === 'paused') return 'border-amber-300 bg-amber-100 text-amber-800'
    if (status === 'blocked') return 'border-violet-300 bg-violet-100 text-violet-800'
    return 'border-sky-300 bg-sky-100 text-sky-800'
  }

  const getStatusLabel = () => {
    if (status === 'active') return 'Đang hoạt động'
    if (status === 'inactive') return 'Không hoạt động'
    if (status === 'paused') return 'Tạm dừng'
    if (status === 'blocked') return 'Đã chặn'
    return group.status || 'Không xác định'
  }

  const isActive = status === 'active'

  const handleToggleStatus = async () => {
    const nextStatus = isActive ? 'INACTIVE' : 'ACTIVE'
    setIsUpdatingStatus(true)
    try {
      await onToggleGroupStatus(group.id, group.title, nextStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <Card className="relative transition-all duration-200 hover:border-[hsl(40_78%_55%/0.65)] hover:shadow-[0_0_0_1px_hsl(40_78%_55%/0.25),0_12px_28px_rgba(232,184,77,0.14)] hover:-translate-y-[1px]">
      <CardHeader className="flex flex-col items-start gap-1.5 p-4 sm:p-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <CardTitle className="order-2 text-base font-medium w-full truncate cursor-default">
              {titleDisplay}
            </CardTitle>
          </TooltipTrigger>
          <TooltipContent>{titleFull || group.title}</TooltipContent>
        </Tooltip>
        <div className="order-1 flex w-full items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? 'Mở rộng nội dung nhóm' : 'Thu gọn nội dung nhóm'}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
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
                className={`h-8 w-8 ${isActive ? 'text-emerald-500 hover:text-emerald-400' : 'text-rose-500 hover:text-rose-400'}`}
                onClick={() => {
                  void handleToggleStatus()
                }}
                disabled={isUpdatingStatus}
              >
                <Power className="h-4 w-4" />
                <span className="sr-only">{isActive ? 'Tắt nhóm' : 'Bật nhóm'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isActive ? 'Tắt nhóm' : 'Bật nhóm'}</TooltipContent>
          </Tooltip>
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
      </CardHeader>
      <CardContent className={`p-4 pt-0 sm:p-6 sm:pt-0 ${isCollapsed ? 'hidden' : ''}`}>
        <FieldGroup className="gap-5">
          <div className="space-y-2">
            <FieldLabel className="text-sm font-medium text-muted-foreground">
              Mô tả
            </FieldLabel>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                {truncateDescription(group.description)}
              </p>
            </div>
          </div>

          {/* Volume Threshold */}
          <Field orientation="horizontal" className="items-center justify-between">
            <FieldLabel className="text-sm font-medium text-muted-foreground">
              Ngưỡng volume (USD/30 ngày)
            </FieldLabel>
            <span className="text-lg font-semibold text-foreground">{volumeLabel}</span>
          </Field>

          <Field orientation="horizontal" className="items-center justify-between">
            <FieldLabel className="text-sm font-medium text-muted-foreground">
              Số lượng thành viên
            </FieldLabel>
            <span className="text-sm font-medium text-foreground text-right">{group.memberCount ?? 0}</span>
          </Field>

          <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <FieldLabel className="text-sm font-medium">Trạng thái nhóm</FieldLabel>
              <FieldDescription>Màu được map theo trạng thái hiện tại</FieldDescription>
            </div>
            <Badge variant="outline" className={`font-semibold ${getStatusVariant()}`}>
              {getStatusLabel()}
            </Badge>
          </Field>

          {/* Warning Count */}
          <Field orientation="horizontal" className="items-center justify-between">
            <div className="space-y-2">
              <FieldLabel className="text-sm font-medium text-muted-foreground">
                Số lần cảnh báo trước kick
              </FieldLabel>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i < group.warningCountBeforeKick ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm font-medium text-primary text-right">
              {group.warningCountBeforeKick} lần
            </span>
          </Field>

          {/* Grace Period */}
          <Field orientation="horizontal" className="items-center justify-between">
            <FieldLabel className="text-sm font-medium text-muted-foreground">
              Thời gian ân hạn (ngày)
            </FieldLabel>
            <span className="text-sm font-medium text-foreground text-right">
              {group.gracePeriodDays ?? 7} ngày
            </span>
          </Field>

          {/* Auto-kick Toggle */}
          <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Bật/tắt auto-kick</Label>
              <p className="text-sm text-muted-foreground">
                {group.autoKickEnabled
                  ? 'Tự động kick khi vượt ngưỡng cảnh báo'
                  : 'Chỉ gửi cảnh báo, không tự động kick'}
              </p>
            </div>
            <Switch
              checked={group.autoKickEnabled}
              disabled
            />
          </Field>

          {/* Allow Rejoin Toggle */}
          <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Cho phép rejoin</Label>
              <p className="text-sm text-muted-foreground">
                {group.rejoinEnabled
                  ? 'Thành viên có thể tham gia lại sau khi bị kick'
                  : 'Không cho phép tham gia lại'}
              </p>
            </div>
            <Switch
              checked={group.rejoinEnabled}
              disabled
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

