"use client"

import React, { useState, useEffect } from 'react'
import { RotateCcw, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface RevokePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postTitle: string
  onConfirm: () => void
}

export default function RevokePostModal({
  open,
  onOpenChange,
  postTitle,
  onConfirm,
}: RevokePostModalProps) {
  const [reason, setReason] = useState('')

  // Reset reason when modal opens
  useEffect(() => {
    if (open) {
      setReason('')
    }
  }, [open])

  const handleConfirm = () => {
    if (!reason.trim()) return
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[577px] gap-0 rounded-2xl border border-[#282828] bg-[#171717] p-0 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <img
              src="/images/admin/posts/undo-post-icon.svg"
              width={24}
              height={24}
              className="h-6 w-6 shrink-0"
              alt="Revoke icon"
            />
            Thu hồi tin?
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

        {/* Content */}
        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Post Title Info */}
          <div className="rounded-lg bg-[#282828]/50 p-4">
            <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Tiêu đề tin</div>
            <div className="mt-1 text-base font-semibold leading-6 text-white">{postTitle}</div>
          </div>

          {/* Reason Field */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-white">Lý do thu hồi</span>
              <span className="text-sm font-medium text-[#EB4E40]">*</span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do thu hồi (Vd: Phát hiện sai sót / rủi ro truyền thông...)"
              className="min-h-[96px] w-full rounded-lg border border-[#282828] bg-[#121212] px-3 py-4 text-base font-normal text-white placeholder:text-[#828283] focus:border-[#545454] focus:outline-none resize-none leading-6"
            />
          </div>
        </div>

        <div className="h-px bg-[#282828]" />

        {/* Footer */}
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
            disabled={!reason.trim()}
            onClick={handleConfirm}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F7F0A1] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#e8e09c] disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full"
          >
            <RotateCcw className="h-5 w-5 text-black" />
            Xác nhận thu hồi
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
