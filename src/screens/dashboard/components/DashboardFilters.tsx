"use client";

import { CalendarDays } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex w-fit items-center gap-2 rounded-full">
        {dashboardSegments.map((segment) => (
          <button
            key={segment.value}
            type="button"
            onClick={() => updateParams({ segment: segment.value })}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-all",
              "hover:bg-surface-2 hover:text-foreground",
              selectedSegment === segment.value &&
                "border border-white bg-surface-3 text-foreground shadow-[0_0_0_1px_hsl(var(--border))]",
            )}
          >
            {segment.label}
          </button>
        ))}
      </div>

      <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground sm:w-auto">
        <div className="flex min-w-0 items-center gap-2">
          <input
            aria-label="Từ ngày"
            type="date"
            value={from}
            onChange={(event) => updateParams({ from: event.target.value })}
            className="w-[128px] bg-transparent text-sm outline-none [color-scheme:dark]"
          />
          <span className="text-muted-foreground">-</span>
          <input
            aria-label="Đến ngày"
            type="date"
            value={to}
            onChange={(event) => updateParams({ to: event.target.value })}
            className="w-[128px] bg-transparent text-sm outline-none [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  );
}
