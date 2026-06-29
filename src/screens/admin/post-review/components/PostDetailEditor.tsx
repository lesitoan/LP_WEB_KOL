"use client"

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { RotateCcw, CircleX, CircleCheck } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CATEGORIES, type ReviewPost } from '../constants'
import PublishPostModal from './PublishPostModal'
import RevokePostModal from './RevokePostModal'
import { cn } from '@/lib/utils'

// Helper component for auto-resizing textareas using standard textarea to support refs
function AutoResizeTextarea({ value, onChange, className, ...props }: React.ComponentProps<'textarea'>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      // Set height to scrollHeight plus a small buffer to avoid scrollbars
      textarea.style.height = `${textarea.scrollHeight + 2}px`
    }
  }

  // Adjust height on initial mount and value changes
  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        if (onChange) onChange(e)
        adjustHeight()
      }}
      className={cn(
        'border-input placeholder:text-[#828283] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-[16px] font-normal shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none overflow-hidden',
        className
      )}
      {...props}
    />
  )
}

interface PostDetailEditorProps {
  post: ReviewPost
  onSaveDraft: (updatedPost: ReviewPost) => void
  onPublish: (updatedPost: ReviewPost) => void
  onDiscard: (postId: string) => void
  onRevoke: (postId: string) => void
}

export default function PostDetailEditor({
  post,
  onSaveDraft,
  onPublish,
  onDiscard,
  onRevoke,
}: PostDetailEditorProps) {
  const [editedPost, setEditedPost] = useState<ReviewPost>({ ...post })
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)

  // Sync state when selected post changes
  useEffect(() => {
    setEditedPost({ ...post })
  }, [post])

  const catConfig = CATEGORIES[editedPost.category]

  const updateField = (key: keyof ReviewPost, value: string) => {
    setEditedPost((prev) => ({ ...prev, [key]: value }))
  }

  const openPublishDialog = () => {
    setPublishDialogOpen(true)
  }

  const confirmPublish = () => {
    setPublishDialogOpen(false)
    onPublish(editedPost)
  }

  const openRevokeDialog = () => {
    setRevokeDialogOpen(true)
  }

  const confirmRevoke = () => {
    setRevokeDialogOpen(false)
    onRevoke(editedPost.id)
  }

  return (
    <>
    <div className="flex max-h-[calc(100dvh-132px)] flex-col bg-[#171717] rounded-2xl w-full overflow-hidden">
      {/* ===== FIXED HEADER ===== */}
      <div className="flex flex-wrap items-center gap-6 px-6 py-4 border-b border-[#282828] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-normal text-[#A8A8A9]">LOẠI TIN:</span>
          <div className={cn("px-2.5 py-0.5 rounded-full flex items-center gap-1", catConfig.bgClass)}>
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: catConfig.iconColor }}
            />
            <span className={cn("text-[12px] font-normal leading-normal", catConfig.textClass)}>
              {catConfig.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-normal text-[#A8A8A9]">TRẠNG THÁI:</span>
          {editedPost.status === 'pending' ? (
            <div className="px-2.5 py-0.5 rounded-full bg-[#4D2C03] text-[#FAB55A] flex items-center gap-1">
              <svg className="animate-pulse" width="10" height="10" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#FAB55A" strokeWidth="2.5"/>
              </svg>
              <span className="text-[12px] font-normal">Chờ duyệt</span>
            </div>
          ) : editedPost.subStatus === 'published' ? (
            <div className="px-2.5 py-0.5 rounded-full bg-[#06301C] text-[#60CF9B] flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <path d="M4 10.5l4.5 4.5 7.5-9" stroke="#60CF9B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[12px] font-normal">Đã đăng</span>
            </div>
          ) : (
            <div className="px-2.5 py-0.5 rounded-full bg-[#002D67] text-[#549BF8] flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#549BF8" strokeWidth="2.5" strokeDasharray="4 2"/>
              </svg>
              <span className="text-[12px] font-normal">Đã lên lịch</span>
            </div>
          )}
        </div>
      </div>

      {/* ===== SCROLLABLE MIDDLE ===== */}
      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-5 space-y-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/40 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/80">
        {/* Tiêu đề */}
        <Field>
          <FieldLabel className="text-sm font-medium text-white">Tiêu đề</FieldLabel>
          <AutoResizeTextarea
            value={editedPost.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
          />
        </Field>

        {/* Nội dung chính */}
        <Field>
          <FieldLabel className="text-sm font-medium text-white">Nội dung chính</FieldLabel>
          <AutoResizeTextarea
            value={editedPost.mainContent}
            onChange={(e) => updateField('mainContent', e.target.value)}
            className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
          />
        </Field>

        {/* So sánh lịch sử */}
        <Field>
          <FieldLabel className="text-sm font-medium text-white">So sánh lịch sử</FieldLabel>
          <AutoResizeTextarea
            value={editedPost.historyComparison}
            onChange={(e) => updateField('historyComparison', e.target.value)}
            className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
          />
        </Field>

        {/* Insight cho KOL */}
        <Field>
          <FieldLabel className="text-sm font-medium text-white">Insight cho KOL</FieldLabel>
          <AutoResizeTextarea
            value={editedPost.kolInsight}
            onChange={(e) => updateField('kolInsight', e.target.value)}
            className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
          />
        </Field>

        {/* Insight cho nhà đầu tư */}
        <Field>
          <FieldLabel className="text-sm font-medium text-white">Insight cho nhà đầu tư</FieldLabel>
          <AutoResizeTextarea
            value={editedPost.investorInsight}
            onChange={(e) => updateField('investorInsight', e.target.value)}
            className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
          />
        </Field>

        {/* Nguồn */}
        <Field>
          <FieldLabel className="text-sm font-medium text-white">Nguồn</FieldLabel>
          <AutoResizeTextarea
            value={editedPost.sources}
            onChange={(e) => updateField('sources', e.target.value)}
            className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
          />
        </Field>

        {/* Row 2 columns for smaller inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nhiệm vụ của tác giả */}
          <Field>
            <FieldLabel className="text-sm font-medium text-white">Nhiệm vụ của tác giả</FieldLabel>
            <Input
              value={editedPost.authorTask}
              onChange={(e) => updateField('authorTask', e.target.value)}
              className="h-11 bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 text-[16px] font-normal"
            />
          </Field>

          {/* Insight cho trader */}
          <Field>
            <FieldLabel className="text-sm font-medium text-white">Insight cho trader</FieldLabel>
            <Input
              value={editedPost.traderInsight}
              onChange={(e) => updateField('traderInsight', e.target.value)}
              placeholder="Nhập nội dung"
              className="h-11 bg-[#121212] border-[#282828] text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0 text-[16px] font-normal"
            />
          </Field>

          {/* KOL Tool Posted */}
          <Field>
            <FieldLabel className="text-sm font-medium text-white">KOL Tool Posted</FieldLabel>
            <Input
              value={editedPost.kolToolPosted}
              onChange={(e) => updateField('kolToolPosted', e.target.value)}
              placeholder="Nhập nội dung"
              className="h-11 bg-[#121212] border-[#282828] text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0 text-[16px] font-normal"
            />
          </Field>
        </div>

        {/* Sẽ phân phối đến */}
        <div className="flex flex-col gap-2">
          <FieldLabel className="text-sm font-medium text-white">Sẽ phân phối đến</FieldLabel>
          <div className="flex flex-wrap gap-2 p-4 bg-[#121212] border border-[#282828] rounded-lg">
            <div className="px-2 py-1 bg-[#282828] rounded text-xs font-medium">
              <span className="text-[#DDB96E]">LEGEND 10:00</span> <span className="text-white">(16 KOL)</span>
            </div>
            <div className="px-2 py-1 bg-[#282828] rounded text-xs font-medium">
              <span className="text-[#DDB96E]">ELITE 10:00</span> <span className="text-white">(16 KOL)</span>
            </div>
            <div className="px-2 py-1 bg-[#282828] rounded text-xs font-medium">
              <span className="text-[#DDB96E]">PARTNER 10:15</span> <span className="text-white">(16 KOL)</span>
            </div>
            <div className="px-2 py-1 bg-[#282828] rounded text-xs font-medium">
              <span className="text-white">STARTER 10:20 (88 KOL)</span>
            </div>
          </div>
        </div>

        {/* Disclaimer rủi ro */}
        <div className="p-3 bg-[#4D2C03] border border-[#AF6606] rounded-lg flex gap-3 items-start">
          <div className="w-6 h-6 bg-[#FAB55A] rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-black font-bold text-sm">!</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#FAB55A]">DISCLAIMER RỦI RO</span>
            <span className="text-sm font-normal text-[#FAB55A]">Thông tin tham khảo, không phải khuyến nghị đầu tư.</span>
          </div>
        </div>
      </div>

      {/* ===== FIXED FOOTER ===== */}
      <div className="shrink-0 border-t border-[#282828] px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Author info (if present) */}
        <div className="flex w-full min-w-0 items-center justify-between gap-3 lg:w-auto">
          {editedPost.author ? (
            <div className="min-w-0 text-sm font-normal text-[#A8A8A9] max-md:line-clamp-2">
            Tin đã lên lịch bởi <span className="text-white font-semibold">{editedPost.author}</span> - Đang phân phối đến KOL.
            </div>
          ) : (
            <div className="min-w-0 text-sm font-normal text-[#828283] max-md:line-clamp-2">Bản nháp tự động lưu.</div>
          )}
          {editedPost.status === 'pending' && (
            <button
              type="button"
              onClick={() => onSaveDraft(editedPost)}
              className="h-9 shrink-0 rounded-lg border border-[#545454] px-5 text-sm font-semibold text-white transition-colors hover:border-white md:hidden"
            >
              Lưu nháp
            </button>
          )}
        </div>

        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:flex lg:w-auto lg:shrink-0 lg:items-center lg:justify-end lg:gap-4">
          {/* Lưu nháp */}
          {editedPost.status === 'pending' && (
            <button
              type="button"
              onClick={() => onSaveDraft(editedPost)}
              className="hidden h-9 w-full rounded-lg border border-[#545454] px-6 text-sm font-semibold text-white transition-colors hover:border-white md:inline-flex md:items-center md:justify-center lg:w-auto"
            >
              Lưu nháp
            </button>
          )}

          {/* Bỏ qua or Thu hồi */}
          {editedPost.status === 'pending' ? (
            <button
              type="button"
              onClick={() => onDiscard(editedPost.id)}
              className="h-9 w-full px-6 bg-[#FDFDFD] hover:bg-white/80 rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto"
            >
              <CircleX className="h-5 w-5 fill-black text-white" />
              Bỏ qua
            </button>
          ) : (
            <button
              type="button"
              onClick={openRevokeDialog}
              className="h-9 w-full px-6 bg-[#FDFDFD] hover:bg-white/80 rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto"
            >
              <RotateCcw className="h-4 w-4" />
              Thu hồi tin
            </button>
          )}

          {/* Đăng tin */}
          {editedPost.status === 'pending' && (
            <button
              type="button"
              onClick={openPublishDialog}
              className="h-9 w-full px-6 bg-[#F7F0A1] hover:bg-[#e8e09c] rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto"
            >
              <CircleCheck className="h-5 w-5 fill-black text-white" />
              Đăng tin
            </button>
          )}
        </div>
      </div>
    </div>
    <PublishPostModal
      open={publishDialogOpen}
      onOpenChange={setPublishDialogOpen}
      postTitle={editedPost.title}
      onConfirm={confirmPublish}
    />
    <RevokePostModal
      open={revokeDialogOpen}
      onOpenChange={setRevokeDialogOpen}
      postTitle={editedPost.title}
      onConfirm={confirmRevoke}
    />
    </>
  )
}
