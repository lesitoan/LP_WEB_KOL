import { Skeleton } from '@/components/ui/skeleton'

export function ForwardsByContentSkeleton() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex-1 flex flex-col gap-3 w-full pt-2">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex flex-col gap-2">
            {item > 0 && <Skeleton className="h-px w-full" />}
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
