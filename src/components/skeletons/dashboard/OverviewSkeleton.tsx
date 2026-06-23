import { Skeleton } from "@/components/ui/skeleton";

export function OverviewSkeleton() {
  return (
    <section className="mb-4 rounded-card bg-surface-2 p-5 md:p-6">
      <Skeleton className="mb-5 h-5 w-40" />
      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <Skeleton className="min-h-[228px] rounded-md" />
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[145px] rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}