import PostReviewTabs from './PostReviewTabs'
import type { PostReviewTab } from '../constants'

interface PostReviewHeaderProps {
  activeTab: PostReviewTab
  statusCounts: Record<PostReviewTab, number>
  onTabChange: (tab: PostReviewTab) => void
  onCreateClick: () => void
}

export default function PostReviewHeader({
  activeTab,
  statusCounts,
  onTabChange,
  onCreateClick,
}: PostReviewHeaderProps) {
  return (
    <div className="flex flex-col items-stretch gap-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium text-white leading-[31.2px]">Duyệt bài</h1>
        <p className="text-sm font-normal text-[#828283] leading-[21px] mt-1">
          Nội dung từ Research API · duyệt, chỉnh sửa rồi xuất bản tới các tier
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PostReviewTabs
          activeTab={activeTab}
          statusCounts={statusCounts}
          onTabChange={onTabChange}
        />

        <button
          type="button"
          onClick={onCreateClick}
          className="h-9 w-full px-4 bg-[#F7F0A1] hover:bg-[#e8e09c] rounded-lg text-sm font-semibold text-black transition-colors flex items-center justify-center gap-2 shrink-0 md:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M3 10h14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Soạn tin mới
        </button>
      </div>
    </div>
  )
}
