"use client"

import type { ReactNode } from "react";
import { DataTableSkeleton } from "@/components/skeletons/DataTableSkeleton";

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

export type DataTablePagination = {
  page: number
  totalPages: number
  totalItems: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  limitOptions?: number[]
  isDisabled?: boolean
  summaryText?: string
}

const TABLE_SCROLL_VIEWPORT_CLASS =
  "data-table-scroll-viewport max-h-[max(260px,calc(100dvh-325px))] overflow-auto pb-1"

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (row: T, index: number) => string
  isLoading?: boolean
  loadingContent?: ReactNode
  emptyContent?: ReactNode
  className?: string
  pagination?: DataTablePagination
}

function pageList(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', total] as const
  }

  if (current >= total - 3) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total] as const
  }

  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total] as const
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  loadingContent,
  emptyContent,
  className,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className={className ?? "bg-surface-1 border border-border rounded-[14px] overflow-hidden"}>
      <div className={TABLE_SCROLL_VIEWPORT_CLASS}>
        <table className="w-full border-collapse min-w-[980px]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`sticky top-0 z-10 text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border whitespace-nowrap ${
                    column.headerClassName ?? ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 border-b border-border">
                  <DataTableSkeleton columnsCount={columns.length} loadingContent={loadingContent} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-24 text-center text-sm text-muted-foreground border-b border-border">
                  {emptyContent ?? "Không có dữ liệu"}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowKey(row, rowIndex)} className="hover:bg-surface-2 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`p-4 px-5 border-b border-border text-[13px] whitespace-nowrap ${column.cellClassName ?? ""}`}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <div className="px-5 py-3 border-t border-border text-[12.5px] text-muted-foreground md:flex md:items-center md:justify-between">
          <span className="block text-center md:text-left">{pagination.summaryText ?? `Tổng ${pagination.totalItems} dòng`}</span>

          <div className="mt-2 flex items-center justify-center gap-3 md:mt-0 md:justify-end">
            <div className="flex gap-1">
              <button
                className="w-7 h-7 grid place-items-center rounded-md text-xs hover:bg-surface-3 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.isDisabled || pagination.page <= 1}
                type="button"
              aria-label="Trang trước"
              >
                {'<'}
              </button>

              {pageList(pagination.page, Math.max(1, pagination.totalPages)).map((value, idx) =>
                value === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="w-7 h-7 grid place-items-center text-xs">
                    ...
                  </span>
                ) : (
                  <button
                    key={value}
                    className={`w-7 h-7 grid place-items-center rounded-md text-xs hover:bg-surface-3 hover:text-foreground ${
                      value === pagination.page ? 'bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground' : ''
                    }`}
                    onClick={() => pagination.onPageChange(value)}
                    disabled={pagination.isDisabled}
                    type="button"
                  >
                    {value}
                  </button>
                ),
              )}

              <button
                className="w-7 h-7 grid place-items-center rounded-md text-xs hover:bg-surface-3 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.isDisabled || pagination.page >= pagination.totalPages}
                type="button"
                aria-label="Trang sau"
              >
                {'>'}
              </button>
            </div>

            {pagination.onLimitChange ? (
              <label className="inline-flex items-center gap-2 whitespace-nowrap">
                <span>Dòng/trang</span>
                <select
                  className="h-7 rounded-md bg-surface-2 border border-border px-2 text-xs text-foreground"
                  value={pagination.limit}
                  onChange={(event) => pagination.onLimitChange?.(Number(event.target.value))}
                  disabled={pagination.isDisabled}
                >
                  {(pagination.limitOptions ?? [10, 20, 50]).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
