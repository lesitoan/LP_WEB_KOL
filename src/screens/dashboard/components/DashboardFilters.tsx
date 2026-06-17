"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { cn } from "@/lib/utils";
import { dashboardSegments, defaultDateRange, type DashboardSegment } from "../constants";

function isDashboardSegment(value: string | null): value is DashboardSegment {
  return value === "all" || value === "spot" || value === "future";
}

export default function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSegment = isDashboardSegment(searchParams.get("segment"))
    ? searchParams.get("segment")
    : "all";
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;
  const isInvalidRange = Boolean(from && to && to < from);

  const updateParams = (updates: Partial<Record<"segment" | "from" | "to", string>>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (key === "segment" && value === "all")) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="inline-flex w-fit items-center gap-2 rounded-full">
        {dashboardSegments.map((segment) => (
          <button
            key={segment.value}
            type="button"
            onClick={() => updateParams({ segment: segment.value })}
            className={cn(
              "h-10 rounded-full px-4 text-base font-medium text-muted-foreground transition-all",
              "hover:bg-surface-2 hover:text-foreground",
              selectedSegment === segment.value &&
                "border border-white bg-surface-3 text-foreground shadow-[0_0_0_1px_hsl(var(--border))]",
            )}
          >
            {segment.label}
          </button>
        ))}
      </div>

      <DateRangeFilter
        from={from}
        to={to}
        isInvalidRange={isInvalidRange}
        onChange={(range) => updateParams(range)}
      />
    </div>
  );
}
