"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ContentTypeCode } from '@/types/api/adminInsight'

const MANUAL_NEWS_TYPES = [
  { id: 'pulse-morning', label: 'Pulse sáng', schedule: '6h30', contentType: 'BAN_TIN_0630' as const, time: { hour: 6, minute: 30 } },
  { id: 'pulse-noon', label: 'Pulse trưa', schedule: '12h', contentType: 'BAN_TIN_1300' as const, time: { hour: 12, minute: 0 } },
  { id: 'pulse-evening', label: 'Pulse tối', schedule: '19:00', contentType: 'BAN_TIN_1900' as const, time: { hour: 19, minute: 0 } },
  { id: 'market-alert', label: 'Cảnh báo thị trường', schedule: 'Realtime', contentType: 'ALERT' as const },
  { id: 'event-alert', label: 'Cảnh báo trước sự kiện', schedule: 'Trước 60 - 120′', contentType: 'PRE_EVENT' as const },
  { id: 'weekly-calendar', label: 'Lịch tuần', schedule: 'Thứ 2, 08:00', contentType: 'WEEKLY_CALENDAR' as const, time: { hour: 8, minute: 0 } },
  { id: 'whale-analysis', label: 'Phân tích whales', schedule: 'Hàng ngày - 10:00', contentType: 'WHALES_DAILY' as const, time: { hour: 10, minute: 0 } },
  { id: 'whale-alert', label: 'Cảnh báo whales', schedule: 'Realtime', contentType: 'WHALES_ALERT' as const },
  { id: 'market-structure', label: 'Cấu trúc thị trường', schedule: '08:00', contentType: 'MARKET_STRUCTURE' as const, time: { hour: 8, minute: 0 } },
  { id: 'sector-narrative', label: 'Sector & Narrative', schedule: '12:00', contentType: 'SECTOR_DAILY' as const, time: { hour: 12, minute: 0 } },
  { id: 'market-sentiment', label: 'Tâm lý thị trường', schedule: '15:00', contentType: 'SENTIMENT' as const, time: { hour: 15, minute: 0 } },
  { id: 'research-report', label: 'Research Report', schedule: 'Khi phát sinh', contentType: 'DEEP_DIVE' as const },
  { id: 'vietnam-legal', label: 'Pháp lý Việt Nam', schedule: 'Khi có văn bản', contentType: 'LEGAL_VN' as const },
]

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (payload: {
    contentType: ContentTypeCode
    title: string
    scheduledAt: string
  }) => void
  isCreating?: boolean
}

function buildDefaultTitle(label: string) {
  return `${label.toUpperCase()} — ${new Date().toLocaleDateString('vi-VN')}`
}

function buildScheduledAt(type: (typeof MANUAL_NEWS_TYPES)[number]) {
  const date = new Date()

  if (type.time) {
    date.setHours(type.time.hour, type.time.minute, 0, 0)
  }

  return date.toISOString()
}

export default function CreatePostModal({ open, onOpenChange, onCreate, isCreating = false }: CreatePostModalProps) {
  const [selectedManualTypeId, setSelectedManualTypeId] = useState('pulse-evening')

  const selectedType = useMemo(
    () => MANUAL_NEWS_TYPES.find((type) => type.id === selectedManualTypeId) ?? MANUAL_NEWS_TYPES[0],
    [selectedManualTypeId]
  )

  useEffect(() => {
    if (open) {
      setSelectedManualTypeId('pulse-evening')
    }
  }, [open])

  const handleCreate = () => {
    if (isCreating) return

    onCreate({
      contentType: selectedType.contentType,
      title: buildDefaultTitle(selectedType.label),
      scheduledAt: buildScheduledAt(selectedType),
    })
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
          Chọn <span className="font-medium text-white">loại tin</span>. Hệ thống sẽ tạo form nhập để bạn nhập nội dung.
        </div>

        <div className="px-6 pb-5">
          <div className="flex max-h-[204px] flex-wrap gap-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(247,240,161,0.45)_transparent] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/45 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/75">
            {MANUAL_NEWS_TYPES.map((type) => {
              const isSelected = type.id === selectedManualTypeId

              return (
                <button
                  key={type.id}
                  type="button"
                  disabled={isCreating}
                  onClick={() => setSelectedManualTypeId(type.id)}
                  className={cn(
                    "min-h-[52px] rounded-lg px-2 py-1.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
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
              disabled={isCreating}
              className="h-9 rounded-lg bg-[#FDFDFD] px-4 text-sm font-semibold text-black transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
            >
              Hủy
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isCreating}
            className="h-9 rounded-lg bg-[#F7F0A1] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#e8e09c] disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
          >
            {isCreating ? 'Đang tạo...' : 'Tạo tin'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
