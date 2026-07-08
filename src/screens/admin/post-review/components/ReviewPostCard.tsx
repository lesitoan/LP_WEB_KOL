"use client"

import { Clock, Trash2 } from 'lucide-react'
import { CATEGORIES, STATUS_CONFIGS, isDeletableInsightStatus, type ReviewPost } from '../constants'
import { cn } from '@/lib/utils'

interface ReviewPostCardProps {
  post: ReviewPost
  isSelected: boolean
  onClick: () => void
  onDelete?: () => void
}

export default function ReviewPostCard({ post, isSelected, onClick, onDelete }: ReviewPostCardProps) {
  const catConfig = CATEGORIES[post.contentType]
  const statusConfig = STATUS_CONFIGS[post.status]
  const canDeletePost = Boolean(onDelete && isDeletableInsightStatus(post.status))

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className={cn(
        "group w-full cursor-pointer text-left p-4 rounded-2xl bg-[#171717] relative flex flex-col gap-3 transition-all duration-200 outline outline-1 [&:hover_.delete-post-button]:visible [&:hover_.delete-post-button]:opacity-100 [&:hover_.delete-post-button]:[transition-delay:250ms]",
        isSelected
          ? "outline-[#FFF9B3] shadow-lg shadow-black/40"
          : "outline-[#282828] hover:outline-[#545454]"
      )}
    >
      <div className="absolute left-0 top-3 w-[3px] h-[30px] bg-[#F7F0A1] rounded-r" />

      <div className="flex justify-between items-center w-full">
        <div className={cn("px-2 py-0.5 rounded-full flex items-center gap-1", catConfig.bgClass)}>
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: catConfig.iconColor }}
          />
          <span className={cn("text-[12px] font-normal leading-normal", catConfig.textClass)}>
            {catConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {post.time ? <span className="text-sm font-normal text-[#D7D8D9]">{post.time}</span> : null}
          <div className="w-5 h-5 rounded-full bg-[#D4A74A] flex items-center justify-center p-0.5 shrink-0">
            <Clock className="h-3 w-3 text-black" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-[#282828] w-full" />

      <p className="text-sm font-medium text-white leading-[21px] line-clamp-3">
        {post.title}
      </p>

      <div className="flex flex-wrap gap-1.5 items-center mt-1">
        <div className={cn("px-2 py-0.5 rounded-full flex items-center gap-1", statusConfig.bgClass, statusConfig.textClass)}>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: statusConfig.iconColor }}
          />
          <span className="text-[12px] font-normal">{statusConfig.label}</span>
        </div>

        {/* API list/detail chua tra actionRequests, tam comment badge yeu cau xu ly.
        {post.hasOpenActionRequest && (
          <div className="px-2 py-0.5 rounded-full bg-[#4D2C03] text-[#FAB55A] flex items-center gap-1">
            <span className="text-[12px] font-normal">T2 yêu cầu xử lý</span>
          </div>
        )} */}

        {canDeletePost ? (
          <button
            type="button"
            aria-label="Xóa bài viết"
            onClick={(event) => {
              event.stopPropagation()
              onDelete?.()
            }}
            className="delete-post-button invisible ml-auto grid h-7 w-7 place-items-center rounded-lg border border-[#545454] bg-[#282828] text-[#FDFDFD] opacity-0 transition-[opacity,visibility,background-color,border-color,color] [transition-delay:0ms] duration-150 hover:border-[#EF4444] hover:bg-[#3a1f1f] hover:text-[#FCA5A5] focus-visible:visible focus-visible:opacity-100 focus-visible:[transition-delay:0ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
