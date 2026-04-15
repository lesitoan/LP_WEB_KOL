import { Skeleton } from "@/components/ui/skeleton";

export function VolumeMembersChartSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4">
      <Skeleton className="h-5 w-32 rounded-md" />
      <Skeleton className="flex-1 rounded-[12px]" />
    </div>
  );
}
