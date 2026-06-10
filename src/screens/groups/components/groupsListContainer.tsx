"use client"

import type { GroupItem, ListGroupsQuery, UpdateGroupBody } from "@/types/api";
import { GroupsFilters } from "./groupsFilters";
import { GroupsTableView } from "./groupsTableView";
import { GroupsItemView } from "./groupsItemView";
import type { GroupsViewMode } from "../hooks/useGroupsFiltersState";

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

  return (
    <div className="bg-[#171717] border border-border rounded-[14px] overflow-visible relative">
      <GroupsFilters
        searchInput={searchInput}
        statusValue={query.status || ''}
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

      <div className="rounded-b-[14px] overflow-hidden">
        {viewMode === "table" ? (
          <GroupsTableView
            groups={groups}
            isFetching={isFetching}
            pagination={{
              page: query.page,
              totalPages: Math.max(1, totalPages),
              totalItems,
              limit: query.limit,
              isDisabled: isFetching,
              summaryText:
                totalItems > 0
                  ? `Hiển thị ${startIndex}-${endIndex} / ${totalItems} groups`
                  : "Chưa có dữ liệu group",
              onPageChange: (page) => onQueryChange({ ...query, page }),
              onLimitChange: (limit) => onQueryChange({ ...query, page: 1, limit }),
              limitOptions: [10, 20, 50, 100],
            }}
            onUpdateGroup={onUpdateGroup}
            onToggleGroupStatus={onToggleGroupStatus}
            onDeleteGroup={onDeleteGroup}
          />
        ) : (
          <div className="p-3 sm:p-5 space-y-4">
            <GroupsItemView
              groups={groups}
              onUpdateGroup={onUpdateGroup}
              onToggleGroupStatus={onToggleGroupStatus}
              onDeleteGroup={onDeleteGroup}
            />
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-[#171717]/60 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {totalItems > 0
                  ? `Hiển thị ${startIndex}-${endIndex} của ${totalItems} group`
                  : "Không có dữ liệu group"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md border border-border bg-surface-2 disabled:opacity-50"
                  onClick={() => onQueryChange({ ...query, page: Math.max(1, query.page - 1) })}
                  disabled={isFetching || query.page <= 1}
                >
                  Trước
                </button>
                <span>
                  Trang {query.page}/{Math.max(1, totalPages)}
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md border border-border bg-surface-2 disabled:opacity-50"
                  onClick={() => onQueryChange({ ...query, page: query.page + 1 })}
                  disabled={isFetching || query.page >= Math.max(1, totalPages)}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
