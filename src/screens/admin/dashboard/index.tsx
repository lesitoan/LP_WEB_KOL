'use client'

import { useMemo } from 'react'
import { type DataTableColumn } from '@/components/ui/dataTable'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useGetAdminDashboardOverviewQuery, useGetAdminRecentActivitiesQuery } from '@/services/api/admin/dashboardApi'
import { useUrlFilterState } from '@/hooks/useUrlFilterState'
import type { AdminDashboardKolItem } from '@/types/admin/dashboard'
import { adminKolStatusLabel, kolStatusClassName, toCompactNumber, toCurrencyUsd, toDateTimeVi } from './mappers'
import DashboardKolTable from './components/DashboardKolTable'
import DashboardRecentActivities from './components/DashboardRecentActivities'

const limitOptions = [10, 20, 50]

type DashboardFilters = {
  page: string
  limit: string
}

const parsePositiveInt = (value: string, fallback: number) => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

export default function AdminDashboardScreen() {
  const { values, setFilter } = useUrlFilterState<DashboardFilters>({
    initialValues: {
      page: '1',
      limit: '20',
    },
  })

  const page = parsePositiveInt(values.page, 1)
  const limit = parsePositiveInt(values.limit, 20)

  const overviewQuery = useGetAdminDashboardOverviewQuery({
    page,
    limit,
    memberLimit: 5,
  })

  const activitiesQuery = useGetAdminRecentActivitiesQuery({ limit: 8 })

  const columns = useMemo<DataTableColumn<AdminDashboardKolItem>[]>(
    () => [
      {
        id: 'code',
        header: 'Mã Partner',
        cell: (row) => <span className="font-medium">{row.code}</span>,
      },
      {
        id: 'displayName',
        header: 'Tên Partner',
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
            <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0 mr-1" />
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
    ? extractApiErrorMessage(overviewQuery.error, 'Không thể tải danh sách Partner dashboard')
    : null

  const activitiesErrorMessage = activitiesQuery.error
    ? extractApiErrorMessage(activitiesQuery.error, 'Không thể tải hoạt động gần đây')
    : null

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tổng quan quản trị</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi hiệu suất Partner, thành viên và các hoạt động gần đây của hệ thống.
        </p>
      </section>

      {/* <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số Partner</CardTitle>
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
          emptyContent={tableErrorMessage ? tableErrorMessage : 'Không có dữ liệu Partner phù hợp'}
          page={page}
          limit={limit}
          totalItems={overviewQuery.data?.totalItems ?? 0}
          limitOptions={limitOptions}
          onPageChange={(nextPage) => setFilter('page', String(nextPage), { immediate: true })}
          onLimitChange={(nextLimit) => {
            setFilter('limit', String(nextLimit), { immediate: true })
            setFilter('page', '1', { immediate: true })
          }}
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
