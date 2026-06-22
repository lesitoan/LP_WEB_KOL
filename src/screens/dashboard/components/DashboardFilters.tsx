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
  const hasDateRangeParams = searchParams.has("from") || searchParams.has("to");
  const isGetAllTime = searchParams.get("getalltime") === "true" || !hasDateRangeParams;
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;
  const isInvalidRange = !isGetAllTime && Boolean(from && to && to < from);

  const updateParams = (updates: Partial<Record<"segment" | "from" | "to" | "isGetAllTime", string | boolean>>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (key === "isGetAllTime") {
        if (value) {
          params.set("getalltime", "true");
          params.delete("from");
          params.delete("to");
        } else {
          params.delete("getalltime");
        }
        return;
      }

      if (!value || (key === "segment" && value === "all")) {
        params.delete(key);
        return;
      }

      params.set(key, value.toString());
    });

    if (updates.from || updates.to) {
      params.delete("getalltime");
    }

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
                "bg-surface-3 text-foreground",
            )}
          >
            {segment.label}
          </button>
        ))}
      </div>

      <DateRangeFilter
        from={from}
        to={to}
        isGetAllTime={isGetAllTime}
        isInvalidRange={isInvalidRange}
        onChange={(range) => updateParams(range)}
      />
    </div>
  );
}
