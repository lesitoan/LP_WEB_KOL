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
    <div className="space-y-1 rounded-md border border-border bg-surface-2/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm text-foreground">{value ?? '---'}</p>
    </div>
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
              <p className="text-sm text-muted-foreground">
                @{sourceMember.telegramUsername || '---'} · LPEX UID {sourceMember.lpexUid}
              </p>
            </div>

            {metricsQuery.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/[0.08] p-3 text-sm text-destructive">
                {extractApiErrorMessage(metricsQuery.error, 'Không thể tải metrics thành viên')}
              </div>
            ) : null}

            {metricsQuery.isFetching ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="h-[72px] animate-pulse rounded-md bg-surface-2" />
                ))}
              </div>
            ) : null}

            {metrics ? (
              <>
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Tổng quan payout</h3>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MetricRow label="Current USD volume" value={formatUsd(metrics.currentUsdVolume)} />
                    <MetricRow label="Total tracked payouts" value={metrics.totalTrackedPayouts} />
                    <MetricRow label="Paid payouts" value={metrics.paidPayouts} />
                    <MetricRow label="Pending payouts" value={metrics.pendingPayouts} />
                    <MetricRow label="Failed payouts" value={metrics.failedPayouts} />
                    <MetricRow label="Skipped min amount" value={metrics.skippedMinAmountPayouts} />
                    <MetricRow label="Ready to claim" value={metrics.readyToClaimPayouts} />
                    <MetricRow label="Average cashback rate" value={`${metrics.averageCashbackRatePct}%`} />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Tổng tiền</h3>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MetricRow label="Total volume" value={formatUsd(metrics.totalVolumeUsd)} />
                    <MetricRow label="Total gross fee" value={formatUsd(metrics.totalGrossFeeUsd)} />
                    <MetricRow label="Total KOL commission" value={formatUsd(metrics.totalKolCommissionUsd)} />
                    <MetricRow label="Total cashback" value={formatUsd(metrics.totalCashbackAmountUsd)} />
                    <MetricRow label="Last payout at" value={formatDateTime(metrics.lastPayoutAt)} />
                    <MetricRow label="Last notified at" value={formatDateTime(metrics.lastNotifiedAt)} />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Latest payout</h3>
                  {latestPayout ? (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <MetricRow label="Payout id" value={latestPayout.id} />
                      <MetricRow label="Status" value={latestPayout.payoutStatus} />
                      <MetricRow label="Cashback rate" value={`${latestPayout.cashbackRatePct}%`} />
                      <MetricRow label="Volume" value={formatUsd(latestPayout.volumeUsd)} />
                      <MetricRow label="Gross fee" value={formatUsd(latestPayout.grossFeeUsd)} />
                      <MetricRow label="KOL commission" value={formatUsd(latestPayout.kolCommissionUsd)} />
                      <MetricRow label="Cashback amount" value={formatUsd(latestPayout.cashbackAmountUsd)} />
                      <MetricRow label="Created at" value={formatDateTime(latestPayout.createdAt)} />
                      <MetricRow label="Notified at" value={formatDateTime(latestPayout.notifiedAt)} />
                      <MetricRow label="Group" value={latestPayout.telegramGroup?.title} />
                      <MetricRow label="Telegram group id" value={latestPayout.telegramGroup?.telegramGroupId} />
                      <MetricRow label="Cycle id" value={latestPayout.cashbackCycle?.id} />
                      <MetricRow label="Cycle type" value={latestPayout.cashbackCycle?.cycleType} />
                      <MetricRow label="Cycle status" value={latestPayout.cashbackCycle?.status} />
                      <MetricRow label="Period start" value={formatDateTime(latestPayout.cashbackCycle?.periodStart)} />
                      <MetricRow label="Period end" value={formatDateTime(latestPayout.cashbackCycle?.periodEnd)} />
                    </div>
                  ) : (
                    <p className="rounded-md border border-border p-3 text-sm text-muted-foreground">Chưa có payout gần nhất.</p>
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
