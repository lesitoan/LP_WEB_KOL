"use client";

import React from 'react'
import { X, Flag } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { type PublishedPost } from '../constants'

interface PublishedPostDetailModalProps {
  post: PublishedPost | null
  onClose: () => void
  onRequestProcess: (post: PublishedPost) => void
  getCategoryBadgeClass: (colorType: string) => string
  getCategoryDotClass: (colorType: string) => string
}

export default function PublishedPostDetailModal({
  post,
  onClose,
  onRequestProcess,
  getCategoryBadgeClass,
  getCategoryDotClass,
}: PublishedPostDetailModalProps) {
  return (
    <Dialog open={post !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[505px] gap-0 rounded-2xl border border-[#282828] bg-[#171717] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center relative bg-gradient-to-br from-[#FEB91D] to-[#FDD207]">
              <div className="w-2.5 h-2.5 rounded-full bg-black/10 absolute" />
            </div>
            Chi tiết tin
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
          <div className="space-y-3 text-sm">
            {/* Box 1: Loại tin & Trạng thái */}
            <div className="p-4 bg-[#282828]/50 border border-[#282828]/20 rounded-lg flex items-center justify-between gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-xs text-[#A8A8A9] font-normal uppercase">Loại tin</span>
                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal w-fit", getCategoryBadgeClass(post.categoryColor))}>
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", getCategoryDotClass(post.categoryColor))} />
                  {post.categoryLabel}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-10 bg-[#545454]/30" />

              <div className="flex-1 flex flex-col gap-1 pl-4">
                <span className="text-xs text-[#A8A8A9] font-normal uppercase">Trạng thái</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal bg-[#06301C] text-[#41C588] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#41C588]" />
                  {post.status}
                </span>
              </div>
            </div>

            {/* Box 2: Admin duyệt & Giờ đăng & Tier nhận */}
            <div className="p-4 bg-[#282828]/50 border border-[#282828]/20 rounded-lg flex items-center justify-between gap-2">
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <span className="text-xs text-[#A8A8A9] font-normal uppercase">Admin duyệt</span>
                <span className="text-base font-normal text-white truncate">{post.adminName.toLowerCase().replace(' ', '')}</span>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-10 bg-[#545454]/30 shrink-0" />

              <div className="flex-1 flex flex-col gap-1 pl-3 min-w-0">
                <span className="text-xs text-[#A8A8A9] font-normal uppercase">Giờ đăng</span>
                <span className="text-base font-normal text-white truncate">{post.publishTime.toLowerCase()}</span>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-10 bg-[#545454]/30 shrink-0" />

              <div className="flex-1 flex flex-col gap-1 pl-3 min-w-0">
                <span className="text-xs text-[#A8A8A9] font-normal uppercase">Tier nhận</span>
                <span className="text-base font-normal text-white truncate">{post.tier}</span>
              </div>
            </div>

            {/* Box 3: Tiêu đề tin */}
            <div className="p-4 bg-[#282828]/50 border border-[#282828]/20 rounded-lg flex flex-col gap-1">
              <span className="text-xs text-[#A8A8A9] font-normal uppercase">Tiêu đề tin</span>
              <p className="text-base font-semibold leading-relaxed text-white">
                {post.title}
              </p>
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
              className="h-9 px-5 rounded-lg bg-[#FDFDFD] text-sm font-semibold text-black hover:bg-white/80 transition-colors"
            >
              Trở lại
            </button>
          </DialogClose>
          {post && post.actionType !== 'sent' && (
            <button
              type="button"
              onClick={() => onRequestProcess(post)}
              className="h-9 px-5 rounded-lg bg-[#F7F0A1] text-sm font-semibold text-black hover:bg-[#F7F0A1]/80 transition-colors flex items-center justify-center gap-2 active:scale-95 duration-100"
            >
              <Flag className="h-4 w-4 fill-black text-black" />
              Yêu cầu xử lý
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
