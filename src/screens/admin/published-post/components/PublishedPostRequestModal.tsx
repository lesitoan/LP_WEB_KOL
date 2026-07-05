"use client";

import React, { useState, useEffect } from 'react'
import { Flag, X, Send } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { type PublishedPost } from '../constants'

interface PublishedPostRequestModalProps {
  post: PublishedPost | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (postId: string, reason: string) => Promise<boolean>
  isSubmitting?: boolean
}

export default function PublishedPostRequestModal({
  post,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: PublishedPostRequestModalProps) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (isOpen) {
      setReason('')
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!post || !reason.trim()) return
    const isSuccess = await onSubmit(post.id, reason)
    if (isSuccess) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[505px] gap-0 rounded-2xl border border-[#282828] bg-[#171717] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <div className="w-6 h-6 flex items-center justify-center">
              <Flag className="h-5 w-5 text-[#FDD207] fill-[#FDD207]" />
            </div>
            Gửi yêu cầu xử lý tin
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

        {/* Divider */}
        <div className="my-5 h-px bg-[#282828]" />

        {/* Content */}
        {post && (
          <div className="space-y-5 text-sm">
            <p className="text-sm font-normal text-[#A8A8A9] leading-relaxed">
              Yêu cầu gửi tới admin duyệt bài (T1) — admin sẽ <span className="font-semibold text-white">sửa lại hoặc thu hồi</span> tuỳ mức độ. Tin được đánh dấu để xử lý ưu tiên.
            </p>

            {/* Inner Title Box */}
            <div className="p-4 bg-[#282828]/50 border border-[#282828]/30 rounded-lg flex flex-col gap-1">
              <span className="text-xs text-[#A8A8A9] font-normal uppercase">Tiêu đề tin</span>
              <p className="text-sm font-semibold leading-relaxed text-white">
                {post.title}
              </p>
            </div>

            {/* Reason Textarea */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reason" className="text-xs text-[#A8A8A9] font-normal uppercase">
                Lý do <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do yêu cầu xử lý tin (Vd: Tin chưa kiểm chứng, có nguy cơ gây hiểu nhầm,...)"
                className="w-full h-[100px] p-3 rounded-lg border border-[#282828] bg-[#121212] text-sm text-white placeholder-[#545454] focus:outline-none focus:border-[#545454] transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-5 h-px bg-[#282828]" />

        {/* Footer */}
        <div className="flex justify-end items-center gap-3">
          <DialogClose asChild>
            <button
              type="button"
              className="h-9 px-5 rounded-lg bg-[#282828] text-sm font-semibold text-white hover:bg-[#333333] transition-colors"
            >
              Huỷ
            </button>
          </DialogClose>
          <button
            type="button"
            disabled={!reason.trim() || isSubmitting}
            onClick={handleSend}
            className="h-9 px-5 rounded-lg bg-[#F7F0A1] text-sm font-semibold text-black hover:bg-[#F7F0A1]/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 active:scale-95 duration-100"
          >
            <Send className="h-4 w-4 fill-black text-black" />
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
