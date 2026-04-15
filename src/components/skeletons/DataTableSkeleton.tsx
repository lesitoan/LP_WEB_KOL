import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export function DataTableSkeleton({
  columnsCount,
  loadingContent,
}: {
  columnsCount: number;
  loadingContent?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {loadingContent ? (
        <div className="text-xs text-muted-foreground mb-1 text-left">
          {loadingContent}
        </div>
      ) : null}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <Skeleton
              key={`${colIndex}-${rowIndex}`}
              className="h-4 flex-1 rounded-md bg-surface-2/80"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
