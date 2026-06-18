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
      endContent={
        <div className="inline-flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={`h-10 rounded-[100px] border-0 px-4 sm:px-7 text-base font-medium shadow-none has-[>svg]:px-3 sm:has-[>svg]:px-5 ${
              viewMode === "table"
                ? "bg-[#282828] text-white hover:bg-[#282828] hover:text-white"
                : "bg-transparent text-[#D7D7D7] hover:bg-[#282828] hover:text-white"
            }`}
            onClick={() => onViewModeChange("table")}
            disabled={isFetching}
          >
            <Table2 className="mr-2 h-3.5 w-3.5" />
            Bảng
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={`h-10 rounded-[100px] border-0 px-3 sm:px-[18px] text-base font-medium shadow-none has-[>svg]:px-3 sm:has-[>svg]:px-[18px] ${
              viewMode === "item"
                ? "bg-[#282828] text-white hover:bg-[#282828] hover:text-white"
                : "bg-transparent text-[#D7D7D7] hover:bg-[#282828] hover:text-white"
            }`}
            onClick={() => onViewModeChange("item")}
            disabled={isFetching}
          >
            <LayoutGrid className="mr-2 h-3.5 w-3.5" />
            Item
          </Button>
        </div>
      }
      disabled={isFetching}
      onTextChange={(_, value) => onSearchInputChange(value)}
      onSelectFilter={(_, value) => onStatusChange(value)}
      onRemoveChip={() => onClearStatus()}
    />
  )
}
