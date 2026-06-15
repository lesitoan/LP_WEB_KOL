'use client'

import { useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown } from 'lucide-react'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import TableFilterBar, {
  type ActiveFilterChip,
  type SelectFilterConfig,
} from '@/components/filters/TableFilterBar'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { useGetGroupMembersQuery } from '@/services/api/groupsApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { toast } from '@/hooks/useToast'
import type { MemberItem, MembersPagination } from '@/types/api'
import { useGroupMembersFilters } from '../hooks/useGroupMembersFilters'

const INITIAL_PAGINATION: MembersPagination = {
  page: 1,
  limit: 20,
  totalItems: 0,
  totalPages: 1,
}

type GroupMembersScreenProps = {
  groupId: string
}

countries.registerLocale(enLocale)

function fullName(member: MemberItem) {
  return `${member.telegramFirstName || ''} ${member.telegramLastName || ''}`.trim() || member.telegramUsername
}

function formatDate(dateIso: string) {
  const date = new Date(dateIso)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN')
}

function formatUsdVolume(value: string) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return value
  return parsed.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function normalizeStatus(value: string | null | undefined) {
  return (value || 'UNKNOWN').trim().toUpperCase()
}

function formatLpexStatusLabel(status: string | null | undefined) {
  switch (normalizeStatus(status).toLowerCase()) {
    case 'active':
      return 'Hoạt động'
    case 'inactive':
      return 'Không hoạt động'
    default:
      return 'Không xác định'
  }
}

function formatTelegramStatusLabel(status: string | null | undefined) {
  switch (normalizeStatus(status).toLowerCase()) {
    case 'active':
      return 'Đang tham gia'
    case 'inactive':
      return 'Đã rời nhóm'
    default:
      return 'Không xác định'
  }
}

function formatEligibilityStatusLabel(status: string | null | undefined) {
  switch (normalizeStatus(status)) {
    case 'ELIGIBLE':
      return 'Đủ điều kiện'
    case 'WARNING':
      return 'Cảnh báo'
    case 'FINAL_WARNING':
      return 'Cảnh báo cuối'
    case 'KICKED':
      return 'Đã kick'
    case 'BLOCKED_REJOIN':
      return 'Chặn vào lại'
    case 'PENDING_VERIFICATION':
      return 'Chờ xác minh'
    case 'MANUAL_HOLD':
      return 'Tạm giữ thủ công'
    case 'UNKNOWN':
      return 'Không xác định'
    default:
      return status || 'Không xác định'
  }
}

function getTelegramStatusClass(status: string | null | undefined) {
  switch (normalizeStatus(status).toLowerCase()) {
    case 'active':
      return 'bg-success/[0.12] text-success border border-success/20'
    case 'inactive':
      return 'bg-muted text-muted-foreground border border-border'
    default:
      return 'bg-warning/[0.12] text-warning border border-warning/20'
  }
}

function getLpexStatusClass(status: string | null | undefined) {
  switch (normalizeStatus(status).toLowerCase()) {
    case 'active':
      return 'bg-success/[0.12] text-success border border-success/20'
    case 'inactive':
      return 'bg-muted/[0.12] text-muted-foreground border border-muted/20'
    default:
      return 'bg-warning/[0.12] text-warning border border-warning/20'
  }
}

export function GroupMembersScreen({ groupId }: GroupMembersScreenProps) {
  const router = useRouter()
  const safeGroupId = groupId?.trim()
  const {
    page,
    limit,
    searchName,
    countryFilter,
    telegramStatusFilter,
    lpexStatusFilter,
    sortBy,
    sortOrder,
    query,
    setPage,
    setLimit,
    setSearchName,
    setCountryFilter,
    setTelegramStatusFilter,
    setLpexStatusFilter,
    setSort,
  } = useGroupMembersFilters()

  const { data, isLoading, isFetching, error } = useGetGroupMembersQuery(
    {
      groupId: safeGroupId,
      query,
    },
    { skip: !safeGroupId },
  )

  const members = data?.items ?? []
  const pagination = data?.pagination ?? INITIAL_PAGINATION

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được thành viên nhóm',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra'),
      })
    }
  }, [error])

  const startIndex = pagination.totalItems === 0 ? 0 : (page - 1) * limit + 1
  const endIndex = Math.min(page * limit, pagination.totalItems)

  const selectFilters: SelectFilterConfig[] = useMemo(
    () => [
      {
        key: 'telegramStatus',
        label: 'Trạng thái telegram',
        options: [
          { value: 'active', label: 'Đang tham gia' },
          { value: 'inactive', label: 'Đã rời nhóm' },
        ],
      },
      {
        key: 'lpexUserStatus',
        label: 'Trạng thái SCEX',
        options: [
          { value: 'active', label: 'Hoạt động' },
          { value: 'inactive', label: 'Không hoạt động' },
          // { value: 'pending', label: 'Đang chờ' },
          // { value: 'blocked', label: 'Đã chặn' },
          // { value: 'disabled', label: 'Vô hiệu hoá' },
          // { value: 'banned', label: 'Đã cấm' },
        ],
      },
    ],
    [],
  )

  const activeFilterChips: ActiveFilterChip[] = useMemo(() => {
    const chips: ActiveFilterChip[] = []

    if (countryFilter && countryFilter !== 'all') {
      chips.push({
        key: 'countryCode',
        label: 'Quốc gia',
        valueLabel: countryFilter.toUpperCase(),
      })
    }

    for (const filter of selectFilters) {
      const rawValue =
        filter.key === 'telegramStatus'
            ? telegramStatusFilter
            : lpexStatusFilter

      if (!rawValue || rawValue === 'all') continue

      const selectedOption = filter.options.find((option) => option.value === rawValue)
      if (!selectedOption) continue

      chips.push({
        key: filter.key,
        label: filter.label,
        valueLabel: selectedOption.label,
      })
    }

    return chips
  }, [countryFilter, lpexStatusFilter, selectFilters, telegramStatusFilter])

  const renderSortableHeader = (
    title: string,
    field: 'telegramUsername' | 'usdVolume' | 'createdAt',
  ) => {
    const isActive = sortBy === field

    return (
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => setSort(field, isActive && sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        <span>{title}</span>
        {isActive ? (
          sortOrder === 'asc' ? (
            <ArrowUp className="w-3 h-3 shrink-0" aria-hidden="true" />
          ) : (
            <ArrowDown className="w-3 h-3 shrink-0" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 shrink-0 opacity-70" aria-hidden="true" />
        )}
      </button>
    )
  }

  const columns: DataTableColumn<MemberItem>[] = [
    {
      id: 'member',
      header: renderSortableHeader('Thành viên', 'telegramUsername'),
      cell: (member) => (
        <div className="flex items-center gap-3">
          <Image
            src="/images/avatar_default.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div>
            <div className="text-base font-medium">{fullName(member)}</div>
            <div className="text-sm text-muted-foreground font-geist-mono">
              @{member.telegramUsername || ''} · TG ID {member.telegramUserId}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'lpexUid',
      header: 'UID',
      cell: (member) => <span className="font-geist-mono">{member.lpexUid || '—'}</span>,
    },
    {
      id: 'lpexStatus',
      header: 'Trạng thái SCEX',
      cell: (member) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-xs font-normal ${getLpexStatusClass(member.lpexUserStatus)}`}>
          {formatLpexStatusLabel(member.lpexUserStatus)}
        </span>
      ),
    },
    {
      id: 'telegramStatus',
      header: 'Trạng thái telegram',
      cell: (member) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-xs font-normal ${getTelegramStatusClass(member.telegramStatus)}`}>
          {formatTelegramStatusLabel(member.telegramStatus)}
        </span>
      ),
    },
    {
      id: 'eligibilityStatus',
      header: 'Trạng thái thành viên',
      cell: (member) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-xs font-normal bg-info/[0.12] text-info border border-info/20">
          {formatEligibilityStatusLabel(member.eligibilityStatus)}
        </span>
      ),
    },
    // {
    //   id: 'country',
    //   header: 'Quốc gia',
    //   cell: (member) => {
    //     const code = (member.countryCode || '').trim().toUpperCase()
    //     if (!code) return '—'

    //     const countryName = countries.getName(code, 'en') || code
    //     return (
    //       <span className="inline-flex items-center gap-1.5">
    //         <span>{countryName} ({code})</span>
    //         <ReactCountryFlag
    //           countryCode={code}
    //           svg
    //           style={{ width: '1em', height: '1em' }}
    //           aria-label={countryName}
    //         />
    //       </span>
    //     )
    //   },
    // },
    {
      id: 'registeredAt',
      header: renderSortableHeader('Ngày đăng ký', 'createdAt'),
      cell: (member) => formatDate(member.registeredAtLpex || member.createdAt),
    },
    {
      id: 'volume',
      header: renderSortableHeader('Volume (USD)', 'usdVolume'),
      cellClassName: 'font-geist-mono font-medium',
      cell: (member) => formatUsdVolume(member.usdVolume),
    },
  ]
  const tableColumns = columns.map((column) => ({
    ...column,
    headerClassName: `!text-xs ${column.headerClassName ?? ''}`,
    cellClassName: `!text-base ${column.cellClassName ?? ''}`,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" onClick={() => router.push('/groups')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại nhóm
        </Button>
        <h2 className="text-base font-medium text-right">Thành viên nhóm ({pagination.totalItems})</h2>
      </div>

      <div className="bg-[#171717] border border-border rounded-[14px] overflow-visible relative">
        <TableFilterBar
          textFilters={[
            {
              key: 'search',
              placeholder: 'Tìm theo UID, username, tên thành viên...',
              widthClassName: 'flex-1 min-w-[260px] max-w-[520px]',
            },
            // {
            //   key: 'countryCode',
            //   placeholder: 'Quốc gia (VD: VN, SG, US...)',
            //   widthClassName: 'w-full sm:w-[220px]',
            // },
          ]}
          textValues={{
            search: searchName,
            countryCode: countryFilter === 'all' ? '' : countryFilter,
          }}
          selectFilters={selectFilters}
          activeFilterChips={activeFilterChips}
          disabled={isFetching}
          onTextChange={(key, value) => {
            if (key === 'countryCode') {
              setCountryFilter(value.trim().toUpperCase() || 'all')
              return
            }
            setSearchName(value)
          }}
          onSelectFilter={(key, value) => {
            if (key === 'telegramStatus') {
              setTelegramStatusFilter(value)
              return
            }

            setLpexStatusFilter(value)
          }}
          onRemoveChip={(key) => {
            if (key === 'countryCode') {
              setCountryFilter('all')
              return
            }

            if (key === 'telegramStatus') {
              setTelegramStatusFilter('all')
              return
            }

            setLpexStatusFilter('all')
          }}
        />

        <div className="rounded-b-[14px] overflow-hidden">
          <DataTable
            columns={tableColumns}
            data={members}
            rowKey={(member) => member.id}
            isLoading={isLoading}
            loadingContent="Đang tải danh sách thành viên..."
            emptyContent="Không có thành viên trong nhóm này"
            className="border-none rounded-none"
            pagination={{
              page,
              totalPages: Math.max(1, pagination.totalPages),
              totalItems: pagination.totalItems,
              limit,
              onPageChange: (nextPage) => setPage(nextPage),
              onLimitChange: (nextLimit) => setLimit(nextLimit),
              limitOptions: [10, 20, 50, 100],
              isDisabled: isFetching,
              summaryText:
                pagination.totalItems > 0
                  ? `Hiển thị ${startIndex}-${endIndex} / ${pagination.totalItems} thành viên`
                  : 'Chưa có dữ liệu thành viên',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default GroupMembersScreen
