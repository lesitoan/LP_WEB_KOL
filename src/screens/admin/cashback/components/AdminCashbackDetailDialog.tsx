'use client'

import { useState, type ReactNode } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  useGetAdminCashbackConfigDetailQuery,
  useGetAdminCashbackCycleDetailQuery,
  useGetAdminCashbackPayoutDetailQuery,
} from '@/services/api/admin/cashbackApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import type { AdminCashbackConfig, AdminCashbackCycle, AdminCashbackPayout } from '@/types/admin/cashback'
import {
  formatConfigStatus,
  formatCycleStatus,
  formatDateTime,
  formatDistributionCycle,
  formatPayoutStatus,
  formatPercent,
  formatUsd,
  memberName,
  statusClassName,
} from '../mappers'

type DetailKind = 'config' | 'cycle' | 'payout'

type AdminCashbackDetailDialogProps =
  | { kind: 'config'; item: AdminCashbackConfig }
  | { kind: 'cycle'; item: AdminCashbackCycle }
  | { kind: 'payout'; item: AdminCashbackPayout }

function StatusBadge({ status, label }: { status?: string | null; label: string }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${statusClassName(status)}`}>
      {label}
    </span>
  )
}

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="space-y-1 rounded-md border border-border bg-surface-2/40 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="break-words text-sm font-medium text-foreground">{value || '---'}</div>
    </div>
  )
}

function DetailRowSkeleton() {
  return (
    <div className="space-y-2 rounded-md border border-border bg-surface-2/40 px-3 py-2">
      <div className="h-3 w-24 animate-pulse rounded bg-surface-3" />
      <div className="h-4 w-32 animate-pulse rounded bg-surface-3" />
    </div>
  )
}

function titleByKind(kind: DetailKind) {
  if (kind === 'config') return 'Chi tiết cấu hình cashback'
  if (kind === 'cycle') return 'Chi tiết chu kỳ cashback'
  return 'Chi tiết khoản chi cashback'
}

function ConfigDetail({ config }: { config: AdminCashbackConfig }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <DetailRow label="KOL" value={config.kol ? `${config.kol.displayName} (${config.kol.code})` : config.kolId} />
      <DetailRow label="Nhóm Telegram" value={config.telegramGroup?.title ?? config.telegramGroupId} />
      <DetailRow label="ID nhóm Telegram" value={config.telegramGroup?.telegramGroupId} />
      <DetailRow label="Tỷ lệ cashback" value={formatPercent(config.cashbackRatePct)} />
      <DetailRow label="Chu kỳ phân phối" value={formatDistributionCycle(config.distributionCycle)} />
      <DetailRow label="Ngưỡng tối thiểu" value={formatUsd(config.minPayoutUsd)} />
      <DetailRow label="Trạng thái" value={<StatusBadge status={config.status} label={formatConfigStatus(config.status)} />} />
      <DetailRow label="Hiệu lực từ" value={formatDateTime(config.effectiveFrom)} />
      <DetailRow label="Hiệu lực đến" value={formatDateTime(config.effectiveTo)} />
      <DetailRow label="Người tạo" value={config.creator ? `${config.creator.fullName || config.creator.email}` : config.createdBy} />
      <DetailRow label="Ngày tạo" value={formatDateTime(config.createdAt)} />
      <DetailRow label="Cập nhật" value={formatDateTime(config.updatedAt)} />
    </section>
  )
}

function CycleDetail({ cycle }: { cycle: AdminCashbackCycle }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <DetailRow label="KOL" value={cycle.kol ? `${cycle.kol.displayName} (${cycle.kol.code})` : cycle.kolId} />
      <DetailRow label="Loại chu kỳ" value={formatDistributionCycle(cycle.cycleType)} />
      <DetailRow label="Trạng thái" value={<StatusBadge status={cycle.status} label={formatCycleStatus(cycle.status)} />} />
      <DetailRow label="Bắt đầu kỳ" value={formatDateTime(cycle.periodStart)} />
      <DetailRow label="Kết thúc kỳ" value={formatDateTime(cycle.periodEnd)} />
      <DetailRow label="Tổng hoa hồng" value={formatUsd(cycle.totalCommissionUsd)} />
      <DetailRow label="Tổng cashback" value={formatUsd(cycle.totalCashbackUsd)} />
      <DetailRow label="Số khoản chi" value={cycle._count?.payouts} />
      <DetailRow label="Ngày tạo" value={formatDateTime(cycle.createdAt)} />
      <DetailRow label="Cập nhật" value={formatDateTime(cycle.updatedAt)} />
    </section>
  )
}

function PayoutDetail({ payout }: { payout: AdminCashbackPayout }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <DetailRow label="KOL" value={payout.kol ? `${payout.kol.displayName} (${payout.kol.code})` : payout.kolId} />
      <DetailRow label="Thành viên" value={memberName(payout.member)} />
      <DetailRow label="LPEX UID" value={payout.member?.lpexUid} />
      <DetailRow label="Nhóm Telegram" value={payout.telegramGroup?.title ?? payout.telegramGroupId} />
      <DetailRow label="Trạng thái chi trả" value={<StatusBadge status={payout.payoutStatus} label={formatPayoutStatus(payout.payoutStatus)} />} />
      <DetailRow label="Khối lượng" value={formatUsd(payout.volumeUsd)} />
      <DetailRow label="Phí gộp" value={formatUsd(payout.grossFeeUsd)} />
      <DetailRow label="Hoa hồng KOL" value={formatUsd(payout.kolCommissionUsd)} />
      <DetailRow label="Cashback" value={formatUsd(payout.cashbackAmountUsd)} />
      <DetailRow label="Tỷ lệ cashback" value={formatPercent(payout.cashbackRatePct ?? payout.appliedConfig?.cashbackRatePct)} />
      <DetailRow label="Chu kỳ" value={payout.cashbackCycle ? `${formatDistributionCycle(payout.cashbackCycle.cycleType)} - ${formatCycleStatus(payout.cashbackCycle.status)}` : payout.cashbackCycleId} />
      <DetailRow label="Cấu hình áp dụng" value={payout.appliedConfig?.id ?? payout.appliedConfigId} />
      <DetailRow label="Đã thông báo" value={formatDateTime(payout.notifiedAt)} />
      <DetailRow label="Đã trả" value={formatDateTime(payout.paidAt)} />
      <DetailRow label="Ngày tạo" value={formatDateTime(payout.createdAt)} />
      <DetailRow label="Cập nhật" value={formatDateTime(payout.updatedAt)} />
    </section>
  )
}

export function AdminCashbackDetailDialog(props: AdminCashbackDetailDialogProps) {
  const [open, setOpen] = useState(false)
  const configQuery = useGetAdminCashbackConfigDetailQuery(
    { configId: props.item.id },
    { skip: !open || props.kind !== 'config' },
  )
  const cycleQuery = useGetAdminCashbackCycleDetailQuery(
    { cycleId: props.item.id },
    { skip: !open || props.kind !== 'cycle' },
  )
  const payoutQuery = useGetAdminCashbackPayoutDetailQuery(
    { payoutId: props.item.id },
    { skip: !open || props.kind !== 'payout' },
  )

  const activeQuery = props.kind === 'config' ? configQuery : props.kind === 'cycle' ? cycleQuery : payoutQuery
  const error = activeQuery.error
  const showSkeleton = activeQuery.isFetching && !activeQuery.data
  const detail = activeQuery.data ?? props.item

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Chi tiết</TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-5xl w-[calc(100vw-1rem)] sm:w-full max-h-[92vh] overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 pt-5 pb-4">
          <DialogTitle>{titleByKind(props.kind)}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[76vh] overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/[0.08] p-3 text-sm text-destructive">
                {extractApiErrorMessage(error, 'Không thể tải chi tiết cashback')}
              </div>
            ) : null}

            {showSkeleton ? (
              <section className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 10 }).map((_, index) => <DetailRowSkeleton key={index} />)}
              </section>
            ) : props.kind === 'config' ? (
              <ConfigDetail config={detail as AdminCashbackConfig} />
            ) : props.kind === 'cycle' ? (
              <CycleDetail cycle={detail as AdminCashbackCycle} />
            ) : (
              <PayoutDetail payout={detail as AdminCashbackPayout} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
