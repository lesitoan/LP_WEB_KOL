"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { groupRows } from "../constants";

const defaultGroup = groupRows[0]?.name ?? "VIP Platinum";
const defaultDateRange = {
  from: "2026-03-05",
  to: "2026-03-06",
};

function formatIsoToDisplay(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export default function AnalyticsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedGroup = searchParams.get("group") || defaultGroup;
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;

  const updateParams = (updates: Partial<Record<"group" | "from" | "to", string>>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <label className="relative inline-flex h-10 min-w-[244px] items-center rounded-lg border border-border bg-surface-2 px-3 text-sm text-foreground">
        <span className="mr-1 text-muted-foreground">Đang xem nhóm:</span>
        <select
          aria-label="Chọn nhóm"
          value={selectedGroup}
          onChange={(event) => updateParams({ group: event.target.value })}
          className="min-w-0 flex-1 appearance-none bg-transparent pr-7 font-medium outline-none"
        >
          {groupRows.map((group) => (
            <option key={group.name} value={group.name} className="bg-surface-2 text-foreground">
              {group.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
      </label>

      <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-foreground">
        <label className="relative inline-flex cursor-pointer items-center gap-2">
          <span>{formatIsoToDisplay(from)}</span>
          <input
            aria-label="Từ ngày"
            type="date"
            value={from}
            onChange={(event) => updateParams({ from: event.target.value })}
            className="absolute inset-0 opacity-0"
          />
        </label>
        <span className="text-muted-foreground">-</span>
        <label className="relative inline-flex cursor-pointer items-center gap-2">
          <span>{formatIsoToDisplay(to)}</span>
          <input
            aria-label="Đến ngày"
            type="date"
            value={to}
            onChange={(event) => updateParams({ to: event.target.value })}
            className="absolute inset-0 opacity-0"
          />
        </label>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
