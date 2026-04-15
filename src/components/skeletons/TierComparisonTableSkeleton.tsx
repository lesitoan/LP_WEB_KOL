import { Skeleton } from "@/components/ui/skeleton";

export function TierComparisonTableSkeleton() {
  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-6 mb-6">
      <Skeleton className="h-4 w-40 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex-1 grid grid-cols-3 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
