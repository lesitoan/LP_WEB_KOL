'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import {
  useCreateCashbackConfigMutation,
  useListCashbackConfigsQuery,
  useUpdateCashbackConfigMutation,
} from '@/services/api/cashbackApi'
import { useGetGroupsQuery } from '@/services/api/groupsApi'
import type { CashbackConfigData, CashbackConfigStatus } from '@/types/api'
import type { CashbackConfigFormValues } from '../../hooks/useCashbackConfigForm'
import { useCashbackConfigsFiltersState } from '../../hooks/useCashbackConfigsFiltersState'
import { FormConfig } from './formConfig'
import { ConfigsTable } from './configsTable'

export function ConfigsTab() {
  const { state, setQuery } = useCashbackConfigsFiltersState()
  const statusFilter = state.query.status ?? 'all'
  const [isCreateFormOpen, setIsCreateFormOpen] = useState<boolean>(
    false,
  )

  const listQueryArg = useMemo(
    () => ({
      page: state.query.page,
      limit: state.query.limit,
      status: state.query.status,
    }),
    [state.query.limit, state.query.page, state.query.status],
  )

  const { data, isFetching, error } = useListCashbackConfigsQuery(listQueryArg)
  const groupsQuery = useGetGroupsQuery({ page: 1, limit: 100 })

  const [createConfig, createConfigState] = useCreateCashbackConfigMutation()
  const [updateConfigStatus, updateConfigStatusState] = useUpdateCashbackConfigMutation()

  const configs = data?.items ?? []
  const pagination = data?.pagination
  const groups = groupsQuery.data?.items ?? []

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách config',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra'),
      })
    }
  }, [error])

  useEffect(() => {
    if (groupsQuery.error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách group',
        description: extractApiErrorMessage(groupsQuery.error, 'Đã có lỗi xảy ra'),
      })
    }
  }, [groupsQuery.error])

  const onCreateConfig = async (values: CashbackConfigFormValues) => {
    const cashbackRatePct = Number(values.cashbackRatePct)
    const minPayoutUsd = Number(values.minPayoutUsd)

    try {
      await createConfig({
        telegramGroupId: values.telegramGroupId.trim(),
        cashbackRatePct,
        distributionCycle: values.distributionCycle,
        minPayoutUsd,
        effectiveFrom: new Date(values.effectiveFrom).toISOString(),
        effectiveTo: values.effectiveTo ? new Date(values.effectiveTo).toISOString() : null,
        status: values.status,
      }).unwrap()

      toast({
        title: 'Tạo config thành công',
        description: 'Đã tạo cashback config mới',
      })
      return true
    } catch (createError) {
      toast({
        variant: 'destructive',
        title: 'Không tạo được config',
        description: extractApiErrorMessage(createError, 'Đã có lỗi xảy ra'),
      })
      return false
    }
  }

  const onToggleConfigStatus = async (config: CashbackConfigData) => {
    const nextStatus: CashbackConfigStatus = config.status === 'active' ? 'inactive' : 'active'

    try {
      await updateConfigStatus({
        configId: config.id,
        data: {
          status: nextStatus,
        },
      }).unwrap()

      toast({
        title: 'Cập nhật config thành công',
        description: `Config đã được chuyển sang ${nextStatus}`,
      })
    } catch (updateError) {
      toast({
        variant: 'destructive',
        title: 'Không cập nhật được config',
        description: extractApiErrorMessage(updateError, 'Đã có lỗi xảy ra'),
      })
    }
  }

  return (
    <div className="space-y-4">
      <FormConfig
        isOpen={isCreateFormOpen}
        groups={groups}
        isSubmitting={createConfigState.isLoading}
        onToggle={() => {
          const next = !isCreateFormOpen
          setIsCreateFormOpen(next)
        }}
        onClose={() => {
          setIsCreateFormOpen(false)
        }}
        onSubmit={onCreateConfig}
      />

      <ConfigsTable
        configs={configs}
        groups={groups}
        page={state.query.page}
        limit={state.query.limit}
        totalItems={pagination?.totalItems ?? 0}
        totalPages={pagination?.totalPages ?? 1}
        isFetching={isFetching}
        statusFilter={statusFilter}
        isUpdating={updateConfigStatusState.isLoading}
        onStatusFilterChange={(value) => {
          setQuery({
            ...state.query,
            status: value === 'all' ? undefined : value,
            page: 1,
          })
        }}
        onPageChange={(nextPage) => {
          setQuery({
            ...state.query,
            page: nextPage,
          })
        }}
        onToggleConfigStatus={onToggleConfigStatus}
      />
    </div>
  )
}
