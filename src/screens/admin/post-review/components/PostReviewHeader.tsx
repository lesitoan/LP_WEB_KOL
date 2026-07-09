import { Plus, Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import PostReviewTabs from './PostReviewTabs'
import { CATEGORIES, CONTENT_TYPE_FILTER_OPTIONS, type PostReviewTab } from '../constants'
import type { ContentTypeCode } from '@/types/api/adminInsight'

interface PostReviewHeaderProps {
  activeTab: PostReviewTab
  contentType?: ContentTypeCode
  searchValue: string
  statusCounts: Record<PostReviewTab, number>
  onTabChange: (tab: PostReviewTab) => void
  onContentTypeChange: (contentType: ContentTypeCode | undefined) => void
  onSearchChange: (value: string) => void
  onCreateClick: () => void
}

const ALL_CONTENT_TYPES_VALUE = '__all_content_types__'
const contentTypeOptions = CONTENT_TYPE_FILTER_OPTIONS.map((contentType) => CATEGORIES[contentType])

export default function PostReviewHeader({
  activeTab,
  contentType,
  searchValue,
  statusCounts,
  onTabChange,
  onContentTypeChange,
  onSearchChange,
  onCreateClick,
}: PostReviewHeaderProps) {
  const selectedContentTypeLabel = contentType ? CATEGORIES[contentType]?.label ?? contentType : 'Tất cả tin'

  return (
    <div className="flex flex-col items-stretch gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-col">
          <h1 className="text-2xl font-medium text-white leading-[31.2px]">Duyệt bài</h1>
          <p className="text-sm font-normal text-[#828283] leading-[21px] mt-1">
            Nội dung từ Research API · duyệt, chỉnh sửa rồi xuất bản tới các tier
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className="h-9 w-full px-4 bg-[#F7F0A1] hover:bg-[#e8e09c] rounded-lg text-sm font-semibold text-black transition-colors flex items-center justify-center gap-2 shrink-0 md:w-auto"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Soạn tin mới
        </button>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PostReviewTabs
          activeTab={activeTab}
          statusCounts={statusCounts}
          onTabChange={onTabChange}
        />

        <div className="relative z-10 flex w-full min-w-0 flex-col gap-3 md:flex-row xl:w-auto xl:shrink-0">
          <Select
            value={contentType ?? ALL_CONTENT_TYPES_VALUE}
            onValueChange={(value) => {
              onContentTypeChange(value === ALL_CONTENT_TYPES_VALUE ? undefined : value as ContentTypeCode)
            }}
          >
            <SelectTrigger className="h-10 w-full min-w-0 max-w-full overflow-hidden rounded-lg border-[#282828] bg-[#171717] px-3 text-sm font-normal text-white shadow-none hover:bg-[#1f1f1f] focus:ring-0 md:w-[280px]">
              <span className="min-w-0 truncate text-left">
                <span className="text-[#A8A8A9]">Loại tin: </span>
                {selectedContentTypeLabel}
              </span>
            </SelectTrigger>
            <SelectContent
              className="z-[10002] max-h-[280px] w-[var(--radix-select-trigger-width)] max-w-[min(320px,calc(100vw-2rem))] overflow-y-auto border-[#282828] bg-[#171717] text-white shadow-xl [scrollbar-width:thin] [scrollbar-color:rgba(247,240,161,0.45)_transparent] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/45 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/75"
            >
              <SelectItem value={ALL_CONTENT_TYPES_VALUE} className="max-w-full truncate focus:bg-[#282828] focus:text-white">
                Tất cả tin
              </SelectItem>
              {contentTypeOptions.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  className="max-w-full truncate focus:bg-[#282828] focus:text-white"
                >
                  <span className="block min-w-0 truncate">{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="relative block w-full min-w-0 md:w-[360px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#828283]" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm kiếm"
              className="h-10 w-full rounded-lg border border-[#282828] bg-[#171717] py-2 pl-10 pr-3 text-sm font-normal text-white outline-none transition-colors placeholder:text-[#828283] hover:bg-[#1f1f1f] focus:border-[#545454]"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
