'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGetAdminMemberDetailQuery } from '@/services/api/admin/membersApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import type { AdminMemberItem } from '@/types/admin/members'
import {
  formatDateTime,
  formatLpexStatus,
  formatTelegramStatus,
  formatUsd,
  fullName,
} from '../mappers'

type AdminMemberDetailDialogProps = {
  member: AdminMemberItem
}

function StatusBadge({ status, label }: { status?: string | null; label: string }) {
  const normalized = (status || '').trim().toLowerCase()
  const isInactive = normalized === 'inactive'
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${
        isInactive ? 'border-border bg-muted/60 text-muted-foreground' : 'border-success/20 bg-success/[0.12] text-success'
      }`}
    >
      {label}
    </span>
  )
}

function formatKolStatus(status?: string | null) {
  const normalized = (status || '').trim().toLowerCase()
  if (normalized === 'active') return 'Hoạt động'
  if (normalized === 'inactive') return 'Không hoạt động'
  return status || 'Không xác định'
}

function DetailRow({ label, value }: { label: string; value?: string | number | null | React.ReactNode }) {
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

export function AdminMemberDetailDialog({ member }: AdminMemberDetailDialogProps) {
  const [open, setOpen] = useState(false)
  const detailQuery = useGetAdminMemberDetailQuery({ memberId: member.id }, { skip: !open })
  const detail = detailQuery.data ?? member
  const name = fullName(detail.telegramFirstName, detail.telegramLastName, detail.telegramUsername)
  const showSkeleton = detailQuery.isFetching && !detailQuery.data

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết thành viên</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Chi tiết thành viên</TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-5xl w-[calc(100vw-1rem)] sm:w-full max-h-[92vh] overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 pt-5 pb-4">
          <DialogTitle>Chi tiết thành viên</DialogTitle>
        </DialogHeader>

        <div className="max-h-[76vh] overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            <div>
              <div>
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">@{detail.telegramUsername || '---'}</p>
              </div>
            </div>

            {detailQuery.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/[0.08] p-3 text-sm text-destructive">
                {extractApiErrorMessage(detailQuery.error, 'Không thể tải chi tiết thành viên')}
              </div>
            ) : null}

            <section className="grid gap-3 sm:grid-cols-2">
              {showSkeleton ? (
                Array.from({ length: 11 }).map((_, index) => <DetailRowSkeleton key={index} />)
              ) : (
                <>
                  <DetailRow
                    label="Trạng thái LPEX"
                    value={<StatusBadge status={detail.lpexUserStatus} label={formatLpexStatus(detail.lpexUserStatus)} />}
                  />
                  <DetailRow label="Ngày đăng ký LPEX" value={formatDateTime(detail.registeredAtLpex)} />
                  <DetailRow label="Tên Telegram" value={detail.telegramUsername} />
                  <DetailRow label="Tên" value={detail.telegramFirstName} />
                  <DetailRow label="Họ" value={detail.telegramLastName} />
                  <DetailRow
                    label="Trạng thái Telegram"
                    value={<StatusBadge status={detail.telegramStatus} label={formatTelegramStatus(detail.telegramStatus)} />}
                  />
                  <DetailRow label="Tổng volume" value={formatUsd(detail.usdVolume)} />
                  <DetailRow label="Mã KOL giới thiệu" value={detail.referrerKol?.code ?? detail.referrerKolCode} />
                  <DetailRow label="Tên KOL giới thiệu" value={detail.referrerKol?.displayName} />
                  <DetailRow
                    label="Trạng thái KOL giới thiệu"
                    value={<StatusBadge status={detail.referrerKol?.status} label={formatKolStatus(detail.referrerKol?.status)} />}
                  />
                  <DetailRow label="Ngày tạo" value={formatDateTime(detail.createdAt)} />
                </>
              )}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
