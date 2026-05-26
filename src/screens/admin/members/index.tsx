'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useGetAdminMembersQuery } from '@/services/api/admin/membersApi'
import { useAdminMembersFiltersState } from './hooks/useAdminMembersFiltersState'
import { AdminMemberLookupDialog } from './components/AdminMemberLookupDialog'
import { AdminMembersFilters } from './components/AdminMembersFilters'
import { AdminMembersTable } from './components/AdminMembersTable'

export default function AdminMembersScreen() {
  const { state, setSearchInput, setQuery } = useAdminMembersFiltersState()
  const { data, isFetching, error, refetch } = useGetAdminMembersQuery(state.query)

  const members = data?.items ?? []
  const pagination = data?.pagination
  const totalItems = pagination?.totalItems ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const startIndex = totalItems === 0 ? 0 : (state.query.page - 1) * state.query.limit + 1
  const endIndex = Math.min(state.query.page * state.query.limit, totalItems)

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách thành viên',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra khi gọi API /admin/members'),
      })
    }
  }, [error])

  const emptyContent = error
    ? extractApiErrorMessage(error, 'Không thể tải danh sách thành viên')
    : 'Không có thành viên phù hợp.'

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <section className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Quản lý thành viên</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi thành viên, KOL giới thiệu, nhóm đủ điều kiện và chỉ số cashback.
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          {/* <Button type="button" variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button> */}
          <AdminMemberLookupDialog />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/[0.08] p-4 text-sm text-destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{extractApiErrorMessage(error, 'Không thể tải danh sách thành viên')}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        </div>
      ) : null}

      <Card className="min-w-0 overflow-visible">
        <AdminMembersFilters
          query={state.query}
          searchInput={state.searchInput}
          isFetching={isFetching}
          onSearchInputChange={setSearchInput}
          onQueryChange={setQuery}
        />
        <div className="min-w-0 max-w-full rounded-b-[14px] overflow-hidden">
          <AdminMembersTable
            members={members}
            isFetching={isFetching}
            emptyContent={emptyContent}
            pagination={{
              page: state.query.page,
              limit: state.query.limit,
              totalItems,
              totalPages: Math.max(1, totalPages),
              isDisabled: isFetching,
              summaryText:
                totalItems > 0
                  ? `Hiển thị ${startIndex}-${endIndex} / ${totalItems} thành viên`
                  : 'Chưa có dữ liệu thành viên',
              onPageChange: (page) => setQuery({ ...state.query, page }),
              onLimitChange: (limit) => setQuery({ ...state.query, page: 1, limit }),
              limitOptions: [10, 20, 50, 100],
            }}
          />
        </div>
      </Card>
    </div>
  )
}
