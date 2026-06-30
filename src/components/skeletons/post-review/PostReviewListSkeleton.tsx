import { Skeleton } from '@/components/ui/skeleton'

export function PostReviewListSkeleton() {
  return (
    <div className="flex w-full gap-4 overflow-hidden py-1 pl-1 pr-1 xl:flex-col">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="w-full shrink-0 rounded-2xl border border-[#282828] bg-[#171717] p-4 lg:w-[calc((100%_-_1rem)/2)] xl:w-full"
        >
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-28 bg-[#282828]" />
            <Skeleton className="h-5 w-14 bg-[#282828]" />
          </div>
          <Skeleton className="mb-2 h-px w-full bg-[#282828]" />
          <Skeleton className="mb-2 h-5 w-full bg-[#282828]" />
          <Skeleton className="mb-4 h-5 w-4/5 bg-[#282828]" />
          <Skeleton className="h-6 w-24 bg-[#282828]" />
        </div>
      ))}
    </div>
  )
}
