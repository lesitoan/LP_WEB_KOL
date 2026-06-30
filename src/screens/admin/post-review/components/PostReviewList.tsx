import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  onSelectPost: (post: ReviewPost) => void
}

export default function PostReviewList({
  posts,
  selectedPostId,
  isLoading,
  showEmpty,
  onSelectPost,
}: PostReviewListProps) {
  const listScroll = useHorizontalScrollControls([posts.length])

  return (
    <div className="w-full xl:w-[320px] shrink-0 min-w-0">
      <div className="mb-3 flex items-center justify-end gap-2 xl:hidden">
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

      <div
        ref={listScroll.scrollRef}
        onScroll={listScroll.updateArrows}
        className="flex w-full gap-4 overflow-x-hidden overflow-y-hidden scroll-smooth py-1 pl-1 pr-1 xl:max-h-[calc(100dvh-132px)] xl:flex-col xl:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
