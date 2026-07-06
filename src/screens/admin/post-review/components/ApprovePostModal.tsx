"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { CalendarClock, Check, CircleCheck, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { usePreviewAdminInsightDistributionMutation } from '@/services/api/admin/insightsApi'
import { cn } from '@/lib/utils'
import { formatApiDateTimeForPostReview } from '../utils'
import type {
  AdminInsightDistributionPreview,
  ContentTypeCode,
} from '@/types/api/adminInsight'

type ApproveMode = 'now' | 'scheduled'

export interface ApprovePostPayload {
  publishNow: boolean
  scheduledAt?: string
}

interface ApprovePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postTitle: string
  contentType: ContentTypeCode
  onConfirm: (payload: ApprovePostPayload) => Promise<void> | void
  isLoading?: boolean
}

function getScheduledAtForApi(distributionPreview: AdminInsightDistributionPreview | undefined): string | undefined {
  return distributionPreview?.baseScheduledAt || distributionPreview?.plans[0]?.scheduledAt
}

export default function ApprovePostModal({
  open,
  onOpenChange,
  postTitle,
  contentType,
  onConfirm,
  isLoading = false,
}: ApprovePostModalProps) {
  const [mode, setMode] = useState<ApproveMode>('scheduled')
  const [hasReviewedContent, setHasReviewedContent] = useState(true)
  const [distributionPreview, setDistributionPreview] = useState<AdminInsightDistributionPreview | undefined>()
  const [previewError, setPreviewError] = useState<string | undefined>()
  const [previewAdminInsightDistribution, previewAdminInsightDistributionState] = usePreviewAdminInsightDistributionMutation()
  const scheduledAtForApi = getScheduledAtForApi(distributionPreview)
  const scheduleRows = useMemo(() => distributionPreview?.plans ?? [], [distributionPreview])

  useEffect(() => {
    if (!open) return

    setMode('scheduled')
    setHasReviewedContent(true)
    setDistributionPreview(undefined)
    setPreviewError(undefined)

    previewAdminInsightDistribution({ contentType })
      .unwrap()
      .then(setDistributionPreview)
      .catch(() => setPreviewError('Không thể tải lịch đăng theo tier. Vui lòng thử lại.'))
  }, [contentType, open, previewAdminInsightDistribution])

  const scheduleIsReady = Boolean(scheduledAtForApi) && !previewAdminInsightDistributionState.isLoading && !previewError
  const canConfirm = hasReviewedContent && (mode === 'now' || scheduleIsReady)

  const handleConfirm = async () => {
    if (!canConfirm || isLoading) return

    try {
      await onConfirm(
        mode === 'now'
          ? { publishNow: true }
          : { publishNow: false, scheduledAt: scheduledAtForApi }
      )
    } catch {
      // Parent shows the error toast and keeps the modal open for retry/cancel.
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (isLoading) return
      onOpenChange(nextOpen)
    }}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[577px] gap-0 overflow-hidden rounded-2xl border border-[#282828] bg-[#171717] p-0 text-white shadow-2xl"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <CalendarClock className="h-6 w-6 shrink-0 text-[#F7F0A1]" />
            Duyệt tin
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              disabled={isLoading}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#282828] text-[#FDFDFD] transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Đóng</span>
            </button>
          </DialogClose>
        </div>

        <div className="h-px shrink-0 bg-[#282828]" />

        <div className="scrollbar-thin-brand min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="rounded-lg bg-[#282828]/50 p-4">
            <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Tiêu đề tin</div>
            <div className="mt-1 text-base font-semibold leading-6 text-white">{postTitle}</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setMode('scheduled')}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                mode === 'scheduled'
                  ? "border-[#F7F0A1] bg-[#F7F0A1]/10"
                  : "border-[#282828] bg-[#282828]/40 hover:border-[#545454]"
              )}
            >
              <div className="text-sm font-semibold text-white">Đăng theo lịch</div>
              <div className="mt-1 text-xs font-normal leading-[18px] text-[#A8A8A9]">Dùng lịch đăng mặc định theo từng tier.</div>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setMode('now')}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                mode === 'now'
                  ? "border-[#F7F0A1] bg-[#F7F0A1]/10"
                  : "border-[#282828] bg-[#282828]/40 hover:border-[#545454]"
              )}
            >
              <div className="text-sm font-semibold text-white">Đăng ngay bây giờ</div>
              <div className="mt-1 text-xs font-normal leading-[18px] text-[#A8A8A9]">Duyệt và phân phối ngay sau khi xác nhận.</div>
            </button>
          </div>

          {mode === 'scheduled' ? (
            <div className="rounded-lg border border-[#282828] bg-[#121212] p-4">
              {previewAdminInsightDistributionState.isLoading ? (
                <div className="text-sm text-[#A8A8A9]">Đang tải lịch đăng...</div>
              ) : previewError ? (
                <div className="text-sm text-[#EB4E40]">{previewError}</div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Bắt đầu đăng</div>
                    <div className="mt-1 text-sm font-semibold text-white">{formatApiDateTimeForPostReview(scheduledAtForApi) ?? '—'}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {scheduleRows.length > 0 ? scheduleRows.map((plan) => (
                      <div
                        key={`${plan.kolTierId}-${plan.scheduledAt}`}
                        className="grid gap-2 rounded-lg bg-[#282828]/50 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold leading-5 text-[#DDB96E]">
                            {plan.tierCode} - {plan.tierName}
                          </div>
                        </div>
                        <div className="text-sm font-semibold leading-5 text-white sm:text-right">
                          {formatApiDateTimeForPostReview(plan.scheduledAt) ?? '—'}
                        </div>
                        <div className="text-sm font-normal leading-5 text-[#A8A8A9] sm:text-right">
                          {plan.recipientCount} KOL
                        </div>
                      </div>
                    )) : (
                      <div className="text-sm text-[#A8A8A9]">Chưa có lịch phân phối.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
        </div>

        <label className={cn(
          "flex shrink-0 cursor-pointer items-center gap-2 px-6 py-4 text-sm font-normal leading-[21px] text-[#A8A8A9]",
          isLoading && "cursor-not-allowed opacity-60"
        )}>
          <button
            type="button"
            aria-pressed={hasReviewedContent}
            disabled={isLoading}
            onClick={() => setHasReviewedContent((checked) => !checked)}
            className={cn(
              "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors disabled:cursor-not-allowed",
              hasReviewedContent ? "border-[#F7F0A1] bg-[#F7F0A1] text-[#282828]" : "border-[#545454] bg-transparent text-transparent"
            )}
          >
            <Check className="h-3 w-3" />
          </button>
          Tôi đã đọc và kiểm tra nội dung này
        </label>

        <div className="h-px shrink-0 bg-[#282828]" />

        <div className="flex shrink-0 justify-end gap-4 px-6 py-5 max-sm:flex-col">
          <DialogClose asChild>
            <button
              type="button"
              disabled={isLoading}
              className="h-9 rounded-lg bg-[#FDFDFD] px-4 text-sm font-semibold text-black transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full"
            >
              Huỷ
            </button>
          </DialogClose>
          <button
            type="button"
            disabled={!canConfirm || isLoading}
            onClick={handleConfirm}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F7F0A1] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#e8e09c] disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full"
          >
            <CircleCheck className="h-5 w-5 fill-black text-[#F7F0A1]" />
            {isLoading ? 'Đang duyệt...' : 'Xác nhận duyệt'}
          </button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
