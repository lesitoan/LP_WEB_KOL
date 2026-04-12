'use client'

import { useMemo } from 'react'
import type { GroupItem, ListGroupsQuery, UpdateGroupBody } from '@/types/api'
import { GroupsFilters } from './groupsFilters'
import { GroupsTableView } from './groupsTableView'

type GroupsListContainerProps = {
  groups: GroupItem[]
  query: ListGroupsQuery
  searchInput: string
  totalItems: number
  totalPages: number
  isFetching: boolean
  onSearchInputChange: (value: string) => void
  onQueryChange: (next: ListGroupsQuery) => void
  onUpdateGroup: (groupId: string, payload: UpdateGroupBody) => Promise<void>
  onDeleteGroup: (groupId: string, title: string) => Promise<void>
}

export function GroupsListContainer({
  groups,
  query,
  searchInput,
  totalItems,
  totalPages,
  isFetching,
  onSearchInputChange,
  onQueryChange,
  onUpdateGroup,
  onDeleteGroup,
}: GroupsListContainerProps) {
  const startIndex = totalItems === 0 ? 0 : (query.page - 1) * query.limit + 1
  const endIndex = Math.min(query.page * query.limit, totalItems)

  const statusBadges = useMemo(() => {
    const counter = new Map<string, number>()

    for (const group of groups) {
      const rawStatus = (group.status || 'unknown').trim().toLowerCase()
      if (!rawStatus || rawStatus === 'active') continue
      counter.set(rawStatus, (counter.get(rawStatus) ?? 0) + 1)
    }

    return Array.from(counter.entries())
      .map(([status, count]) => {
        const tone: 'warning' | 'info' | 'danger' | 'neutral' =
          status === 'blocked' ? 'danger' : status === 'paused' ? 'warning' : status === 'inactive' ? 'neutral' : 'info'

        return {
          key: status,
          label: status,
          count,
          tone,
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [groups])

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] overflow-visible relative">
      <GroupsFilters
        searchInput={searchInput}
        statusValue={query.status || ''}
        isFetching={isFetching}
        statusBadges={statusBadges}
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
      />

      <div className="rounded-b-[14px] overflow-hidden">
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
                : 'Chưa có dữ liệu group',
            onPageChange: (page) => onQueryChange({ ...query, page }),
            onLimitChange: (limit) => onQueryChange({ ...query, page: 1, limit }),
            limitOptions: [10, 20, 50, 100],
          }}
          onUpdateGroup={onUpdateGroup}
          onDeleteGroup={onDeleteGroup}
        />
      </div>
    </div>
  )
}
