import { DataTable, type DataTableColumn } from '@/components/ui/dataTable'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminDashboardKolItem } from '@/types/admin/dashboard'
import { toCompactNumber } from '../mappers'

type DashboardKolTableProps = {
  columns: DataTableColumn<AdminDashboardKolItem>[]
  data: AdminDashboardKolItem[]
  isLoading: boolean
  isFetching: boolean
  emptyContent: string
  page: number
  limit: number
  totalItems: number
  limitOptions: number[]
  onPageChange: (nextPage: number) => void
  onLimitChange: (nextLimit: number) => void
}

export default function DashboardKolTable({
  columns,
  data,
  isLoading,
  isFetching,
  emptyContent,
  page,
  limit,
  totalItems,
  limitOptions,
  onPageChange,
  onLimitChange,
}: DashboardKolTableProps) {
  return (
    <Card className="self-start overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">Danh sách KOL theo dashboard</CardTitle>
      </CardHeader>

      <DataTable
        columns={columns}
        data={data}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        emptyContent={emptyContent}
        className="border-none rounded-none"
        pagination={{
          page,
          limit,
          totalItems,
          totalPages: totalItems && limit > 0 ? Math.max(1, Math.ceil(totalItems / limit)) : 1,
          onPageChange,
          onLimitChange,
          limitOptions,
          isDisabled: isFetching,
          summaryText: `Tổng ${toCompactNumber(totalItems)} KOL`,
        }}
      />
    </Card>
  )
}
