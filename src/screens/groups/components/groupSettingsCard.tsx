'use client'

import { useRouter } from 'next/navigation'
import { Gift, Trash2, Users } from 'lucide-react'
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
  onDeleteGroup: (groupId: string, title: string) => Promise<void>
}

export function GroupSettingsCard({
  group,
  onUpdateGroup,
  onDeleteGroup,
}: GroupSettingsCardProps) {
  const router = useRouter()
  const volumeLabel = `${group.minVolumeRequired} - ${group.maxVolumeRequired} USD`
  const status = (group.status || '').toLowerCase()

  const truncateDescription = (value: string | null, maxLength = 30) => {
    const description = (value || '').trim()
    if (!description) return 'Chưa có mô tả'
    return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description
  }

  const getStatusVariant = () => {
    if (status === 'active') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (status === 'inactive') return 'bg-slate-100 text-slate-700 border-slate-200'
    if (status === 'paused') return 'bg-amber-100 text-amber-700 border-amber-200'
    if (status === 'blocked') return 'bg-rose-100 text-rose-700 border-rose-200'
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{group.title}</CardTitle>
        <div className="flex items-center gap-1">
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
      </CardHeader>
      <CardContent>
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

          <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <FieldLabel className="text-sm font-medium">Trạng thái nhóm</FieldLabel>
              <FieldDescription>Màu được map theo trạng thái hiện tại</FieldDescription>
            </div>
            <Badge variant="outline" className={getStatusVariant()}>
              {group.status}
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
              Thời gian ân hạn (grace period)
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

