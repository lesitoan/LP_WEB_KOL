import { Skeleton } from "@/components/ui/skeleton";

export function DashboardKpiGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-surface-1 border border-border rounded-[14px] p-5 relative"
        >
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-7 w-28 mb-3" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
