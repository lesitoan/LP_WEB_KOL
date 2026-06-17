"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
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

export default function AnalyticsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  return (
    <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-start sm:justify-end">
      <Select
        value={selectedGroupId ?? ""}
        onValueChange={(value) => updateParams({ groupId: value })}
        disabled={isGroupsLoading}
      >
        <SelectTrigger
          aria-label="Chọn nhóm"
          className="h-10 w-[min(100%,294px)] min-w-0 max-w-full overflow-hidden rounded-lg border-border bg-surface-2 text-foreground sm:w-[260px]"
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

      <DateRangeFilter
        from={from}
        to={to}
        isInvalidRange={isInvalidRange}
        className="w-[min(100%,294px)] sm:w-fit"
        triggerClassName="w-full sm:w-fit"
        onChange={(range) => updateParams(range)}
      />
    </div>
  );
}
