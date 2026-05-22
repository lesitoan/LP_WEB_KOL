'use client'

import { useMemo } from 'react'
import { type DataTableColumn } from '@/components/ui/dataTable'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useGetAdminDashboardOverviewQuery, useGetAdminRecentActivitiesQuery } from '@/services/api/admin/dashboardApi'
import { useUrlFilterState } from '@/hooks/useUrlFilterState'
import type { AdminDashboardKolItem, AdminKolStatus } from '@/types/admin/dashboard'
import { adminKolStatusLabel, kolStatusClassName, toCompactNumber, toCurrencyUsd, toDateTimeVi } from './mappers'
import { buildActiveFilterChips, buildStatusBadges, statusOptions } from './components/dashboardKolFilter'
import DashboardKolFilters from './components/DashboardKolFilters'
import DashboardKolTable from './components/DashboardKolTable'
import DashboardRecentActivities from './components/DashboardRecentActivities'

const limitOptions = [10, 20, 50]

type DashboardFilters = {
  search: string
  status: string
  page: string
  limit: string
}

const parsePositiveInt = (value: string, fallback: number) => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

export default function AdminDashboardScreen() {
  const { values, draftValues, setFilter, clearFilter } = useUrlFilterState<DashboardFilters>({
    initialValues: {
      search: '',
      status: 'all',
      page: '1',
      limit: '20',
    },
    debounceKeys: ['search'],
    debounceMs: 400,
  })

  const page = parsePositiveInt(values.page, 1)
  const limit = parsePositiveInt(values.limit, 20)
  const status = values.status !== 'all' ? (values.status as AdminKolStatus) : undefined

  const overviewQuery = useGetAdminDashboardOverviewQuery({
    page,
    limit,
    search: values.search || undefined,
    status,
    memberLimit: 5,
  })

  const activitiesQuery = useGetAdminRecentActivitiesQuery({ limit: 8 })

  const activeFilterChips = useMemo(() => buildActiveFilterChips(values.status), [values.status])

  const statusBadges = useMemo(() => buildStatusBadges(overviewQuery.data?.items ?? []), [overviewQuery.data?.items])

  const columns = useMemo<DataTableColumn<AdminDashboardKolItem>[]>(
    () => [
      {
        id: 'code',
        header: 'Mã KOL',
        cell: (row) => <span className="font-medium">{row.code}</span>,
      },
      {
        id: 'displayName',
        header: 'Tên KOL',
        cell: (row) => (
          <div className="space-y-1 max-w-[250px]">
            <p className="font-medium truncate">{row.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">@{row.telegramUsername}</p>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Trạng thái',
        cell: (row) => (
          <span className={`inline-flex items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${kolStatusClassName(row.status)}`}>
            {adminKolStatusLabel[row.status]}
          </span>
        ),
      },
      {
        id: 'members',
        header: 'Thành viên',
        cellClassName: 'font-geist-mono',
        cell: (row) => toCompactNumber(row.memberCount),
      },
      {
        id: 'volume',
        header: 'Tổng volume (USD)',
        cellClassName: 'font-geist-mono',
        cell: (row) => toCurrencyUsd(row.totalMemberVolumeUsd),
      },
      {
        id: 'updatedAt',
        header: 'Cập nhật',
        cell: (row) => toDateTimeVi(row.updatedAt),
      },
    ],
    [],
  )

  const tableErrorMessage = overviewQuery.error
    ? extractApiErrorMessage(overviewQuery.error, 'Không thể tải danh sách KOL dashboard')
    : null

  const activitiesErrorMessage = activitiesQuery.error
    ? extractApiErrorMessage(activitiesQuery.error, 'Không thể tải hoạt động gần đây')
    : null

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tổng quan quản trị</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi hiệu suất KOL, thành viên và các hoạt động gần đây của hệ thống.
        </p>
      </section>

      {/* <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số KOL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{toCompactNumber(overviewQuery.data?.summary.totalKols ?? 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số thành viên</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{toCompactNumber(overviewQuery.data?.summary.totalMembers ?? 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng volume thành viên</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{toCurrencyUsd(overviewQuery.data?.summary.totalMemberVolumeUsd ?? 0)}</p>
          </CardContent>
        </Card>
      </section> */}

      <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <DashboardKolTable
          columns={columns}
          data={overviewQuery.data?.items ?? []}
          isLoading={overviewQuery.isLoading || overviewQuery.isFetching}
          isFetching={overviewQuery.isFetching}
          emptyContent={tableErrorMessage ? tableErrorMessage : 'Không có dữ liệu KOL phù hợp'}
          page={page}
          limit={limit}
          totalItems={overviewQuery.data?.totalItems ?? 0}
          limitOptions={limitOptions}
          onPageChange={(nextPage) => setFilter('page', String(nextPage), { immediate: true })}
          onLimitChange={(nextLimit) => {
            setFilter('limit', String(nextLimit), { immediate: true })
            setFilter('page', '1', { immediate: true })
          }}
          filtersSlot={
            <DashboardKolFilters
              draftSearch={draftValues.search}
              statusOptions={statusOptions}
              activeFilterChips={activeFilterChips}
              statusBadges={statusBadges}
              isDisabled={overviewQuery.isFetching}
              onSearchChange={(value) => {
                setFilter('search', value)
                setFilter('page', '1', { immediate: true })
              }}
              onStatusChange={(value) => {
                setFilter('status', value, { immediate: true })
                setFilter('page', '1', { immediate: true })
              }}
              onRemoveChip={(key) => {
                clearFilter(key as keyof DashboardFilters, { immediate: true })
                setFilter('page', '1', { immediate: true })
              }}
            />
          }
        />

        <DashboardRecentActivities
          isLoading={activitiesQuery.isLoading || activitiesQuery.isFetching}
          errorMessage={activitiesErrorMessage}
          activities={activitiesQuery.data ?? []}
        />
      </section>
    </div>
  )
}
