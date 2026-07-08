import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DataTablePaginationBar, type DataTablePagination } from '@/components/ui/dataTable'
import ReviewPostCard from './ReviewPostCard'
import { useHorizontalScrollControls } from '../hooks/useHorizontalScrollControls'
import type { ReviewPost } from '../constants'
import { cn } from '@/lib/utils'
import { PostReviewListSkeleton } from '@/components/skeletons/post-review/PostReviewListSkeleton'

interface PostReviewListProps {
  posts: ReviewPost[]
  selectedPostId: string | undefined
  isLoading: boolean
  showEmpty: boolean
  pagination: {
    page: number
    totalPages: number
    totalItems: number
    limit: number
  }
  onPageChange: (page: number) => void
  onSelectPost: (post: ReviewPost) => void
  onDeletePost: (post: ReviewPost) => void
}

export default function PostReviewList({
  posts,
  selectedPostId,
  isLoading,
  showEmpty,
  pagination,
  onPageChange,
  onSelectPost,
  onDeletePost,
}: PostReviewListProps) {
  const listScroll = useHorizontalScrollControls([posts.length])
  const fromItem = pagination.totalItems === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const toItem = Math.min(pagination.page * pagination.limit, pagination.totalItems)
  const paginationConfig: DataTablePagination = {
    ...pagination,
    isDisabled: isLoading,
    onPageChange,
    summaryText: pagination.totalItems > 0
      ? `Hiển thị ${fromItem}-${toItem} / ${pagination.totalItems}`
      : 'Hiển thị 0 / 0',
    hideSummary: true,
  }

  return (
    <div className="w-full shrink-0 min-w-0 xl:flex xl:h-full xl:w-[320px] xl:flex-col">
      <div className="mb-3 flex items-center justify-between xl:hidden">
        <div className="inline-flex overflow-hidden rounded-[10px] border border-[#282828] bg-[#171717]">
          <DataTablePaginationBar pagination={paginationConfig} className="py-0 px-2 h-9 flex items-center justify-center" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!listScroll.arrows.left}
            onClick={listScroll.scrollLeft}
            className={cn(
              "h-9 w-9 inline-flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all",
              !listScroll.arrows.left && "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={!listScroll.arrows.right}
            onClick={listScroll.scrollRight}
            className={cn(
              "h-9 w-9 inline-flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all",
              !listScroll.arrows.right && "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={listScroll.scrollRef}
        onScroll={listScroll.updateArrows}
        className="flex w-full min-h-0 gap-4 overflow-x-hidden overflow-y-hidden scroll-smooth py-1 pl-1 pr-1 xl:flex-1 xl:flex-col xl:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isLoading ? (
          <PostReviewListSkeleton />
        ) : showEmpty ? (
          <div className="w-full shrink-0 text-center py-12 text-[#828283] text-sm bg-[#171717] rounded-2xl p-6 border border-[#282828]">
            Chưa có dữ liệu
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="w-full shrink-0 lg:w-[calc((100%_-_1rem)/2)] xl:w-full">
              <ReviewPostCard
                post={post}
                isSelected={post.id === selectedPostId}
                onClick={() => onSelectPost(post)}
                onDelete={() => onDeletePost(post)}
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-3 hidden shrink-0 overflow-hidden rounded-[10px] border border-[#282828] bg-[#171717] xl:block">
        <DataTablePaginationBar pagination={paginationConfig} className="py-0 px-2 h-9 flex items-center justify-center" />
      </div>
    </div>
  )
}
