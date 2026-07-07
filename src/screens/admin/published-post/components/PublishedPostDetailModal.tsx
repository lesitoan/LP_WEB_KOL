"use client";

import React from 'react'
import { ChevronLeft, ChevronRight, Flag, X } from 'lucide-react'
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

function InfoBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#282828]/20 bg-[#282828]/50 p-4">
      <span className="text-xs font-normal uppercase text-[#A8A8A9]">{label}</span>
      {children}
    </div>
  )
}

export default function PublishedPostDetailModal({
  post,
  onClose,
  onRequestProcess,
  getCategoryBadgeClass,
  getCategoryDotClass,
}: PublishedPostDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0)
  const imageUrls = post?.imageUrls ?? []
  const activeImageUrl = imageUrls[activeImageIndex]
  const hasMultipleImages = imageUrls.length > 1

  React.useEffect(() => {
    setActiveImageIndex(0)
  }, [post?.id])

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1))
  }

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % imageUrls.length)
  }

  return (
    <Dialog open={post !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[680px] flex-col gap-0 overflow-hidden rounded-2xl border border-[#282828] bg-[#171717] p-0 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <img src="/images/insights/detail-icon.svg" alt="" className="h-6 w-6 shrink-0" />
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

        <div className="mx-6 my-5 h-px shrink-0 bg-[#282828]" />

        {post && (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 text-sm [scrollbar-color:rgba(247,240,161,0.7)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/90">
            <div className="space-y-3 pb-1">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-[#282828]/20 bg-[#282828]/50 p-4">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-xs font-normal uppercase text-[#A8A8A9]">Loại tin</span>
                  <div className={cn('inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-normal', getCategoryBadgeClass(post.categoryColor))}>
                    <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', getCategoryDotClass(post.categoryColor))} />
                    {post.categoryLabel}
                  </div>
                </div>

                <div className="h-10 w-px bg-[#545454]/30" />

                <div className="flex flex-1 flex-col gap-1 pl-4">
                  <span className="text-xs font-normal uppercase text-[#A8A8A9]">Trạng thái</span>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#06301C] px-2.5 py-0.5 text-xs font-normal text-[#41C588]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#41C588]" />
                    {post.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-lg border border-[#282828]/20 bg-[#282828]/50 p-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-xs font-normal uppercase text-[#A8A8A9]">Admin duyệt</span>
                  <span className="truncate text-base font-normal text-white">{post.adminName.toLowerCase().replace(' ', '')}</span>
                </div>
                <div className="h-10 w-px shrink-0 bg-[#545454]/30" />
                <div className="flex min-w-0 flex-1 flex-col gap-1 pl-3">
                  <span className="text-xs font-normal uppercase text-[#A8A8A9]">Giờ đăng</span>
                  <span className="truncate text-base font-normal text-white">{post.publishTime.toLowerCase()}</span>
                </div>
                <div className="h-10 w-px shrink-0 bg-[#545454]/30" />
                <div className="flex min-w-0 flex-1 flex-col gap-1 pl-3">
                  <span className="text-xs font-normal uppercase text-[#A8A8A9]">Tier nhận</span>
                  <span className="truncate text-base font-normal text-white">{post.tier}</span>
                </div>
              </div>

              <InfoBox label="Tiêu đề tin">
                <p className="break-words text-base font-semibold leading-relaxed text-white [overflow-wrap:anywhere]">{post.title}</p>
              </InfoBox>

              {imageUrls.length > 0 && (
                <InfoBox label="Ảnh nội dung">
                  <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg bg-[#121212]">
                    <img
                      src={activeImageUrl}
                      alt={`Ảnh nội dung ${activeImageIndex + 1}`}
                      className="block max-h-[360px] w-full object-contain"
                    />
                    {hasMultipleImages && (
                      <>
                        <button
                          type="button"
                          onClick={showPreviousImage}
                          className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg bg-[#171717]/85 text-white transition-colors hover:bg-[#282828]"
                          aria-label="Ảnh trước"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={showNextImage}
                          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg bg-[#171717]/85 text-white transition-colors hover:bg-[#282828]"
                          aria-label="Ảnh tiếp theo"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <span className="absolute bottom-2 right-2 rounded-md bg-[#171717]/85 px-2 py-1 text-xs text-[#D7D8D9]">
                          {activeImageIndex + 1}/{imageUrls.length}
                        </span>
                      </>
                    )}
                  </div>
                </InfoBox>
              )}

              {post.summary ? (
                <InfoBox label="Tóm tắt">
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white [overflow-wrap:anywhere]">{post.summary}</p>
                </InfoBox>
              ) : null}

              {post.mainContent ? (
                <InfoBox label="Nội dung chính">
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white [overflow-wrap:anywhere]">{post.mainContent}</p>
                </InfoBox>
              ) : null}
            </div>
          </div>
        )}

        <div className="mx-6 my-5 h-px shrink-0 bg-[#282828]" />

        <div className="flex shrink-0 items-center justify-end gap-3 px-6 pb-6">
          <DialogClose asChild>
            <button
              type="button"
              className="h-9 rounded-lg bg-[#FDFDFD] px-5 text-sm font-semibold text-black transition-colors hover:bg-white/80"
            >
              Trở lại
            </button>
          </DialogClose>
          {post && post.actionType !== 'sent' && (
            <button
              type="button"
              onClick={() => onRequestProcess(post)}
              className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F7F0A1] px-5 text-sm font-semibold text-black transition-colors duration-100 hover:bg-[#F7F0A1]/80 active:scale-95"
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
