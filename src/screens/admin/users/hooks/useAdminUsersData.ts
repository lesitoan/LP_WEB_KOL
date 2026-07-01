import { useMemo, useState } from 'react'
import { useListAdminUsersQuery } from '@/services/api/admin/usersApi'
import { mapAdminUserToRow } from '../constants'

const DEFAULT_LIMIT = 8

export function useAdminUsersData() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)

  const listQuery = useListAdminUsersQuery({ page, limit })
  const users = useMemo(
    () => (listQuery.data?.items ?? []).map(mapAdminUserToRow),
    [listQuery.data?.items]
  )
  const paginationMeta = listQuery.data?.pagination
  const totalItems = paginationMeta?.totalItems ?? 0
  const totalPages = paginationMeta?.totalPages ?? 1
  const safePage = paginationMeta?.page ?? page
  const safeLimit = paginationMeta?.limit ?? limit
  const from = totalItems === 0 ? 0 : (safePage - 1) * safeLimit + 1
  const to = Math.min(safePage * safeLimit, totalItems)

  return {
    listQuery,
    users,
    isLoading: listQuery.isLoading || listQuery.isFetching,
    showEmpty: !listQuery.isLoading && !listQuery.isFetching && users.length === 0,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages,
      onPageChange: setPage,
      onLimitChange: setLimit,
      isDisabled: listQuery.isFetching,
      summaryText: totalItems > 0 ? `Hiển thị ${from}-${to} / ${totalItems}` : 'Hiển thị 0 / 0',
    },
  }
}
