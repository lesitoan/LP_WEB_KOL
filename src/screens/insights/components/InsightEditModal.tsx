'use client'

import { useEffect, useState } from 'react'
import { Flame, Loader2, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import type { KolInsightCustomizationBody } from '@/types/api/kolInsight'
import type { InsightDetailView, InsightModalMode } from '@/types/insights'
import { normalizeSourcesText } from '../utils'

type InsightEditModalProps = {
  detail: InsightDetailView | null
  mode: InsightModalMode
  open: boolean
  isLoading?: boolean
  isSaving?: boolean
  onOpenChange: (open: boolean) => void
  onSave: (insightId: string, values: KolInsightCustomizationBody) => Promise<boolean>
}

type FieldConfig = {
  key: keyof Pick<
    KolInsightCustomizationBody,
    | 'customizedTitle'
    | 'customizedSubtext'
    | 'customizedSummary'
    | 'customizedBody'
    | 'customizedInsightForKol'
    | 'customizedSources'
  >
  label: string
  maxLength?: number
  minRows?: number
}

const editableFields: FieldConfig[] = [
  { key: 'customizedTitle', label: 'Tiêu đề', maxLength: 255, minRows: 2 },
  { key: 'customizedSubtext', label: 'Subtext', maxLength: 255, minRows: 2 },
  { key: 'customizedSummary', label: 'Tóm tắt', minRows: 3 },
  { key: 'customizedBody', label: 'Nội dung chính', minRows: 6 },
  { key: 'customizedInsightForKol', label: 'Insight cho KOL', minRows: 4 },
  { key: 'customizedSources', label: 'Nguồn', minRows: 2 },
]

function ContentBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg bg-[#282828]/50 p-4">
      <h3 className="text-xs font-normal leading-[18px] text-[#A8A8A9]">{label}</h3>
      <div className="mt-1 whitespace-pre-line break-words text-[13px] md:text-sm font-normal leading-6 text-white">
        {children}
      </div>
    </section>
  )
}

function FieldCounter({ value, maxLength }: { value: string; maxLength?: number }) {
  if (!maxLength) return null

  return (
    <span className="text-xs text-[#A8A8A9]">
      {value.length}/{maxLength}
    </span>
  )
}

export default function InsightEditModal({
  detail,
  mode,
  open,
  isLoading = false,
  isSaving = false,
  onOpenChange,
  onSave,
}: InsightEditModalProps) {
  const [draft, setDraft] = useState<KolInsightCustomizationBody>({})
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (detail && open) {
      setDraft(detail.customizationBody)
    }
  }, [detail, open])

  const handleFieldChange = (key: FieldConfig['key'], value: string, maxLength?: number) => {
    setDraft((current) => ({
      ...current,
      [key]: maxLength ? value.slice(0, maxLength) : value,
    }))
  }

  const handleSave = async () => {
    if (!detail) return
    const saved = await onSave(detail.id, draft)
    if (saved) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-24px)] w-[calc(100vw-16px)] max-w-[846px] gap-0 overflow-hidden rounded-2xl border-[#282828] bg-[#171717] p-0 shadow-2xl sm:w-[calc(100vw-48px)]"
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-[#282828] px-4 py-4 text-left sm:px-6">
          <DialogTitle className="flex min-w-0 items-center gap-2 text-base md:text-lg font-medium leading-[30px] text-white">
            <img src="/images/insights/detail-icon.svg" alt="" className="h-6 w-6 shrink-0" />
            <span className="shrink-0">{isEditMode ? 'Chỉnh sửa insight' : 'Chi tiết insight'}</span>
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[#A8A8A9] sm:block" />
            <span className="hidden truncate text-sm md:text-base font-normal text-[#A8A8A9] sm:block">
              Ngày tạo: {detail?.createdAtLabel ?? '-'}
            </span>
          </DialogTitle>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#282828] text-white transition-colors hover:bg-[#343434]"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </DialogHeader>

        <div className="scrollbar-thin-brand max-h-[calc(100dvh-156px)] overflow-y-auto px-4 py-5 sm:px-6">
          {isLoading ? (
            <div className="grid min-h-[420px] place-items-center text-sm font-medium text-[#A8A8A9]">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải dữ liệu
              </span>
            </div>
          ) : detail ? (
            <div className="space-y-5">
              <h2 className="break-words text-sm md:text-base font-bold leading-6 text-white">
                {detail.title}
              </h2>

              <div className="grid gap-x-12 gap-y-3 md:grid-cols-[max-content_1fr] lg:grid-cols-[196px_1fr]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs md:text-sm font-normal uppercase leading-[21px] text-[#A8A8A9]">PHÂN LOẠI</span>
                  <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#5C120C] px-2 text-xs font-normal text-[#F5827A]">
                    <Flame className="h-3 w-3 fill-[#F5827A]/20 text-[#F5827A]" strokeWidth={1.8} />
                    {detail.contentTypeLabel}
                  </span>
                </div>
              </div>

              {isEditMode ? (
                <div className="space-y-3">
                  {editableFields.map((field) => {
                    const rawValue = draft[field.key]
                    let value = ''
                    if (field.key === 'customizedSources') {
                      if (typeof rawValue === 'string') {
                        value = rawValue
                      } else if (rawValue) {
                        const normalized = normalizeSourcesText(rawValue)
                        value = normalized === '-' ? '' : normalized
                      }
                    } else {
                      value = String(rawValue ?? '')
                    }

                    return (
                      <label key={field.key} className="block space-y-1.5">
                        <span className="flex items-center justify-between gap-3 text-xs font-normal leading-[18px] text-[#A8A8A9]">
                          {field.label}
                          <FieldCounter value={value} maxLength={field.maxLength} />
                        </span>
                        <Textarea
                          value={value}
                          rows={field.minRows}
                          maxLength={field.maxLength}
                          onChange={(event) => handleFieldChange(field.key, event.target.value, field.maxLength)}
                          className="resize-y rounded-lg border-[#545454] bg-[#222222] text-[13px] md:text-sm leading-6 text-white placeholder:text-[#707070] focus-visible:ring-[#F7F0A1]/30"
                        />
                      </label>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xs md:text-sm font-normal uppercase leading-[21px] text-[#A8A8A9]">NỘI DUNG INSIGHT</h3>
                  <ContentBlock label="Nội dung chính">{detail.body}</ContentBlock>
                  <ContentBlock label="So sánh lịch sử">{detail.historicalComparison}</ContentBlock>
                  <ContentBlock label="Insight cho KOL">{detail.insightForKol}</ContentBlock>
                  <ContentBlock label="Insight cho nhà đầu tư">{detail.insightForInvestor}</ContentBlock>
                  <ContentBlock label="Nguồn">{detail.sourcesText}</ContentBlock>
                  {/* API KOL insight chưa trả authorTask nên tạm comment UI này.
                  <ContentBlock label="Nhiệm vụ của tác giả">-</ContentBlock>
                  */}
                  <ContentBlock label="Insight cho trader">{detail.insightForTrader}</ContentBlock>
                  {/* API KOL insight chưa trả kolToolPosted nên tạm comment UI này.
                  <ContentBlock label="KOL Tool Posted">-</ContentBlock>
                  */}
                </div>
              )}
            </div>
          ) : (
            <div className="grid min-h-[320px] place-items-center text-sm font-medium text-[#A8A8A9]">
              Không có dữ liệu
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#282828] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 w-full rounded-lg bg-[#FDFDFD] px-5 text-[13px] md:text-sm font-semibold text-black hover:bg-zinc-200 sm:w-[154px]"
          >
            Trở lại
          </Button>
          {isEditMode ? (
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading || !detail}
              className="h-9 w-full rounded-lg bg-[#F7F0A1] px-5 text-[13px] md:text-sm font-semibold text-black hover:bg-[#FFF7B8] sm:w-[154px]"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Lưu
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
