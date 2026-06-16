"use client";

import { useRef } from "react";
import { CalendarDays } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetGroupsQuery } from "@/services/api/groupsApi";

const allGroupsValue = "__all";

const defaultDateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
  to: new Date().toISOString().split("T")[0],
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
  const fromPickerRef = useRef<HTMLInputElement>(null);
  const toPickerRef = useRef<HTMLInputElement>(null);
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery({
    page: 1,
    limit: 100,
  });

  const groups = groupsData?.items ?? [];
  const requestedGroupId = searchParams.get("groupId");
  const selectedGroup = groups.find((group) => group.id === requestedGroupId) ?? null;
  const selectedGroupId = selectedGroup?.id ?? allGroupsValue;
  const from = searchParams.get("from") || defaultDateRange.from;
  const to = searchParams.get("to") || defaultDateRange.to;
  const isInvalidRange = Boolean(from && to && to < from);

  const updateParams = (updates: Partial<Record<"groupId" | "from" | "to", string>>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }

      if (key === "groupId" && value === allGroupsValue) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    if (updates.groupId) {
      params.delete("group");
    }

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-end">
      <Select
        value={selectedGroupId ?? ""}
        onValueChange={(value) => updateParams({ groupId: value })}
        disabled={isGroupsLoading}
      >
        <SelectTrigger
          aria-label="Chon nhom"
          className="h-10 w-full min-w-0 max-w-full overflow-hidden rounded-lg border-border bg-surface-2 text-foreground sm:w-[260px]"
          title={selectedGroup?.title ?? "Tất cả"}
        >
          <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
            <span className="shrink-0 text-muted-foreground">Đang xem nhóm:</span>
            <SelectValue
              className="min-w-0 truncate font-medium"
              placeholder={isGroupsLoading ? "Đang tải..." : "Chưa có nhóm"}
            />
          </span>
        </SelectTrigger>
        <SelectContent className="max-w-[280px] border-border bg-surface-2 text-foreground">
          <SelectItem value={allGroupsValue}>
            <span className="block max-w-[220px] truncate">Tất cả</span>
          </SelectItem>
          {isGroupsLoading ? (
            <SelectItem value="__loading" disabled>
              Đang tải...
            </SelectItem>
          ) : groups.length ? (
            groups.map((group) => (
              <SelectItem key={group.id} value={group.id} title={group.title}>
                <span className="block max-w-[220px] truncate">{group.title}</span>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="__empty" disabled>
              Chưa có nhóm
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      <div className="flex w-full flex-col items-end gap-1 sm:w-auto">
        <div
          className={`flex w-full items-center justify-between gap-3 rounded-lg border bg-surface-2 px-3 py-2 text-sm text-foreground sm:w-auto ${
            isInvalidRange ? "border-red-500/70" : "border-border"
          }`}
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
                aria-label="Tu ngay"
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
                aria-label="Den ngay"
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
          <p className="text-xs font-normal text-red-400">Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu</p>
        ) : null}
      </div>
    </div>
  );
}
