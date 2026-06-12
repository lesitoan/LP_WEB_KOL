import { Skeleton } from "@/components/ui/skeleton";

export function AttentionActivitiesSkeleton() {
  return (
    <div>
      {[0, 1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="grid grid-cols-[64px_1fr_64px] items-center gap-3 border-b border-border py-3 last:border-b-0 lg:grid-cols-[52px_1fr_58px] lg:gap-2 xl:grid-cols-[64px_1fr_64px] xl:gap-3"
        >
          <Skeleton className="h-4 w-11" />
          <div className="flex items-center gap-3 lg:gap-2 xl:gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-full max-w-[260px]" />
          </div>
          <Skeleton className="h-7 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}
