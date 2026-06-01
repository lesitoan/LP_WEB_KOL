'use client'

import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGetAdminMemberMetricsQuery } from '@/services/api/admin/membersApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import type { AdminMemberItem } from '@/types/admin/members'
import { formatDateTime, formatUsd, fullName } from '../mappers'

type AdminMemberMetricsDialogProps = {
  member: AdminMemberItem
}

function MetricRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1 rounded-md border border-border bg-surface-2/40 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium text-foreground">{value ?? '---'}</p>
    </div>
  )
}

function MetricRowSkeleton() {
  return (
    <div className="space-y-2 rounded-md border border-border bg-surface-2/40 px-3 py-2">
      <div className="h-3 w-28 animate-pulse rounded bg-surface-3" />
      <div className="h-4 w-20 animate-pulse rounded bg-surface-3" />
    </div>
  )
}

function MetricSectionSkeleton({ rows }: { rows: number }) {
  return (
    <section className="space-y-3">
      <div className="h-4 w-32 animate-pulse rounded bg-surface-3" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: rows }).map((_, index) => (
          <MetricRowSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}

export function AdminMemberMetricsDialog({ member }: AdminMemberMetricsDialogProps) {
  const [open, setOpen] = useState(false)
  const metricsQuery = useGetAdminMemberMetricsQuery({ memberId: member.id }, { skip: !open })
  const data = metricsQuery.data
  const metrics = data?.metrics
  const sourceMember = data?.member ?? member
  const latestPayout = metrics?.latestPayout
  const name = fullName(sourceMember.telegramFirstName, sourceMember.telegramLastName, sourceMember.telegramUsername)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <BarChart3 className="h-4 w-4" />
              <span className="sr-only">Xem metrics thành viên</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Metrics</TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-5xl w-[calc(100vw-1rem)] sm:w-full max-h-[92vh] overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 pt-5 pb-4">
          <DialogTitle>Metrics thành viên</DialogTitle>
        </DialogHeader>

        <div className="max-h-[76vh] overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            <div>
              <p className="text-lg font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">@{sourceMember.telegramUsername || '---'}</p>
            </div>

            {metricsQuery.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/[0.08] p-3 text-sm text-destructive">
                {extractApiErrorMessage(metricsQuery.error, 'Không thể tải metrics thành viên')}
              </div>
            ) : null}

            {metricsQuery.isFetching && !metrics ? (
              <>
                <MetricSectionSkeleton rows={8} />
                <MetricSectionSkeleton rows={4} />
                <MetricSectionSkeleton rows={4} />
              </>
            ) : null}

            {metrics ? (
              <>
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Tổng quan chi trả</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetricRow label="Volume USD hiện tại" value={formatUsd(metrics.currentUsdVolume)} />
                    <MetricRow label="Tổng lượt chi trả đã theo dõi" value={metrics.totalTrackedPayouts} />
                    <MetricRow label="Đã thanh toán" value={metrics.paidPayouts} />
                    <MetricRow label="Đang chờ chi trả" value={metrics.pendingPayouts} />
                    <MetricRow label="Chi trả thất bại" value={metrics.failedPayouts} />
                    <MetricRow label="Bỏ qua do chưa đạt tối thiểu" value={metrics.skippedMinAmountPayouts} />
                    <MetricRow label="Sẵn sàng nhận" value={metrics.readyToClaimPayouts} />
                    <MetricRow label="Tỷ lệ cashback trung bình" value={`${metrics.averageCashbackRatePct}%`} />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Tổng tiền</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetricRow label="Tổng volume" value={formatUsd(metrics.totalVolumeUsd)} />
                    <MetricRow label="Tổng phí gross" value={formatUsd(metrics.totalGrossFeeUsd)} />
                    <MetricRow label="Tổng hoa hồng Partner" value={formatUsd(metrics.totalKolCommissionUsd)} />
                    <MetricRow label="Tổng cashback" value={formatUsd(metrics.totalCashbackAmountUsd)} />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Lần chi trả gần nhất</h3>
                  {latestPayout ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MetricRow label="ID chi trả" value={latestPayout.id} />
                      <MetricRow label="Trạng thái" value={latestPayout.payoutStatus} />
                      <MetricRow label="Tỷ lệ cashback" value={`${latestPayout.cashbackRatePct}%`} />
                      <MetricRow label="Volume" value={formatUsd(latestPayout.volumeUsd)} />
                      <MetricRow label="Phí gross" value={formatUsd(latestPayout.grossFeeUsd)} />
                      <MetricRow label="Hoa hồng Partner" value={formatUsd(latestPayout.kolCommissionUsd)} />
                      <MetricRow label="Số tiền cashback" value={formatUsd(latestPayout.cashbackAmountUsd)} />
                      <MetricRow label="Ngày tạo" value={formatDateTime(latestPayout.createdAt)} />
                      <MetricRow label="Ngày thông báo" value={formatDateTime(latestPayout.notifiedAt)} />
                      <MetricRow label="Nhóm" value={latestPayout.telegramGroup?.title} />
                      <MetricRow label="ID nhóm Telegram" value={latestPayout.telegramGroup?.telegramGroupId} />
                      <MetricRow label="ID chu kỳ" value={latestPayout.cashbackCycle?.id} />
                      <MetricRow label="Loại chu kỳ" value={latestPayout.cashbackCycle?.cycleType} />
                      <MetricRow label="Trạng thái chu kỳ" value={latestPayout.cashbackCycle?.status} />
                      <MetricRow label="Bắt đầu kỳ" value={formatDateTime(latestPayout.cashbackCycle?.periodStart)} />
                      <MetricRow label="Kết thúc kỳ" value={formatDateTime(latestPayout.cashbackCycle?.periodEnd)} />
                    </div>
                  ) : (
                    <p className="rounded-md border border-border p-3 text-sm text-muted-foreground">Chưa có lần chi trả gần nhất.</p>
                  )}
                </section>
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
