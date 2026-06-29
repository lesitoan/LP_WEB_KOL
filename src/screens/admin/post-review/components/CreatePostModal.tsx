"use client"

import React, { useState, useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { PostCategory } from '../constants'

const MANUAL_NEWS_TYPES = [
  { id: 'pulse-morning', label: 'Pulse sáng', schedule: '6h30', category: 'morning' as const },
  { id: 'pulse-noon', label: 'Pulse trưa', schedule: '12h', category: 'summary' as const },
  { id: 'pulse-evening', label: 'Pulse tối', schedule: '19:00', category: 'summary' as const },
  { id: 'market-alert', label: 'Cảnh báo thị trường', schedule: 'Realtime', category: 'khẩn' as const },
  { id: 'event-alert', label: 'Cảnh báo trước sự kiện', schedule: 'Trước 60 - 120′', category: 'khẩn' as const },
  { id: 'weekly-calendar', label: 'Lịch tuần', schedule: 'Thứ 2, 08:00', category: 'morning' as const },
  { id: 'whale-analysis', label: 'Phân tích whales', schedule: 'Hàng ngày - 10:00', category: 'insight' as const },
  { id: 'market-structure', label: 'Cấu trúc thị trường', schedule: '08:00', category: 'insight' as const },
  { id: 'sector-narrative', label: 'Sector & Narrative', schedule: '12:00', category: 'insight' as const },
  { id: 'research-report', label: 'Research Report', schedule: 'Khi phát sinh', category: 'insight' as const },
  { id: 'vietnam-legal', label: 'Pháp lý Việt Nam', schedule: 'Khi có văn bản', category: 'khẩn' as const },
]

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (category: PostCategory, time: string, title: string) => void
}

export default function CreatePostModal({ open, onOpenChange, onCreate }: CreatePostModalProps) {
  const [selectedManualTypeId, setSelectedManualTypeId] = useState('pulse-evening')

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedManualTypeId('pulse-evening')
    }
  }, [open])

  const handleCreate = () => {
    const selectedType =
      MANUAL_NEWS_TYPES.find((type) => type.id === selectedManualTypeId) ?? MANUAL_NEWS_TYPES[0]
    const title = `${selectedType.label.toUpperCase()} — ${new Date().toLocaleDateString('vi-VN')}`
    onCreate(selectedType.category, selectedType.schedule, title)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[505px] gap-0 rounded-2xl border border-[#282828] bg-[#171717] p-0 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <img
              src="/images/admin/posts/create-post-icon.svg"
              width={24}
              height={24}
              className="h-6 w-6 shrink-0"
              alt="Create icon"
            />
            Soạn tin thủ công
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

        <div className="px-6 py-5 text-sm font-normal leading-[21px] text-[#A8A8A9]">
          Chọn <span className="font-medium text-white">loại tin</span> — giờ đăng và tier nhận sẽ tự áp theo cấu hình
          phân phối. Bạn chỉ cần viết nội dung.
        </div>

        <div className="px-6 pb-5">
          <div className="flex max-h-[204px] flex-wrap gap-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(247,240,161,0.45)_transparent] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/45 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/75">
            {MANUAL_NEWS_TYPES.map((type) => {
              const isSelected = type.id === selectedManualTypeId

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedManualTypeId(type.id)}
                  className={cn(
                    "min-h-[52px] rounded-lg px-2 py-1.5 text-left transition-colors",
                    isSelected
                      ? "min-w-[108px] flex-1 border border-[#D4A74A] bg-[#FEFEF6] text-black"
                      : "bg-[#282828] text-white hover:bg-[#333333]"
                  )}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span>
                      <span className={cn("block text-sm leading-[21px]", isSelected ? "font-medium text-black" : "font-normal text-white")}>
                        {type.label}
                      </span>
                      <span className={cn("block text-sm font-normal leading-[21px]", isSelected ? "text-black" : "text-[#A8A8A9]")}>
                        {type.schedule}
                      </span>
                    </span>
                    {isSelected ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 fill-[#D4A74A] text-[#FEFEF6]" /> : null}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="h-px bg-[#282828]" />

        <div className="flex w-full justify-end gap-4 px-6 py-5 max-sm:flex-col">
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
            onClick={handleCreate}
            className="h-9 rounded-lg bg-[#F7F0A1] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#e8e09c] max-sm:w-full"
          >
            Tạo tin
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
