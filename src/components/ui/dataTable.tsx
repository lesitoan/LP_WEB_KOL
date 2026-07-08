"use client"

import type { ReactNode } from "react";
import { DataTableSkeleton } from "@/components/skeletons/DataTableSkeleton";
import { cn } from "@/lib/utils";

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
  hideSummary?: boolean
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

export function DataTablePaginationBar({ pagination, className }: { pagination: DataTablePagination; className?: string }) {
  const justifyClass = pagination.hideSummary ? "justify-center" : "justify-between"
  const alignClass = pagination.hideSummary ? "" : "md:justify-end"

  return (
    <div className={cn(`px-6 py-4 text-[12.5px] text-muted-foreground md:flex md:items-center ${justifyClass}`, className)}>
      {!pagination.hideSummary && (
        <span className="block text-center md:text-left">{pagination.summaryText ?? `Tổng ${pagination.totalItems} dòng`}</span>
      )}

      <div className={`${pagination.hideSummary ? "mt-0" : "mt-2"} flex items-center justify-center gap-3 md:mt-0 ${alignClass}`}>
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

        {/* {pagination.onLimitChange ? (
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
        ) : null} */}
      </div>
    </div>
  )
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
  const gridTemplateColumns = `repeat(${columns.length}, max-content)`

  return (
     <div className={className ?? "bg-surface-card border border-border rounded-card overflow-hidden"}>
      <div className={`${TABLE_SCROLL_VIEWPORT_CLASS} border-t border-border-strong bg-surface-card`}>
        <table
          className="grid w-full min-w-[980px] border-collapse justify-between bg-surface-card"
          style={{ gridTemplateColumns }}
        >
          <thead className="contents">
            <tr className="contents">
              <th
                aria-hidden="true"
                colSpan={columns.length}
                className="sticky top-0 z-10 bg-surface-card p-0"
                style={{ gridColumn: '1 / -1', gridRow: 1 }}
              />
              {columns.map((column, columnIndex) => (
                <th
                  key={column.id}
                  className={`sticky top-0 z-20 bg-surface-card px-3 py-3 text-left text-xs font-semibold text-muted-foreground normal-case tracking-normal whitespace-nowrap ${
                    columnIndex === 0 ? 'pl-3' : ''
                  } ${
                    columnIndex === columns.length - 1 ? 'justify-self-end pr-4 text-right' : ''
                  } ${
                    column.headerClassName ?? ""
                  }`}
                  style={{ gridColumn: columnIndex + 1, gridRow: 1 }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="contents">
            {isLoading ? (
              <tr className="contents">
                <td colSpan={columns.length} className="p-6" style={{ gridColumn: '1 / -1', gridRow: 2 }}>
                  <DataTableSkeleton columnsCount={columns.length} loadingContent={loadingContent} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr className="contents">
                <td
                  colSpan={columns.length}
                  className="px-6 py-24 text-center text-sm text-muted-foreground"
                  style={{ gridColumn: '1 / -1', gridRow: 2 }}
                >
                  {emptyContent ?? "Không có dữ liệu"}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowKey(row, rowIndex)} className="group contents">
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.id}
                      className={`px-3 py-4 text-[13px] whitespace-nowrap ${
                        columnIndex === 0 ? 'pl-3' : ''
                      } ${
                        columnIndex === columns.length - 1 ? 'justify-self-end pr-4 text-right' : ''
                      } ${column.cellClassName ?? ""}`}
                      style={{ gridColumn: columnIndex + 1, gridRow: rowIndex + 2 }}
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

      {pagination ? <DataTablePaginationBar pagination={pagination} /> : null}
    </div>
  )
}
