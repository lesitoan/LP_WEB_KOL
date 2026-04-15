import { Skeleton } from "@/components/ui/skeleton";

export function AccountInfoSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-border-strong/70 bg-surface-0/80 px-4 py-3"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-4 w-40" />
        </div>
      ))}
    </div>
  );
}
