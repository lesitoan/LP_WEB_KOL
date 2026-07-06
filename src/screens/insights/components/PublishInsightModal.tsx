'use client'

import { useCallback, useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'

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
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set())
  const groupsQuery = useGetGroupsQuery({ page: 1, limit: 100, status: 'ACTIVE' }, { skip: !open })

  const groups = groupsQuery.data?.items ?? []
  const publishableGroups = groups.filter(isGroupPublishable)

  const allSelected = publishableGroups.length > 0 && selectedGroupIds.size === publishableGroups.length

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedGroupIds(new Set())
    }
    onOpenChange(nextOpen)
  }

  const handleToggleGroup = useCallback((groupId: string) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }, [])

  const handleToggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedGroupIds(new Set())
    } else {
      setSelectedGroupIds(new Set(publishableGroups.map((g) => g.id)))
    }
  }, [allSelected, publishableGroups])

  const handlePublish = async () => {
    if (!insight || selectedGroupIds.size === 0) return

    const targets: PublishKolInsightTarget[] = Array.from(selectedGroupIds).map((id) => ({
      targetTelegramGroupId: id,
    }))

    const published = await onPublish(insight.id, targets)

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
          <div className="min-w-0 space-y-3">
            {/* Label row with select-all toggle */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="block text-sm font-semibold leading-5 text-white">Chọn nhóm publish</span>
                <span className="block text-xs leading-4 text-[#A8A8A9] mt-0.5">Có thể chọn nhiều nhóm</span>
              </div>
              <button
                type="button"
                disabled={groupsQuery.isLoading || groupsQuery.isFetching || !publishableGroups.length}
                onClick={handleToggleAll}
                className="shrink-0 rounded-lg border border-[#545454] bg-transparent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#777777] hover:bg-[#282828] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {allSelected ? 'Bỏ chọn' : 'Chọn tất cả'}
              </button>
            </div>

            {/* Checkbox list */}
            <div className="scrollbar-thin-brand max-h-[240px] overflow-y-auto rounded-lg border border-[#545454] bg-[#222222]">
              {groupsQuery.isLoading || groupsQuery.isFetching ? (
                <div className="flex items-center justify-center py-8 text-[#A8A8A9]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="ml-2 text-sm">Đang tải danh sách nhóm...</span>
                </div>
              ) : publishableGroups.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-[#A8A8A9]">
                  <span className="text-sm">Không có dữ liệu</span>
                </div>
              ) : (
                publishableGroups.map((group) => {
                  const isSelected = selectedGroupIds.has(group.id)

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => handleToggleGroup(group.id)}
                      className="flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#303030]"
                    >
                      {/* Checkbox */}
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                          isSelected
                            ? 'border-[#F7F0A1] bg-[#F7F0A1]'
                            : 'border-[#545454] bg-transparent',
                        )}
                      >
                        {isSelected ? <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} /> : null}
                      </span>
                      {/* Label */}
                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate text-[13px] md:text-sm',
                          isSelected ? 'text-white' : 'text-[#D4D4D4]',
                        )}
                      >
                        {truncateLabel(group.title, 50)}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-3 border-t border-[#282828] px-4 py-4 sm:grid-cols-[minmax(0,154px)_minmax(0,154px)] sm:justify-end sm:px-6">
          <Button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="h-9 w-full min-w-0 max-w-full overflow-hidden rounded-lg bg-[#FDFDFD] px-3 text-[13px] md:text-sm font-semibold text-black hover:bg-zinc-200"
          >
            <span className="truncate">Hủy</span>
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || selectedGroupIds.size === 0}
            className="h-9 w-full min-w-0 max-w-full overflow-hidden rounded-lg bg-[#F7F0A1] px-3 text-[13px] md:text-sm font-semibold text-black hover:bg-[#FFF7B8]"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span className="truncate">Xác nhận</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
