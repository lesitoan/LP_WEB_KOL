'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Flame, Loader2, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
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

function linkifyText(text: string) {
  const parts = text.split(/(https?:\/\/\S+)/g)

  return parts.map((part, index) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#3388F7] underline"
        >
          {part}
        </a>
      )
    }

    return <span key={index}>{part}</span>
  })
}

function ContentBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-1 rounded-lg bg-[#282828]/50 p-4">
      <h3 className="text-xs font-normal leading-[18px] text-[#A8A8A9]">{label}</h3>
      <div className="min-w-0 whitespace-pre-line break-words text-base font-normal leading-6 text-white">
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

function InsightImageGallery({
  imageUrls,
  title,
  className,
}: {
  imageUrls: string[]
  title: string
  className?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultipleImages = imageUrls.length > 1
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: hasMultipleImages,
  })

  const handleSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    setActiveIndex(0)
    emblaApi?.scrollTo(0)
    emblaApi?.reInit()
  }, [emblaApi, imageUrls])

  useEffect(() => {
    if (!emblaApi) return

    handleSelect()
    emblaApi.on('select', handleSelect)
    emblaApi.on('reInit', handleSelect)

    return () => {
      emblaApi.off('select', handleSelect)
      emblaApi.off('reInit', handleSelect)
    }
  }, [emblaApi, handleSelect])

  if (!imageUrls.length) return null

  const goToPreviousImage = () => {
    emblaApi?.scrollPrev()
  }

  const goToNextImage = () => {
    emblaApi?.scrollNext()
  }

  const goToImage = (index: number) => {
    emblaApi?.scrollTo(index)
  }

  return (
    <section
      className={cn(
        'mx-auto flex w-full min-w-0 max-w-[630px] flex-col gap-4 overflow-hidden md:mx-0 md:h-full md:min-h-0 md:max-w-none',
        hasMultipleImages && 'md:grid md:grid-rows-[minmax(0,1fr)_auto]',
        className,
      )}
    >
      <div
        ref={emblaRef}
        className="h-[min(458px,42dvh)] w-full min-h-0 min-w-0 overflow-hidden rounded-2xl bg-[#0D0D0D] sm:h-[458px] md:h-auto md:min-h-0 md:flex-1 md:basis-0"
      >
        <div className="flex h-full w-full">
          {imageUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center"
            >
              <img
                src={url}
                alt={`${title} - ảnh ${index + 1}`}
                className="block max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {hasMultipleImages ? (
        <div className="flex shrink-0 items-center justify-center gap-3">
          <button
            type="button"
            onClick={goToPreviousImage}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-[#545454] text-white transition-colors hover:bg-[#282828]"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>

          <div className="flex flex-col items-center justify-center text-xs font-normal leading-4 text-white">
            <span>
              {activeIndex + 1}/{imageUrls.length}
            </span>
            <div className="mt-0.5 flex items-center gap-0.5">
              {imageUrls.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => goToImage(index)}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    activeIndex === index ? 'bg-[#F7F0A1]' : 'bg-[#828283] hover:bg-[#A8A8A9]'
                  }`}
                  aria-label={`Xem ảnh ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goToNextImage}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-[#545454] text-white transition-colors hover:bg-[#282828]"
            aria-label="Ảnh tiếp theo"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </div>
      ) : null}
    </section>
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
  const imageUrls = detail?.imageUrls ?? []
  const shouldShowGallery = !isEditMode && imageUrls.length > 0

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

  const renderDetailContent = () => {
    if (!detail) return null

    return (
      <>
        <h2 className="break-words text-base font-bold leading-6 text-white">{detail.title}</h2>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="shrink-0 text-sm font-normal leading-[21px] text-[#A8A8A9]">PHÂN LOẠI</span>
          <span className="inline-flex h-6 min-w-0 items-center gap-1 rounded-full bg-[#5C120C] py-0.5 pl-1.5 pr-2 text-xs font-normal leading-[18px] text-[#F5827A]">
            <Flame className="h-3 w-3 shrink-0 fill-[#F5827A]/20 text-[#F5827A]" strokeWidth={1.8} />
            <span className="truncate">{detail.contentTypeLabel}</span>
          </span>
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
                    className="resize-y rounded-lg border-[#545454] bg-[#222222] text-sm leading-6 text-white placeholder:text-[#707070] focus-visible:ring-[#F7F0A1]/30"
                  />
                </label>
              )
            })}
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="text-sm font-normal leading-[21px] text-[#A8A8A9]">NỘI DUNG INSIGHT</h3>
            <div className="flex min-w-0 flex-col gap-2">
              <ContentBlock label="Nội dung chính">{detail.body}</ContentBlock>
              <ContentBlock label="So sánh lịch sử">{detail.historicalComparison}</ContentBlock>
              <ContentBlock label="Insight cho KOL">{detail.insightForKol}</ContentBlock>
              <ContentBlock label="Insight cho nhà đầu tư">{detail.insightForInvestor}</ContentBlock>
              <ContentBlock label="Nguồn">{linkifyText(detail.sourcesText)}</ContentBlock>
              {/* API KOL insight chưa trả authorTask nên tạm comment UI này.
              <ContentBlock label="Nhiệm vụ của tác giả">-</ContentBlock>
              */}
              <ContentBlock label="Insight cho trader">{detail.insightForTrader}</ContentBlock>
              {/* API KOL insight chưa trả kolToolPosted nên tạm comment UI này.
              <ContentBlock label="KOL Tool Posted">-</ContentBlock>
              */}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          '!flex max-h-[calc(100dvh-48px)] w-[calc(100vw-32px)] max-w-[calc(100vw-32px)] flex-col gap-6 overflow-hidden rounded-2xl border border-[#282828] bg-[#171717] p-6 shadow-2xl',
          shouldShowGallery ? 'sm:max-w-[1323px]' : 'sm:max-w-[846px]',
        )}
      >
        <DialogHeader className="flex shrink-0 flex-row items-center justify-between gap-4 p-0 text-left">
          <DialogTitle className="flex min-w-0 flex-1 items-center gap-2 text-lg font-medium leading-[30px] text-white">
            <img src="/images/insights/detail-icon.svg" alt="" className="h-6 w-6 shrink-0" />
            <span className="shrink-0">{isEditMode ? 'Chỉnh sửa insight' : 'Chi tiết insight'}</span>
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[#A8A8A9] sm:block" />
            <span className="hidden truncate text-base font-normal leading-6 text-[#A8A8A9] sm:block">
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

        <div className="h-px shrink-0 bg-[#282828]" />

        <div
          className={cn(
            'scrollbar-thin-brand min-h-0 flex-1 overflow-y-auto',
            shouldShowGallery && 'md:flex md:flex-col md:overflow-hidden',
          )}
        >
          {isLoading ? (
            <div className="grid min-h-[320px] place-items-center text-sm font-medium text-[#A8A8A9]">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải dữ liệu
              </span>
            </div>
          ) : detail ? (
            <div
              className={cn(
                'min-w-0',
                shouldShowGallery &&
                  'grid grid-cols-1 gap-6 md:h-[min(518px,calc(100dvh-282px))] md:min-h-0 md:flex-1 md:grid-cols-2 md:items-stretch md:overflow-hidden',
              )}
            >
              {shouldShowGallery ? (
                <InsightImageGallery
                  imageUrls={imageUrls}
                  title={detail.title}
                  className="min-w-0 overflow-hidden"
                />
              ) : null}

              <div
                className={cn(
                  'min-w-0 w-full',
                  shouldShowGallery &&
                    'scrollbar-thin-brand md:h-full md:min-h-0 md:overflow-y-auto md:pr-1',
                )}
              >
                <div className="flex min-w-0 flex-col gap-2.5">{renderDetailContent()}</div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[320px] place-items-center text-sm font-medium text-[#A8A8A9]">
              Không có dữ liệu
            </div>
          )}
        </div>

        <div className="h-px shrink-0 bg-[#282828]" />

        <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 w-full rounded-lg bg-[#FDFDFD] px-4 text-sm font-semibold text-black hover:bg-zinc-200 sm:w-[154px]"
          >
            Trở lại
          </Button>
          {isEditMode ? (
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading || !detail}
              className="h-9 w-full rounded-lg bg-[#F7F0A1] px-4 text-sm font-semibold text-black hover:bg-[#FFF7B8] sm:w-[154px]"
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
