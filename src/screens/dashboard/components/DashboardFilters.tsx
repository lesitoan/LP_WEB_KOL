"use client";

import { useRef } from "react";
import { CalendarDays } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardSegments, defaultDateRange, type DashboardSegment } from "../constants";

function isDashboardSegment(value: string | null): value is DashboardSegment {
  return value === "all" || value === "spot" || value === "future";
}

function formatIsoToDisplay(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export default function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromPickerRef = useRef<HTMLInputElement>(null);
  const toPickerRef = useRef<HTMLInputElement>(null);

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

  const openDatePicker = (input: HTMLInputElement | null) => {
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.click();
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

      <div className="flex w-full flex-col items-end gap-1 sm:w-auto">
        <div
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-lg border bg-surface-2 px-3 py-2 text-sm text-foreground sm:w-auto",
            isInvalidRange ? "border-red-500/70" : "border-border",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => openDatePicker(fromPickerRef.current)}
              className="relative inline-flex w-[122px] items-center justify-between gap-2 text-left text-sm outline-none"
            >
              <span>{formatIsoToDisplay(from)}</span>
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={fromPickerRef}
                aria-label="Từ ngày"
                type="date"
                value={from}
                onChange={(event) => updateParams({ from: event.target.value })}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                tabIndex={-1}
              />
            </button>
            <span className="text-muted-foreground">-</span>
            <button
              type="button"
              onClick={() => openDatePicker(toPickerRef.current)}
              className="relative inline-flex w-[122px] items-center justify-between gap-2 text-left text-sm outline-none"
            >
              <span>{formatIsoToDisplay(to)}</span>
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={toPickerRef}
                aria-label="Đến ngày"
                type="date"
                value={to}
                onChange={(event) => updateParams({ to: event.target.value })}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                tabIndex={-1}
              />
            </button>
          </div>
        </div>
        {isInvalidRange ? (
          <p className="text-xs font-medium text-red-400">Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu</p>
        ) : null}
      </div>
    </div>
  );
}
