import { Skeleton } from "@/components/ui/skeleton";

export function TierComparisonTableSkeleton() {
  return (
    <div className="mb-6 rounded-xl bg-[#171717] p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="relative flex flex-col gap-5 p-5">
            {index < 3 ? (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[#333333]/70 md:hidden" />
            ) : null}
            {index < 2 ? (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[#333333]/70 hidden md:block lg:hidden" />
            ) : null}
            {index % 2 === 0 && index < 3 ? (
              <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-[#333333]/70 md:block lg:hidden" />
            ) : null}
            {index < 3 ? (
              <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-[#333333]/70 lg:block" />
            ) : null}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
