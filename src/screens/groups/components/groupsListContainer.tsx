"use client"

import { DataTablePaginationBar } from "@/components/ui/dataTable";
import type { GroupItem, ListGroupsQuery, UpdateGroupBody } from "@/types/api";
import type { GroupsViewMode } from "../hooks/useGroupsFiltersState";
import { GroupsFilters } from "./groupsFilters";
import { GroupsItemView } from "./groupsItemView";
import { GroupsTableView } from "./groupsTableView";

type GroupsListContainerProps = {
  groups: GroupItem[];
  query: ListGroupsQuery;
  searchInput: string;
  viewMode: GroupsViewMode;
  totalItems: number;
  totalPages: number;
  isFetching: boolean;
  onSearchInputChange: (value: string) => void;
  onQueryChange: (next: ListGroupsQuery) => void;
  onViewModeChange: (mode: GroupsViewMode) => void;
  onUpdateGroup: (groupId: string, payload: UpdateGroupBody) => Promise<void>;
  onToggleGroupStatus: (groupId: string, title: string, nextStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>;
  onDeleteGroup: (groupId: string, title: string) => Promise<void>;
}

export function GroupsListContainer({
  groups,
  query,
  searchInput,
  viewMode,
  totalItems,
  totalPages,
  isFetching,
  onSearchInputChange,
  onQueryChange,
  onViewModeChange,
  onUpdateGroup,
  onToggleGroupStatus,
  onDeleteGroup,
}: GroupsListContainerProps) {
  const startIndex = totalItems === 0 ? 0 : (query.page - 1) * query.limit + 1
  const endIndex = Math.min(query.page * query.limit, totalItems)

  const pagination = {
    page: query.page,
    totalPages: Math.max(1, totalPages),
    totalItems,
    limit: query.limit,
    isDisabled: isFetching,
    summaryText:
      totalItems > 0
        ? `Hiển thị ${startIndex}-${endIndex} / ${totalItems}`
        : "Chưa có dữ liệu group",
    onPageChange: (page: number) => onQueryChange({ ...query, page }),
    onLimitChange: (limit: number) => onQueryChange({ ...query, page: 1, limit }),
    limitOptions: [10, 20, 50, 100],
  }

  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-surface-card">
      <GroupsFilters
        searchInput={searchInput}
        statusValue={query.status || ""}
        viewMode={viewMode}
        isFetching={isFetching}
        onSearchInputChange={onSearchInputChange}
        onStatusChange={(value) =>
          onQueryChange({
            ...query,
            page: 1,
            status: value || undefined,
          })
        }
        onClearStatus={() =>
          onQueryChange({
            ...query,
            page: 1,
            status: undefined,
          })
        }
        onViewModeChange={onViewModeChange}
      />

      <div className="min-w-0 overflow-hidden rounded-b-card">
        {viewMode === "table" ? (
          <GroupsTableView
            groups={groups}
            isFetching={isFetching}
            pagination={pagination}
            onUpdateGroup={onUpdateGroup}
            onToggleGroupStatus={onToggleGroupStatus}
            onDeleteGroup={onDeleteGroup}
          />
        ) : (
          <>
            <div className="p-2 sm:p-5">
              <GroupsItemView
                groups={groups}
                onUpdateGroup={onUpdateGroup}
                onToggleGroupStatus={onToggleGroupStatus}
                onDeleteGroup={onDeleteGroup}
              />
            </div>
            <DataTablePaginationBar pagination={pagination} />
          </>
        )}
      </div>
    </div>
  )
}
