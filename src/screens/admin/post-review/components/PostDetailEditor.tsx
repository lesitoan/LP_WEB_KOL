"use client"

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { CircleCheck, CircleX, RotateCcw } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CATEGORIES, STATUS_CONFIGS, isApprovableInsightStatus, isPublishableInsightStatus, isRecallableInsightStatus, type ReviewPost } from '../constants'
import PublishPostModal from './PublishPostModal'
import RevokePostModal from './RevokePostModal'
import { cn } from '@/lib/utils'
import type { AdminInsightDistributionPreview } from '@/types/api/adminInsight'

function AutoResizeTextarea({ value, onChange, className, ...props }: React.ComponentProps<'textarea'>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight + 2}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange?.(e)
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
  distributionPreview?: AdminInsightDistributionPreview
  onSaveDraft: (updatedPost: ReviewPost) => void
  onApprove: (updatedPost: ReviewPost) => Promise<void> | void
  onPublish: (updatedPost: ReviewPost) => Promise<void> | void
  onDiscard: (postId: string) => void
  onRevoke: (postId: string) => Promise<void> | void
  isSaving?: boolean
  isApproving?: boolean
  isPublishing?: boolean
  isRecalling?: boolean
}

const editableStatuses = new Set(['PENDING_REVIEW', 'DRAFT', 'FLAGGED'])

type PostDetailFormValues = Pick<
  ReviewPost,
  | 'title'
  | 'mainContent'
  | 'historyComparison'
  | 'kolInsight'
  | 'investorInsight'
  | 'sources'
  | 'authorTask'
  | 'traderInsight'
  | 'kolToolPosted'
>

interface DistributionDisplayPlan {
  key: string
  tierCode: string
  scheduledAt: string
  recipientCount: number
}

function getPostFormValues(post: ReviewPost): PostDetailFormValues {
  return {
    title: post.title,
    mainContent: post.mainContent,
    historyComparison: post.historyComparison,
    kolInsight: post.kolInsight,
    investorInsight: post.investorInsight,
    sources: post.sources,
    authorTask: post.authorTask,
    traderInsight: post.traderInsight,
    kolToolPosted: post.kolToolPosted,
  }
}

export default function PostDetailEditor({
  post,
  distributionPreview,
  onSaveDraft,
  onApprove,
  onPublish,
  onDiscard,
  onRevoke,
  isSaving = false,
  isApproving = false,
  isPublishing = false,
  isRecalling = false,
}: PostDetailEditorProps) {
  const [editedPost, setEditedPost] = useState<ReviewPost>({ ...post })
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [pendingPublishPost, setPendingPublishPost] = useState<ReviewPost | null>(null)
  const form = useForm<PostDetailFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: getPostFormValues(post),
  })
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
    setValue,
  } = form

  useEffect(() => {
    setEditedPost({ ...post })
    reset(getPostFormValues(post))
  }, [post, reset])

  const catConfig = CATEGORIES[editedPost.contentType]
  const statusConfig = STATUS_CONFIGS[editedPost.status]
  const canEdit = editableStatuses.has(editedPost.status)
  const isLocalDraft = editedPost.isLocalDraft === true
  const canRecall = !isLocalDraft && isRecallableInsightStatus(editedPost.status)
  const canSaveDraft = canEdit && isLocalDraft
  const canUpdate = canEdit && !isLocalDraft
  const canSubmit = canSaveDraft || canUpdate
  const isFormDisabled = !canEdit || isSaving
  const submitLabel = canUpdate ? 'Cập nhật' : 'Lưu nháp'
  const submittingLabel = canUpdate ? 'Đang cập nhật...' : 'Đang lưu...'
  const canDiscard = canEdit && isLocalDraft
  const canApprove = !isLocalDraft && isApprovableInsightStatus(editedPost.status)
  const canPublish = !isLocalDraft && isPublishableInsightStatus(editedPost.status)
  const persistedPlans = editedPost.distributionPlans ?? []
  const displayDistributionPreview =
    distributionPreview &&
    (isLocalDraft
      ? distributionPreview.contentTypeCode === editedPost.contentType
      : distributionPreview.contentItemId === editedPost.id)
      ? distributionPreview
      : undefined
  const displayPlans: DistributionDisplayPlan[] = persistedPlans.length > 0
    ? persistedPlans.map((plan) => ({
      key: plan.id,
      tierCode: plan.kolTier.code,
      scheduledAt: plan.scheduledAt,
      recipientCount: plan.recipientCount,
    }))
    : displayDistributionPreview
      ? displayDistributionPreview.plans.map((plan) => ({
        key: `${plan.kolTierId}-${plan.scheduledAt}`,
        tierCode: plan.tierCode,
        scheduledAt: plan.scheduledAt,
        recipientCount: plan.recipientCount,
      }))
      : []

  const updateField = (key: keyof ReviewPost, value: string) => {
    setEditedPost((prev) => ({ ...prev, [key]: value }))
    if (key in getValues()) {
      setValue(key as keyof PostDetailFormValues, value, { shouldDirty: true })
    }
  }

  const buildUpdatedPost = (values: PostDetailFormValues): ReviewPost => ({
    ...editedPost,
    ...values,
  })

  const handleSaveDraftSubmit = (values: PostDetailFormValues) => {
    if (!canSubmit || isSaving) return
    onSaveDraft(buildUpdatedPost(values))
  }

  const handlePublishSubmit = handleSubmit((values) => {
    if (!canPublish || isSaving || isPublishing) return
    setPendingPublishPost(buildUpdatedPost(values))
    setPublishDialogOpen(true)
  })

  const handleApproveSubmit = handleSubmit(async (values) => {
    if (!canApprove || isSaving || isApproving) return
    await onApprove(buildUpdatedPost(values))
  })

  const confirmPublish = async () => {
    const postToPublish = pendingPublishPost ?? buildUpdatedPost(getValues())
    await onPublish(postToPublish)
    setPublishDialogOpen(false)
    setPendingPublishPost(null)
  }

  const confirmRevoke = async () => {
    await onRevoke(editedPost.id)
    setRevokeDialogOpen(false)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSaveDraftSubmit)}
        className="flex max-h-[calc(100dvh-132px)] flex-col bg-[#171717] rounded-2xl w-full overflow-hidden"
      >
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
            <div className={cn("px-2.5 py-0.5 rounded-full flex items-center gap-1", statusConfig.bgClass, statusConfig.textClass)}>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: statusConfig.iconColor }}
              />
              <span className="text-[12px] font-normal">{statusConfig.label}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-5 space-y-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/40 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/80">
          <Field>
            <FieldLabel className="text-sm font-medium text-white">
              Tiêu đề <span className="text-[#EB4E40]">*</span>
            </FieldLabel>
            <Controller
              control={control}
              name="title"
              rules={{
                validate: (value) => value.trim().length > 0 || 'Vui lòng nhập tiêu đề.',
              }}
              render={({ field }) => (
                <AutoResizeTextarea
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    field.onChange(e)
                    updateField('title', e.target.value)
                  }}
                  disabled={isFormDisabled}
                  aria-invalid={Boolean(errors.title)}
                  className={cn(
                    "bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]",
                    errors.title && "border-[#EB4E40] focus-visible:border-[#EB4E40]"
                  )}
                />
              )}
            />
            <FieldError className="text-xs text-[#EB4E40]" errors={[errors.title]} />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-white">
              Nội dung chính <span className="text-[#EB4E40]">*</span>
            </FieldLabel>
            <Controller
              control={control}
              name="mainContent"
              rules={{
                validate: (value) => value.trim().length > 0 || 'Vui lòng nhập nội dung chính.',
              }}
              render={({ field }) => (
                <AutoResizeTextarea
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    field.onChange(e)
                    updateField('mainContent', e.target.value)
                  }}
                  disabled={isFormDisabled}
                  aria-invalid={Boolean(errors.mainContent)}
                  className={cn(
                    "bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]",
                    errors.mainContent && "border-[#EB4E40] focus-visible:border-[#EB4E40]"
                  )}
                />
              )}
            />
            <FieldError className="text-xs text-[#EB4E40]" errors={[errors.mainContent]} />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-white">So sánh lịch sử</FieldLabel>
            <AutoResizeTextarea
              value={editedPost.historyComparison}
              onChange={(e) => updateField('historyComparison', e.target.value)}
              disabled={isFormDisabled}
              className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
            />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-white">Insight cho KOL</FieldLabel>
            <AutoResizeTextarea
              value={editedPost.kolInsight}
              onChange={(e) => updateField('kolInsight', e.target.value)}
              disabled={isFormDisabled}
              className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
            />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-white">Insight cho nhà đầu tư</FieldLabel>
            <AutoResizeTextarea
              value={editedPost.investorInsight}
              onChange={(e) => updateField('investorInsight', e.target.value)}
              disabled={isFormDisabled}
              className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
            />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-white">Nguồn</FieldLabel>
            <AutoResizeTextarea
              value={editedPost.sources}
              onChange={(e) => updateField('sources', e.target.value)}
              disabled={isFormDisabled}
              className="bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 leading-[24px]"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4">
            <Field>
              <FieldLabel className="text-sm font-medium text-white">Nhiệm vụ của tác giả</FieldLabel>
              <Input
                value={editedPost.authorTask}
                onChange={(e) => updateField('authorTask', e.target.value)}
                disabled={isFormDisabled}
                className="h-11 bg-[#121212] border-[#282828] text-white focus-visible:border-[#545454] focus-visible:ring-0 text-[16px] font-normal"
              />
            </Field>

            <Field>
              <FieldLabel className="text-sm font-medium text-white">Insight cho trader</FieldLabel>
              <Input
                value={editedPost.traderInsight}
                onChange={(e) => updateField('traderInsight', e.target.value)}
                placeholder="Nhập nội dung"
                disabled={isFormDisabled}
                className="h-11 bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0 text-[16px] font-normal"
              />
            </Field>

            <Field>
              <FieldLabel className="text-sm font-medium text-white">KOL Tool Posted</FieldLabel>
              <Input
                value={editedPost.kolToolPosted}
                onChange={(e) => updateField('kolToolPosted', e.target.value)}
                placeholder="Nhập nội dung"
                disabled={isFormDisabled}
                className="h-11 bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0 text-[16px] font-normal"
              />
            </Field>
          </div>

          {displayPlans.length > 0 ? (
            <div className="flex flex-col gap-2">
              <FieldLabel className="text-sm font-medium text-white">Sẽ phân phối đến</FieldLabel>
              <div className="flex flex-wrap gap-2 p-4 bg-[#121212] border border-[#282828] rounded-lg">
                {displayPlans.map((plan) => (
                  <div key={plan.key} className="px-2 py-1 bg-[#282828] rounded text-xs font-medium">
                    <span className="text-[#DDB96E]">
                      {plan.tierCode} {new Date(plan.scheduledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>{' '}
                    <span className="text-white">({plan.recipientCount} KOL)</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

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

        <div className="shrink-0 border-t border-[#282828] px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex w-full min-w-0 items-center justify-between gap-3 lg:w-auto">
            {/* API hien chi tra userId, chua tra ten admin, tam comment dong hien thi ten admin.
            {editedPost.publishedByUserId ? (
              <div className="min-w-0 text-sm font-normal text-[#A8A8A9] max-md:line-clamp-2">
                Tin đã lên lịch bởi <span className="text-white font-semibold">{editedPost.publishedByUserId}</span> - Đang phân phối đến KOL.
              </div>
            ) : null} */}
            {canEdit ? (
              <div className="min-w-0 text-sm font-normal text-[#828283] max-md:line-clamp-2">
                {isLocalDraft ? 'Bản nháp tự động lưu.' : 'Chỉ cập nhật các trường đã chỉnh sửa.'}
              </div>
            ) : null}
            {canSubmit && (
              <button
                type="submit"
                disabled={isSaving}
                className={cn(
                  "h-9 shrink-0 rounded-lg border border-[#545454] px-5 text-sm font-semibold text-white transition-colors hover:border-white md:hidden",
                  isSaving && "cursor-not-allowed opacity-60 hover:border-[#545454]"
                )}
              >
                {isSaving ? submittingLabel : submitLabel}
              </button>
            )}
          </div>

          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:flex lg:w-auto lg:shrink-0 lg:items-center lg:justify-end lg:gap-4">
            {canSubmit && (
              <button
                type="submit"
                disabled={isSaving}
                className={cn(
                  "hidden h-9 w-full rounded-lg border border-[#545454] px-6 text-sm font-semibold text-white transition-colors hover:border-white md:inline-flex md:items-center md:justify-center lg:w-auto",
                  isSaving && "cursor-not-allowed opacity-60 hover:border-[#545454]"
                )}
              >
                {isSaving ? submittingLabel : submitLabel}
              </button>
            )}

            {canDiscard ? (
              <button
                type="button"
                onClick={() => onDiscard(editedPost.id)}
                disabled={isSaving}
                className={cn(
                  "h-9 w-full px-6 bg-[#FDFDFD] hover:bg-white/80 rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto",
                  isSaving && "cursor-not-allowed opacity-60 hover:bg-[#FDFDFD]"
                )}
              >
                <CircleX className="h-5 w-5 fill-black text-white" />
                Bỏ qua
              </button>
            ) : canRecall ? (
              <button
                type="button"
                onClick={() => setRevokeDialogOpen(true)}
                disabled={isSaving || isApproving || isPublishing || isRecalling}
                className={cn(
                  "h-9 w-full px-6 bg-[#FDFDFD] hover:bg-white/80 rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto",
                  (isSaving || isApproving || isPublishing || isRecalling) && "cursor-not-allowed opacity-60 hover:bg-[#FDFDFD]"
                )}
              >
                <RotateCcw className="h-4 w-4" />
                Thu hồi tin
              </button>
            ) : null}

            {canApprove && (
              <button
                type="button"
                onClick={handleApproveSubmit}
                disabled={isSaving || isApproving}
                className={cn(
                  "h-9 w-full px-6 bg-[#F7F0A1] hover:bg-[#F7F0A1]/90 rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto",
                  (isSaving || isApproving) && "cursor-not-allowed opacity-60 hover:bg-[#F7F0A1]"
                )}
              >
                <CircleCheck className="h-5 w-5 fill-black text-[#F7F0A1]" />
                {isApproving ? 'Đang duyệt...' : 'Chấp nhận'}
              </button>
            )}

            {canPublish && (
              <button
                type="button"
                onClick={handlePublishSubmit}
                disabled={isSaving || isPublishing}
                className={cn(
                  "h-9 w-full px-6 bg-[#F7F0A1] hover:bg-[#F7F0A1]/90 rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto",
                  (isSaving || isPublishing) && "cursor-not-allowed opacity-60 hover:bg-[#F7F0A1]"
                )}
              >
                <CircleCheck className="h-5 w-5 fill-black text-[#F7F0A1]" />
                Chấp nhận
              </button>
            )}

          </div>
        </div>
      </form>

      <PublishPostModal
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        postTitle={pendingPublishPost?.title ?? editedPost.title}
        distributionPlans={displayPlans.map((plan) => ({
          tierCode: plan.tierCode,
          scheduledAt: plan.scheduledAt,
          recipientCount: plan.recipientCount,
        }))}
        onConfirm={confirmPublish}
        isLoading={isPublishing}
      />

      <RevokePostModal
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        postTitle={editedPost.title}
        onConfirm={confirmRevoke}
        isLoading={isRecalling}
      />
    </>
  )
}
