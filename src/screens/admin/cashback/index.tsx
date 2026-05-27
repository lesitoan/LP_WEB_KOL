'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/useToast'
import {
  useGetAdminCashbackConfigsQuery,
  useGetAdminCashbackCyclesQuery,
  useGetAdminCashbackPayoutsQuery,
} from '@/services/api/admin/cashbackApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import type {
  ListAdminCashbackConfigsQuery,
  ListAdminCashbackCyclesQuery,
  ListAdminCashbackPayoutsQuery,
} from '@/types/admin/cashback'
import { AdminCashbackFilters } from './components/AdminCashbackFilters'
import {
  AdminCashbackConfigsTable,
  AdminCashbackCyclesTable,
  AdminCashbackPayoutsTable,
} from './components/AdminCashbackTables'
import { useAdminCashbackFiltersState, type AdminCashbackQuery, type AdminCashbackTab } from './hooks/useAdminCashbackFiltersState'

const tabs: Array<{ id: AdminCashbackTab; label: string }> = [
  { id: 'configs', label: 'Cấu hình' },
  { id: 'cycles', label: 'Chu kỳ' },
  { id: 'payouts', label: 'Chi trả' },
]

function buildConfigsQuery(query: AdminCashbackQuery): ListAdminCashbackConfigsQuery {
  return {
    page: query.page,
    limit: query.limit,
    kolId: query.kolId,
    telegramGroupId: query.telegramGroupId,
    status: query.status === 'active' || query.status === 'inactive' ? query.status : undefined,
    distributionCycle: query.distributionCycle,
  }
}

function buildCyclesQuery(query: AdminCashbackQuery): ListAdminCashbackCyclesQuery {
  return {
    page: query.page,
    limit: query.limit,
    kolId: query.kolId,
    cycleType: query.cycleType,
    status:
      query.status && query.status !== 'active' && query.status !== 'inactive'
        ? query.status
        : undefined,
    periodStartFrom: query.periodStartFrom,
    periodEndTo: query.periodEndTo,
  }
}

function buildPayoutsQuery(query: AdminCashbackQuery): ListAdminCashbackPayoutsQuery {
  return {
    page: query.page,
    limit: query.limit,
    kolId: query.kolId,
    memberId: query.memberId,
    cycleId: query.cycleId,
    telegramGroupId: query.telegramGroupId,
    payoutStatus: query.payoutStatus,
  }
}

function resetQueryForTab(tab: AdminCashbackTab, current: AdminCashbackQuery): AdminCashbackQuery {
  const base = {
    page: 1,
    limit: current.limit,
    kolId: current.kolId,
  }

  if (tab === 'configs') {
    return {
      ...base,
      telegramGroupId: current.telegramGroupId,
    }
  }

  if (tab === 'cycles') {
    return base
  }

  return {
    ...base,
    telegramGroupId: current.telegramGroupId,
  }
}

function paginationSummary(page: number, limit: number, totalItems: number, emptyText: string, itemLabel: string) {
  if (totalItems === 0) return emptyText
  const startIndex = (page - 1) * limit + 1
  const endIndex = Math.min(page * limit, totalItems)
  return `Hiển thị ${startIndex}-${endIndex} / ${totalItems} ${itemLabel}`
}

export default function AdminCashbackScreen() {
  const { state, setQuery, setViewMode } = useAdminCashbackFiltersState()
  const tab = state.viewMode
  const configsQuery = buildConfigsQuery(state.query)
  const cyclesQuery = buildCyclesQuery(state.query)
  const payoutsQuery = buildPayoutsQuery(state.query)

  const configsResult = useGetAdminCashbackConfigsQuery(configsQuery, { skip: tab !== 'configs' })
  const cyclesResult = useGetAdminCashbackCyclesQuery(cyclesQuery, { skip: tab !== 'cycles' })
  const payoutsResult = useGetAdminCashbackPayoutsQuery(payoutsQuery, { skip: tab !== 'payouts' })
  const activeResult = tab === 'configs' ? configsResult : tab === 'cycles' ? cyclesResult : payoutsResult
  const activeError = activeResult.error
  const activeIsFetching = activeResult.isFetching

  useEffect(() => {
    if (activeError) {
      toast({
        variant: 'destructive',
        title: 'Không tải được module cashback',
        description: extractApiErrorMessage(activeError, 'Đã có lỗi xảy ra khi gọi API /admin/cashback'),
      })
    }
  }, [activeError])

  const emptyContent = activeError
    ? extractApiErrorMessage(activeError, 'Không thể tải dữ liệu cashback')
    : 'Không có dữ liệu cashback phù hợp.'

  const page = state.query.page
  const limit = state.query.limit
  const configsPagination = configsResult.data?.pagination
  const cyclesPagination = cyclesResult.data?.pagination
  const payoutsPagination = payoutsResult.data?.pagination

  const renderContent = () => {
    if (tab === 'configs') {
      const totalItems = configsPagination?.totalItems ?? 0
      return (
        <AdminCashbackConfigsTable
          items={configsResult.data?.items ?? []}
          isFetching={configsResult.isFetching}
          emptyContent={emptyContent}
          pagination={{
            page,
            limit,
            totalItems,
            totalPages: Math.max(1, configsPagination?.totalPages ?? 1),
            isDisabled: configsResult.isFetching,
            summaryText: paginationSummary(page, limit, totalItems, 'Chưa có cấu hình cashback.', 'cấu hình'),
            onPageChange: (nextPage) => setQuery({ ...state.query, page: nextPage }),
            onLimitChange: (nextLimit) => setQuery({ ...state.query, page: 1, limit: nextLimit }),
            limitOptions: [10, 20, 50, 100],
          }}
        />
      )
    }

    if (tab === 'cycles') {
      const totalItems = cyclesPagination?.totalItems ?? 0
      return (
        <AdminCashbackCyclesTable
          items={cyclesResult.data?.items ?? []}
          isFetching={cyclesResult.isFetching}
          emptyContent={emptyContent}
          pagination={{
            page,
            limit,
            totalItems,
            totalPages: Math.max(1, cyclesPagination?.totalPages ?? 1),
            isDisabled: cyclesResult.isFetching,
            summaryText: paginationSummary(page, limit, totalItems, 'Chưa có chu kỳ cashback.', 'chu kỳ'),
            onPageChange: (nextPage) => setQuery({ ...state.query, page: nextPage }),
            onLimitChange: (nextLimit) => setQuery({ ...state.query, page: 1, limit: nextLimit }),
            limitOptions: [10, 20, 50, 100],
          }}
        />
      )
    }

    const totalItems = payoutsPagination?.totalItems ?? 0
    return (
      <AdminCashbackPayoutsTable
        items={payoutsResult.data?.items ?? []}
        isFetching={payoutsResult.isFetching}
        emptyContent={emptyContent}
        pagination={{
          page,
          limit,
          totalItems,
          totalPages: Math.max(1, payoutsPagination?.totalPages ?? 1),
          isDisabled: payoutsResult.isFetching,
          summaryText: paginationSummary(page, limit, totalItems, 'Chưa có khoản chi cashback.', 'khoản chi'),
          onPageChange: (nextPage) => setQuery({ ...state.query, page: nextPage }),
          onLimitChange: (nextLimit) => setQuery({ ...state.query, page: 1, limit: nextLimit }),
          limitOptions: [10, 20, 50, 100],
        }}
      />
    )
  }

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <section className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Cashback</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi cấu hình, chu kỳ tính cashback và các khoản chi của toàn hệ thống.
          </p>
        </section>

        {/* <Button type="button" variant="outline" onClick={() => activeResult.refetch()} disabled={activeIsFetching}>
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button> */}
      </div>

      {activeError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/[0.08] p-4 text-sm text-destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{extractApiErrorMessage(activeError, 'Không thể tải dữ liệu cashback')}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => activeResult.refetch()}>
              Thử lại
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`h-9 rounded-md border px-3 text-sm font-medium transition-colors ${
              item.id === tab
                ? 'border-brand bg-brand/10 text-foreground'
                : 'border-border bg-surface-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground'
            }`}
            onClick={() => {
              setViewMode(item.id)
              setQuery(resetQueryForTab(item.id, state.query))
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Card className="min-w-0 overflow-visible">
        <AdminCashbackFilters tab={tab} query={state.query} isFetching={activeIsFetching} onQueryChange={setQuery} />
        <div className="min-w-0 max-w-full rounded-b-[14px] overflow-hidden">{renderContent()}</div>
      </Card>
    </div>
  )
}
