'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronDown, Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useGetGroupsQuery } from '@/services/api/groupsApi'
import type { GroupItem } from '@/types/api'
import type { PublishKolInsightTarget } from '@/types/api/kolInsight'
import type { InsightListItem } from '@/types/insights'

type PublishInsightModalProps = {
  insight: InsightListItem | null
  open: boolean
  isPublishing?: boolean
  onOpenChange: (open: boolean) => void
  onPublish: (insightId: string, targets: PublishKolInsightTarget[]) => Promise<boolean>
}

function isGroupPublishable(group: GroupItem) {
  return Boolean(group.telegramGroupId) && group.status === 'ACTIVE'
}

function truncateLabel(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`
}

export default function PublishInsightModal({
  insight,
  open,
  isPublishing = false,
  onOpenChange,
  onPublish,
}: PublishInsightModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [groupSelectOpen, setGroupSelectOpen] = useState(false)
  const groupsQuery = useGetGroupsQuery({ page: 1, limit: 100, status: 'ACTIVE' }, { skip: !open })

  const groups = groupsQuery.data?.items ?? []
  const publishableGroups = groups.filter(isGroupPublishable)
  const selectedGroup = useMemo(
    () => publishableGroups.find((group) => group.id === selectedGroupId) ?? null,
    [publishableGroups, selectedGroupId],
  )

  const isGroupSelectDisabled = groupsQuery.isLoading || groupsQuery.isFetching || !publishableGroups.length
  const groupSelectPlaceholder =
    groupsQuery.isLoading || groupsQuery.isFetching
      ? 'Đang tải danh sách nhóm'
      : publishableGroups.length
        ? 'Chọn nhóm'
        : 'Không có dữ liệu'

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedGroupId('')
      setGroupSelectOpen(false)
    }
    onOpenChange(nextOpen)
  }

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
    setGroupSelectOpen(false)
  }

  const handlePublish = async () => {
    if (!insight || !selectedGroupId) return

    const published = await onPublish(insight.id, [
      {
        targetTelegramGroupId: selectedGroupId,
      },
    ])

    if (published) {
      handleOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-24px)] w-[calc(100vw-16px)] max-w-[560px] gap-0 overflow-visible rounded-2xl border-[#282828] bg-[#171717] p-0 shadow-2xl sm:w-[calc(100vw-48px)]"
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-[#282828] px-4 py-4 text-left sm:px-6">
          <DialogTitle className="flex min-w-0 items-center gap-2 text-base md:text-lg font-medium leading-[30px] text-white">
            <img src="/images/insights/detail-icon.svg" alt="" className="h-5 w-5 shrink-0" />
            <span className="shrink-0">Đăng tin</span>
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[#A8A8A9] sm:block" />
            <span className="hidden min-w-0 truncate text-sm md:text-base font-normal text-[#A8A8A9] sm:block">
              {truncateLabel(insight?.title ?? '-', 34)}
            </span>
          </DialogTitle>

          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#282828] text-white transition-colors hover:bg-[#343434]"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </DialogHeader>

        <div className="px-4 py-5 sm:px-6">
          <div className="relative min-w-0 space-y-2">
            <span className="block text-sm font-semibold leading-5 text-white">Chọn nhóm publish</span>
            <button
              type="button"
              disabled={isGroupSelectDisabled}
              onClick={() => setGroupSelectOpen((current) => !current)}
              className={cn(
                'flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-[#545454] bg-[#222222] px-3 text-left text-[13px] md:text-sm text-white outline-none transition-colors hover:border-[#777777] focus:border-[#F7F0A1]/70 disabled:cursor-not-allowed disabled:opacity-50',
                groupSelectOpen && 'border-[#F7F0A1]/70',
              )}
            >
              <span className={cn('min-w-0 flex-1 truncate', !selectedGroup && 'text-[#A8A8A9]')}>
                {selectedGroup ? truncateLabel(selectedGroup.title, 42) : groupSelectPlaceholder}
              </span>
              <ChevronDown
                className={cn('h-4 w-4 shrink-0 text-[#A8A8A9] transition-transform', groupSelectOpen && 'rotate-180')}
              />
            </button>

            {groupSelectOpen ? (
              <div className="scrollbar-thin-brand absolute left-0 right-0 top-[calc(100%+6px)] z-[70] max-h-[220px] overflow-y-auto rounded-lg border border-[#545454] bg-[#222222] p-1 shadow-2xl">
                {publishableGroups.map((group) => {
                  const isSelected = selectedGroupId === group.id

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => handleSelectGroup(group.id)}
                      className={cn(
                        'flex h-9 w-full min-w-0 items-center justify-between gap-3 rounded-md px-3 text-left text-[13px] md:text-sm text-white transition-colors hover:bg-[#303030]',
                        isSelected && 'bg-[#34341F] text-[#F7F0A1]',
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{truncateLabel(group.title, 42)}</span>
                      {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid min-w-0 gap-3 border-t border-[#282828] px-4 py-4 sm:grid-cols-[minmax(0,154px)_minmax(0,154px)] sm:justify-end sm:px-6">
          <Button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="h-9 w-full min-w-0 max-w-full overflow-hidden rounded-lg bg-[#FDFDFD] px-3 text-[13px] md:text-sm font-semibold text-black hover:bg-zinc-200"
          >
            <span className="truncate">Trở lại</span>
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || !selectedGroupId}
            className="h-9 w-full min-w-0 max-w-full overflow-hidden rounded-lg bg-[#F7F0A1] px-3 text-[13px] md:text-sm font-semibold text-black hover:bg-[#FFF7B8]"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/images/insights/publish-icon.svg" alt="" className="h-4 w-4" />}
            <span className="truncate">Đăng tin</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
