'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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

function initials(member: MemberItem) {
  const source = fullName(member)
  const parts = source.split(' ').filter(Boolean)
  if (parts.length === 0) return 'NA'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatDate(dateIso: string) {
  const date = new Date(dateIso)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleDateString('vi-VN')
}

function formatUsdVolume(value: string) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return value
  // return parsed.toLocaleString('vi-VN', { style: 'currency', currency: 'USD' })
  return parsed;
}

function getTelegramStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-success/[0.12] text-success border border-success/20'
    case 'left':
      return 'bg-muted text-muted-foreground border border-border'
    case 'kicked':
    case 'banned':
      return 'bg-destructive/[0.12] text-destructive border border-destructive/20'
    case 'unknown':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return 'bg-info/[0.12] text-info border border-info/20'
  }
}

function getLpexStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'verified':
      return 'bg-success/[0.12] text-success border border-success/20'
    case 'pending':
      return 'bg-warning/[0.12] text-warning border border-warning/20'
    case 'blocked':
      return 'bg-destructive/[0.12] text-destructive border border-destructive/20'
    default:
      return 'bg-info/[0.12] text-info border border-info/20'
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
    query,
    setPage,
    setLimit,
    setSearchName,
    setCountryFilter,
    setTelegramStatusFilter,
    setLpexStatusFilter,
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
        key: 'countryCode',
        label: 'Quốc gia',
        options: [
          { value: 'VN', label: 'VN' },
          { value: 'SG', label: 'SG' },
        ],
      },
      {
        key: 'telegramStatus',
        label: 'Telegram status',
        options: [
          { value: 'active', label: 'active' },
          { value: 'left', label: 'left' },
          { value: 'kicked', label: 'kicked' },
          { value: 'banned', label: 'banned' },
        ],
      },
      {
        key: 'lpexUserStatus',
        label: 'LPEX status',
        options: [
          { value: 'verified', label: 'verified' },
          { value: 'pending', label: 'pending' },
          { value: 'blocked', label: 'blocked' },
        ],
      },
    ],
    [],
  )


  const activeFilterChips: ActiveFilterChip[] = useMemo(() => {
    const chips: ActiveFilterChip[] = []

    for (const filter of selectFilters) {
      const rawValue =
        filter.key === 'countryCode'
          ? countryFilter
          : filter.key === 'telegramStatus'
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

  const statusBadges = useMemo(() => {
    const counter = new Map<string, number>()

    for (const member of members) {
      const lpex = (member.lpexUserStatus || 'unknown').trim().toLowerCase()
      if (lpex && lpex !== 'verified') {
        counter.set(lpex, (counter.get(lpex) ?? 0) + 1)
      }

      const telegram = (member.telegramStatus || 'unknown').trim().toLowerCase()
      if (telegram && telegram !== 'active') {
        counter.set(telegram, (counter.get(telegram) ?? 0) + 1)
      }
    }

    return Array.from(counter.entries())
      .map(([status, count]) => ({
        key: status,
        label: status,
        count,
        tone:
          status === 'blocked' || status === 'banned' || status === 'kicked'
            ? ('danger' as const)
            : status === 'pending'
              ? ('warning' as const)
              : ('neutral' as const),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [members])

  const columns: DataTableColumn<MemberItem>[] = [
    {
      id: 'member',
      header: 'Member',
      cell: (member) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8B84D] to-[#A86B3F] grid place-items-center text-xs font-semibold text-foreground shrink-0">
            {initials(member)}
          </div>
          <div>
            <div className="text-[13.5px] font-medium">{fullName(member)}</div>
            <div className="text-[11px] text-muted-foreground font-geist-mono">
              @{member.telegramUsername || 'unknown'} · TG ID {member.telegramUserId}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'lpexUid',
      header: 'LPEX UID',
      cell: (member) => <span className="font-geist-mono">{member.lpexUid || '—'}</span>,
    },
    {
      id: 'lpexStatus',
      header: 'LPEX status',
      cell: (member) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium ${getLpexStatusClass(member.lpexUserStatus)}`}>
          {member.lpexUserStatus}
        </span>
      ),
    },
    {
      id: 'telegramStatus',
      header: 'Telegram',
      cell: (member) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium ${getTelegramStatusClass(member.telegramStatus)}`}>
          {member.telegramStatus}
        </span>
      ),
    },
    {
      id: 'country',
      header: 'Quốc gia',
      cell: (member) => countries.getName(member.countryCode || 'US', "en") || '—',
    },
    {
      id: 'registeredAt',
      header: 'Ngày đăng ký',
      cell: (member) => formatDate(member.registeredAtLpex || member.createdAt),
    },
    {
      id: 'volume',
      header: 'Volume (USD)',
      cellClassName: 'font-geist-mono font-medium',
      cell: (member) => formatUsdVolume(member.usdVolume),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" onClick={() => router.push('/groups')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại nhóm
        </Button>
        <h2 className="text-base font-medium text-right">Thành viên nhóm ({pagination.totalItems})</h2>
      </div>

      <div className="bg-surface-1 border border-border rounded-[14px] overflow-visible relative">
        <TableFilterBar
          textFilters={[
            {
              key: 'search',
              placeholder: 'Tìm theo UID, username, tên member...',
              widthClassName: 'flex-1 min-w-[260px] max-w-[520px]',
            },
          ]}
          textValues={{ search: searchName }}
          selectFilters={selectFilters}
          activeFilterChips={activeFilterChips}
          statusBadges={statusBadges}
          disabled={isFetching}
          onTextChange={(_, value) => setSearchName(value)}
          onSelectFilter={(key, value) => {
            if (key === 'countryCode') {
              setCountryFilter(value)
              return
            }

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
            columns={columns}
            data={members}
            rowKey={(member) => member.id}
            isLoading={isLoading}
            loadingContent="Đang tải danh sách members..."
            emptyContent="Không có member trong nhóm này"
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
                  ? `Hiển thị ${startIndex}-${endIndex} / ${pagination.totalItems} members`
                  : 'Chưa có dữ liệu member',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default GroupMembersScreen
