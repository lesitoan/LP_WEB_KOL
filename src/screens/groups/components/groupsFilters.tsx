"use client"

import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableFilterBar, {
  type ActiveFilterChip,
  type SelectFilterConfig,
} from "@/components/filters/TableFilterBar";
import type { GroupsViewMode } from "../hooks/useGroupsFiltersState";

type GroupsFiltersProps = {
  searchInput: string;
  statusValue: string;
  viewMode: GroupsViewMode;
  isFetching: boolean;
  onSearchInputChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearStatus: () => void;
  onViewModeChange: (mode: GroupsViewMode) => void;
}

const STATUS_FILTER_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' }
]

export function GroupsFilters({
  searchInput,
  statusValue,
  viewMode,
  isFetching,
  onSearchInputChange,
  onStatusChange,
  onClearStatus,
  onViewModeChange,
}: GroupsFiltersProps) {
  const selectFilters: SelectFilterConfig[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      options: STATUS_FILTER_OPTIONS,
    },
  ]


  const activeFilterChips: ActiveFilterChip[] =
    statusValue && statusValue !== 'all'
      ? [
          {
            key: 'status',
            label: 'Trạng thái',
            valueLabel: STATUS_FILTER_OPTIONS.find((option) => option.value === statusValue)?.label ?? statusValue,
          },
        ]
      : []

  return (
    <div>
      <TableFilterBar
        textFilters={[
          {
            key: "search",
            placeholder: "Tìm theo tên group, tier, telegram group id...",
            widthClassName: "flex-1 min-w-[260px] max-w-[520px]",
          },
        ]}
        textValues={{ search: searchInput }}
        selectFilters={selectFilters}
        activeFilterChips={activeFilterChips}
        disabled={isFetching}
        onTextChange={(_, value) => onSearchInputChange(value)}
        onSelectFilter={(_, value) => onStatusChange(value)}
        onRemoveChip={() => onClearStatus()}
      />

      <div className="flex items-center justify-between px-5 py-2 border-t border-border text-xs text-muted-foreground">
        <span>Chế độ hiển thị</span>
        <div className="inline-flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={viewMode === "table" ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => onViewModeChange("table")}
            disabled={isFetching}
          >
            <Table2 className="mr-1.5 h-3.5 w-3.5" />
            Bảng
          </Button>
          <Button
            type="button"
            size="sm"
            variant={viewMode === "item" ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => onViewModeChange("item")}
            disabled={isFetching}
          >
            <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
            Item
          </Button>
        </div>
      </div>
    </div>
  );
}
