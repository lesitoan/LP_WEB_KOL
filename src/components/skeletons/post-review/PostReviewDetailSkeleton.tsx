import { Skeleton } from '@/components/ui/skeleton'

export function PostReviewDetailSkeleton() {
  return (
    <div className="flex max-h-[calc(100dvh-132px)] flex-col overflow-hidden rounded-2xl bg-[#171717]">
      <div className="flex flex-wrap items-center gap-6 border-b border-[#282828] px-6 py-4">
        <Skeleton className="h-6 w-36 bg-[#282828]" />
        <Skeleton className="h-6 w-36 bg-[#282828]" />
      </div>
      <div className="flex-1 space-y-4 overflow-hidden px-6 py-5">
        <Skeleton className="h-5 w-20 bg-[#282828]" />
        <Skeleton className="h-16 w-full bg-[#282828]" />
        <Skeleton className="h-5 w-32 bg-[#282828]" />
        <Skeleton className="h-24 w-full bg-[#282828]" />
        <Skeleton className="h-5 w-36 bg-[#282828]" />
        <Skeleton className="h-20 w-full bg-[#282828]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-16 w-full bg-[#282828]" />
          <Skeleton className="h-16 w-full bg-[#282828]" />
          <Skeleton className="h-16 w-full bg-[#282828]" />
        </div>
      </div>
      <div className="border-t border-[#282828] px-6 py-4">
        <Skeleton className="h-9 w-full bg-[#282828] md:w-72" />
      </div>
    </div>
  )
}
