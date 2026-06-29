"use client"

import React, { useState, useEffect } from 'react'
import { Check, CircleCheck, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PublishPostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postTitle: string
  onConfirm: () => void
}

export default function PublishPostModal({
  open,
  onOpenChange,
  postTitle,
  onConfirm,
}: PublishPostModalProps) {
  const [hasReviewedContent, setHasReviewedContent] = useState(true)

  // Reset checkbox to true when the modal opens
  useEffect(() => {
    if (open) {
      setHasReviewedContent(true)
    }
  }, [open])

  const handleConfirm = () => {
    if (!hasReviewedContent) return
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[577px] gap-0 rounded-2xl border border-[#282828] bg-[#171717] p-0 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <img
              src="/images/admin/posts/publish-post-icon.svg"
              width={24}
              height={24}
              className="h-6 w-6 shrink-0"
              alt="Publish icon"
            />
            Đăng và phân phối tin này?
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#282828] text-[#FDFDFD] transition-colors hover:bg-[#333333]"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Đóng</span>
            </button>
          </DialogClose>
        </div>

        <div className="h-px bg-[#282828]" />

        <div className="flex flex-col gap-2 px-6 py-5">
          <div className="rounded-lg bg-[#282828]/50 p-4">
            <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Tiêu đề tin</div>
            <div className="mt-1 text-base font-semibold leading-6 text-white">{postTitle}</div>
          </div>

          <div className="grid rounded-lg bg-[#282828]/50 p-4 max-sm:gap-4 sm:grid-cols-3 sm:items-center">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Phạm vi</div>
              <div className="text-base font-normal leading-6 text-white">47 KOL · 2 tier</div>
            </div>
            <div className="flex flex-col gap-1 border-[#282828] sm:border-l sm:px-5">
              <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Theo tier</div>
              <div className="text-base font-medium leading-6 text-[#DDB96E]">LEGEND ngay · ELITE +10′</div>
            </div>
            <div className="flex flex-col gap-1 border-[#282828] sm:border-l sm:pl-5">
              <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Bắt đầu</div>
              <div className="text-base font-normal leading-6 text-white">Ngay khi đăng</div>
            </div>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 px-6 pb-5 text-sm font-normal leading-[21px] text-[#A8A8A9]">
          <button
            type="button"
            aria-pressed={hasReviewedContent}
            onClick={() => setHasReviewedContent((checked) => !checked)}
            className={cn(
              "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
              hasReviewedContent ? "border-[#F7F0A1] bg-[#F7F0A1] text-[#282828]" : "border-[#545454] bg-transparent text-transparent"
            )}
          >
            <Check className="h-3 w-3" />
          </button>
          Tôi đã đọc và kiểm tra nội dung này
        </label>

        <div className="h-px bg-[#282828]" />

        <div className="flex justify-end gap-4 px-6 py-5 max-sm:flex-col">
          <DialogClose asChild>
            <button
              type="button"
              className="h-9 rounded-lg bg-[#FDFDFD] px-4 text-sm font-semibold text-black transition-colors hover:bg-white/80 max-sm:w-full"
            >
              Huỷ
            </button>
          </DialogClose>
          <button
            type="button"
            disabled={!hasReviewedContent}
            onClick={handleConfirm}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F7F0A1] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#e8e09c] disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full"
          >
            <CircleCheck className="h-5 w-5 fill-black text-[#F7F0A1]" />
            Xác nhận đăng
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
