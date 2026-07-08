"use client"

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, CircleCheck, CircleX, RotateCcw, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CATEGORIES, STATUS_CONFIGS, isApprovableInsightStatus, isPublishableInsightStatus, isRecallableInsightStatus, isSchedulableInsightStatus, type ReviewPost, type ReviewPostImage } from '../constants'
import { formatApiTimeForPostReview } from '../utils'
import ApprovePostModal, { type ApprovePostPayload } from './ApprovePostModal'
import ImagePreviewModal from './ImagePreviewModal'
import PublishPostModal from './PublishPostModal'
import RevokePostModal from './RevokePostModal'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
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
  onSaveDraft: (updatedPost: ReviewPost) => Promise<ReviewPost | void> | ReviewPost | void
  onApprove: (updatedPost: ReviewPost) => Promise<ReviewPost | void> | ReviewPost | void
  onLoadApprovePreview: (updatedPost: ReviewPost) => Promise<AdminInsightDistributionPreview>
  onScheduleApprove: (updatedPost: ReviewPost, payload: ApprovePostPayload) => Promise<ReviewPost | void> | ReviewPost | void
  onPublish: (updatedPost: ReviewPost) => Promise<ReviewPost | void> | ReviewPost | void
  onDiscard: (postId: string) => void
  onRevoke: (postId: string) => Promise<void> | void
  isSaving?: boolean
  isApproving?: boolean
  isScheduling?: boolean
  isPublishing?: boolean
  isRecalling?: boolean
}

const editableStatuses = new Set(['PENDING_REVIEW', 'DRAFT'])
const MAX_CONTENT_IMAGES = 10

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

interface ImagePreviewState {
  images: string[]
  initialIndex: number
  title: string
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
  onLoadApprovePreview,
  onScheduleApprove,
  onPublish,
  onDiscard,
  onRevoke,
  isSaving = false,
  isApproving = false,
  isScheduling = false,
  isPublishing = false,
  isRecalling = false,
}: PostDetailEditorProps) {
  const [editedPost, setEditedPost] = useState<ReviewPost>({ ...post })
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [pendingApprovePost, setPendingApprovePost] = useState<ReviewPost | null>(null)
  const [pendingApproveDistributionPreview, setPendingApproveDistributionPreview] = useState<AdminInsightDistributionPreview | null>(null)
  const [pendingPublishPost, setPendingPublishPost] = useState<ReviewPost | null>(null)
  const [isPreparingApprovePreview, setIsPreparingApprovePreview] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [activeAddImageSlot, setActiveAddImageSlot] = useState<number | null>(null)
  const [contentImagesOverflow, setContentImagesOverflow] = useState(false)
  const [imagePreview, setImagePreview] = useState<ImagePreviewState | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const contentImageInputRef = useRef<HTMLInputElement>(null)
  const contentImageScrollRef = useRef<HTMLDivElement>(null)
  const replaceImageIndexRef = useRef<number | null>(null)
  const objectUrlsRef = useRef<string[]>([])
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

  const revokeObjectUrls = () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    objectUrlsRef.current = []
  }

  const createLocalImageUrl = (file: File) => {
    const url = URL.createObjectURL(file)
    objectUrlsRef.current.push(url)
    return url
  }

  useEffect(() => {
    revokeObjectUrls()
    setCoverImageUrl(null)
    setEditedPost({ ...post })
    reset(getPostFormValues(post))
  }, [post, reset])

  useEffect(() => () => revokeObjectUrls(), [])

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
  const canApprove = canEdit && (isLocalDraft || isApprovableInsightStatus(editedPost.status))
  const canScheduleApprove = !isLocalDraft && isSchedulableInsightStatus(editedPost.status)
  const canPublish = !isLocalDraft && isPublishableInsightStatus(editedPost.status)
  const canAddContentImage = canEdit && editedPost.contentImages.length < MAX_CONTENT_IMAGES
  const shouldShowCoverImageSection = canEdit || Boolean(coverImageUrl)
  const shouldShowContentImagesSection = canEdit || editedPost.contentImages.length > 0
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

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return
    const file = event.target.files?.[0]
    if (!file) return

    setCoverImageUrl(createLocalImageUrl(file))
    event.target.value = ''
  }

  const handleContentImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return

    const replaceIndex = replaceImageIndexRef.current
    const files = Array.from(event.target.files ?? [])
    const allowedFiles = replaceIndex !== null
      ? files.slice(0, 1)
      : files.slice(0, Math.max(0, MAX_CONTENT_IMAGES - editedPost.contentImages.length))

    if (allowedFiles.length === 0) return

    const nextImages: ReviewPostImage[] = allowedFiles.map((file) => {
      const previewUrl = createLocalImageUrl(file)
      return {
        id: `${file.name}-${file.lastModified}-${previewUrl}`,
        previewUrl,
        file,
      }
    })

    setEditedPost((prev) => {
      if (replaceIndex !== null) {
        return {
          ...prev,
          contentImages: prev.contentImages.map((image, index) => (index === replaceIndex ? nextImages[0] : image)),
        }
      }

      return {
        ...prev,
        contentImages: [...prev.contentImages, ...nextImages],
      }
    })

    replaceImageIndexRef.current = null
    event.target.value = ''
  }

  const playAddImageAnimation = (slotIndex: number) => {
    setActiveAddImageSlot(slotIndex)
    window.setTimeout(() => setActiveAddImageSlot(null), 220)
  }

  const openContentImagePicker = (replaceIndex: number | null = null, slotIndex?: number) => {
    if (!canEdit) return
    if (slotIndex !== undefined) playAddImageAnimation(slotIndex)
    replaceImageIndexRef.current = replaceIndex
    contentImageInputRef.current?.click()
  }

  const scrollContentImages = (direction: 'left' | 'right') => {
    const container = contentImageScrollRef.current
    if (!container) return

    container.scrollBy({
      left: direction === 'left' ? -container.clientWidth : container.clientWidth,
      behavior: 'smooth',
    })
  }

  const updateContentImagesOverflow = () => {
    const container = contentImageScrollRef.current
    if (!container) return

    setContentImagesOverflow(container.scrollWidth > container.clientWidth + 1)
  }

  useEffect(() => {
    updateContentImagesOverflow()
    window.addEventListener('resize', updateContentImagesOverflow)

    return () => {
      window.removeEventListener('resize', updateContentImagesOverflow)
    }
  }, [editedPost.contentImages.length, canAddContentImage])

  const buildUpdatedPost = (values: PostDetailFormValues): ReviewPost => ({
    ...editedPost,
    ...values,
    imageUrls: editedPost.contentImages.map((image) => image.remoteUrl ?? image.previewUrl),
  })

  const applyActionResult = (nextPost: ReviewPost | void) => {
    if (nextPost) {
      setEditedPost(nextPost)
      reset(getPostFormValues(nextPost))
    }
  }

  const handleSaveDraftSubmit = async (values: PostDetailFormValues) => {
    if (!canSubmit || isSaving) return
    const nextPost = await onSaveDraft(buildUpdatedPost(values))
    applyActionResult(nextPost)
  }

  const handlePublishSubmit = handleSubmit((values) => {
    if (!canPublish || isSaving || isPublishing) return
    setPendingPublishPost(buildUpdatedPost(values))
    setPublishDialogOpen(true)
  })

  const handleApproveSubmit = handleSubmit(async (values) => {
    if (!canApprove || isSaving || isApproving) return
    const nextPost = await onApprove(buildUpdatedPost(values))
    applyActionResult(nextPost)
  })

  const handleScheduleApproveSubmit = handleSubmit(async (values) => {
    if (!canScheduleApprove || isSaving || isScheduling || isPreparingApprovePreview) return

    const postToApprove = buildUpdatedPost(values)
    setIsPreparingApprovePreview(true)

    try {
      const approvePreview = await onLoadApprovePreview(postToApprove)

      setPendingApprovePost(postToApprove)
      setPendingApproveDistributionPreview(approvePreview)
      setApproveDialogOpen(true)
    } catch (error) {
      toast({
        title: 'Không thể tải lịch phân phối',
        description: extractApiErrorMessage(error, 'Không thể tải lịch phân phối. Vui lòng thử lại.'),
        variant: 'destructive',
      })
    } finally {
      setIsPreparingApprovePreview(false)
    }
  })

  const confirmPublish = async () => {
    const postToPublish = pendingPublishPost ?? buildUpdatedPost(getValues())
    const nextPost = await onPublish(postToPublish)
    applyActionResult(nextPost)
    setPublishDialogOpen(false)
    setPendingPublishPost(null)
  }

  const confirmScheduleApprove = async (payload: ApprovePostPayload) => {
    const postToApprove = pendingApprovePost ?? buildUpdatedPost(getValues())
    const nextPost = await onScheduleApprove(postToApprove, payload)
    applyActionResult(nextPost)
    setApproveDialogOpen(false)
    setPendingApprovePost(null)
    setPendingApproveDistributionPreview(null)
  }

  const confirmRevoke = async () => {
    await onRevoke(editedPost.id)
    setRevokeDialogOpen(false)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSaveDraftSubmit)}
        className="flex max-h-[calc(100dvh-132px)] flex-col bg-[#171717] border border-[#282828] rounded-2xl w-full overflow-hidden"
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

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 flex flex-col gap-5 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/40 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/80">
          {/* Ảnh bìa - placeholder UI, chưa có API/data */}
          {shouldShowCoverImageSection ? (
          <div className="flex flex-col gap-1 pl-1">
            <span className="text-sm font-medium text-white">Ảnh bìa</span>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!canEdit}
              onChange={handleCoverImageChange}
            />
            <div
              role={canEdit ? 'button' : undefined}
              tabIndex={canEdit ? 0 : undefined}
              onClick={() => {
                if (!coverImageUrl) coverInputRef.current?.click()
              }}
              onKeyDown={(event) => {
                if (!canEdit || coverImageUrl) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  coverInputRef.current?.click()
                }
              }}
              className={cn(
                'relative flex min-h-[96px] flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-dashed border-[#828283] bg-[#282828] px-6 py-4 transition-[border-color,transform,box-shadow] duration-200',
                canEdit ? 'cursor-pointer hover:border-[#D4A74A]/60' : 'cursor-default opacity-60'
              )}
            >
              {coverImageUrl ? (
                <>
                  <img
                    src={coverImageUrl}
                    alt="Ảnh bìa"
                    onClick={(event) => {
                      event.stopPropagation()
                      setImagePreview({
                        images: [coverImageUrl],
                        initialIndex: 0,
                        title: 'Ảnh bìa',
                      })
                    }}
                    className="block h-auto w-full max-w-full cursor-zoom-in"
                  />
                  {canEdit && (
                    <div className="absolute right-2 top-2 flex gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          coverInputRef.current?.click()
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-[#282828]/90 transition-[background-color,transform] duration-150 hover:bg-[#3a3a3a] active:scale-90"
                        aria-label="Thay ảnh bìa"
                      >
                        <img src="/images/admin/add-imgae-icon.png" alt="" className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setCoverImageUrl(null)
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-[#282828]/90 text-white transition-colors hover:bg-[#3a3a3a]"
                        aria-label="Xóa ảnh bìa"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <img
                    src="/images/admin/add-imgae-icon.png"
                    alt=""
                    className="h-10 w-10"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-sm">
                      <span className="font-semibold text-white">Click to upload</span>{' '}
                      <span className="font-normal text-[#D7D8D9]">or drag and drop</span>
                    </p>
                    <p className="text-xs font-normal text-[#D7D8D9]">
                      SVG, PNG, JPG or GIF (max. 800×400px)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          ) : null}

          {/* Ảnh nội dung - map từ imageUrls */}
          {shouldShowContentImagesSection ? (
          <div className="flex flex-col gap-1 pl-1">
            <span className="text-sm font-medium text-white">Ảnh nội dung</span>
            <input
              ref={contentImageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={!canEdit}
              onChange={handleContentImageChange}
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => scrollContentImages('left')}
                className={cn(
                  "absolute left-1 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[#828283]/40 bg-[#171717]/90 text-white shadow-lg transition-[background-color,transform,opacity] duration-150 hover:bg-[#282828] active:scale-90",
                  !contentImagesOverflow && "pointer-events-none opacity-0"
                )}
                aria-label="Cuộn ảnh sang trái"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollContentImages('right')}
                className={cn(
                  "absolute right-1 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[#828283]/40 bg-[#171717]/90 text-white shadow-lg transition-[background-color,transform,opacity] duration-150 hover:bg-[#282828] active:scale-90",
                  !contentImagesOverflow && "pointer-events-none opacity-0"
                )}
                aria-label="Cuộn ảnh sang phải"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div
                ref={contentImageScrollRef}
                className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
              {editedPost.contentImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative flex h-[100px] shrink-0 basis-[calc((100%_-_0.5rem)/2)] snap-start items-center justify-center overflow-hidden rounded-lg border border-[#828283] bg-[#282828] animate-in fade-in-0 zoom-in-95 duration-200 sm:basis-[calc((100%_-_1.5rem)/4)]"
                >
                  <img
                    src={image.previewUrl}
                    alt={`Ảnh nội dung ${index + 1}`}
                    onClick={() => {
                      setImagePreview({
                        images: editedPost.contentImages.map((contentImage) => contentImage.previewUrl),
                        initialIndex: index,
                        title: 'Ảnh nội dung',
                      })
                    }}
                    className="block h-auto max-h-full w-auto max-w-full cursor-zoom-in object-contain"
                  />
                  {canEdit && (
                    <div className="absolute right-1.5 top-1.5 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openContentImagePicker(index)}
                        className="grid h-6 w-6 place-items-center rounded-lg bg-[#282828]/90 transition-[background-color,transform] duration-150 hover:bg-[#3a3a3a] active:scale-90"
                        aria-label={`Thay ảnh ${index + 1}`}
                      >
                        <img src="/images/admin/add-imgae-icon.png" alt="" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditedPost((prev) => ({
                            ...prev,
                            contentImages: prev.contentImages.filter((_, i) => i !== index),
                          }))
                        }}
                        className="grid h-6 w-6 place-items-center rounded-lg bg-[#282828]/90 text-white transition-[background-color,transform] duration-150 hover:bg-[#3a3a3a] active:scale-90"
                        aria-label={`Xóa ảnh ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {canAddContentImage && (
                <div
                  key="add-content-image"
                  role="button"
                  tabIndex={0}
                  onClick={() => openContentImagePicker(null, -1)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openContentImagePicker(null, -1)
                    }
                  }}
                  className={cn(
                    'flex h-[100px] shrink-0 basis-[calc((100%_-_0.5rem)/2)] snap-start items-center justify-center rounded-lg border border-dashed border-[#828283] bg-[#282828] transition-[border-color,transform,box-shadow] duration-200 sm:basis-[calc((100%_-_1.5rem)/4)]',
                    'cursor-pointer hover:border-[#D4A74A]/60 hover:shadow-[0_0_0_1px_rgba(212,167,74,0.2)] active:scale-[0.97]',
                    activeAddImageSlot === -1 && 'scale-[0.97] border-[#D4A74A]/80 shadow-[0_0_0_3px_rgba(212,167,74,0.18)]'
                  )}
                >
                  <img
                    src="/images/admin/add-imgae-icon.png"
                    alt=""
                    className="h-10 w-10"
                  />
                </div>
              )}
              </div>
            </div>
          </div>
          ) : null}

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
                      {plan.tierCode} {formatApiTimeForPostReview(plan.scheduledAt) ?? '--:--'}
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
          </div>

          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:flex lg:w-auto lg:shrink-0 lg:items-center lg:justify-end lg:gap-4">
            {canDiscard ? (
              <button
                type="button"
                onClick={() => onDiscard(editedPost.id)}
                disabled={isSaving}
                className={cn(
                  "inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#AF6606]/70 bg-[#4D2C03]/35 px-6 text-sm font-semibold text-[#FAB55A] transition-colors hover:border-[#FAB55A] hover:bg-[#4D2C03]/60 lg:w-auto",
                  isSaving && "cursor-not-allowed opacity-60 hover:border-[#AF6606]/70 hover:bg-[#4D2C03]/35"
                )}
              >
                <CircleX className="h-5 w-5" />
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

            {canSubmit && (
              <button
                type="submit"
                disabled={isSaving}
                className={cn(
                  "inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#F7F0A1] bg-[#F7F0A1] px-6 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(247,240,161,0.12)] transition-colors hover:border-[#FFF6B8] hover:bg-[#e8e09c] lg:w-auto",
                  isSaving && "cursor-not-allowed opacity-60 hover:border-[#F7F0A1] hover:bg-[#F7F0A1]"
                )}
              >
                {isSaving ? submittingLabel : submitLabel}
              </button>
            )}

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
                {isApproving ? 'Đang gửi...' : 'Gửi Preview'}
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

            {canScheduleApprove && (
              <button
                type="button"
                onClick={handleScheduleApproveSubmit}
                disabled={isSaving || isScheduling || isPreparingApprovePreview}
                className={cn(
                  "h-9 w-full px-6 bg-[#F7F0A1] hover:bg-[#F7F0A1]/90 rounded-lg text-sm font-semibold text-black transition-colors inline-flex items-center justify-center gap-2 lg:w-auto",
                  (isSaving || isScheduling || isPreparingApprovePreview) && "cursor-not-allowed opacity-60 hover:bg-[#F7F0A1]"
                )}
              >
                <CircleCheck className="h-5 w-5 fill-black text-[#F7F0A1]" />
                {isPreparingApprovePreview ? 'Đang tải lịch...' : isScheduling ? 'Đang duyệt...' : 'Duyệt tin'}
              </button>
            )}

          </div>
        </div>
      </form>

      {imagePreview ? (
        <ImagePreviewModal
          images={imagePreview.images}
          initialIndex={imagePreview.initialIndex}
          title={imagePreview.title}
          onClose={() => setImagePreview(null)}
        />
      ) : null}

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

      {pendingApproveDistributionPreview ? (
        <ApprovePostModal
          open={approveDialogOpen}
          onOpenChange={(nextOpen) => {
            setApproveDialogOpen(nextOpen)
            if (!nextOpen) {
              setPendingApprovePost(null)
              setPendingApproveDistributionPreview(null)
            }
          }}
          postTitle={pendingApprovePost?.title ?? editedPost.title}
          distributionPreview={pendingApproveDistributionPreview}
          onConfirm={confirmScheduleApprove}
          isLoading={isScheduling}
        />
      ) : null}

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
