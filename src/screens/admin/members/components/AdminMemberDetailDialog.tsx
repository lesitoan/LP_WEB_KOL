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
  statusClassName,
} from '../mappers'

type AdminMemberDetailDialogProps = {
  member: AdminMemberItem
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1 rounded-md border border-border bg-surface-2/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm text-foreground">{value || '---'}</p>
    </div>
  )
}

export function AdminMemberDetailDialog({ member }: AdminMemberDetailDialogProps) {
  const [open, setOpen] = useState(false)
  const detailQuery = useGetAdminMemberDetailQuery({ memberId: member.id }, { skip: !open })
  const detail = detailQuery.data ?? member
  const name = fullName(detail.telegramFirstName, detail.telegramLastName, detail.telegramUsername)

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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">
                  @{detail.telegramUsername || '---'} · LPEX UID {detail.lpexUid}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${statusClassName(detail.lpexUserStatus)}`}>
                  {formatLpexStatus(detail.lpexUserStatus)}
                </span>
                <span className={`inline-flex items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${statusClassName(detail.telegramStatus)}`}>
                  {formatTelegramStatus(detail.telegramStatus)}
                </span>
              </div>
            </div>

            {detailQuery.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/[0.08] p-3 text-sm text-destructive">
                {extractApiErrorMessage(detailQuery.error, 'Không thể tải chi tiết thành viên')}
              </div>
            ) : null}

            {detailQuery.isFetching ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="h-[72px] animate-pulse rounded-md bg-surface-2" />
                ))}
              </div>
            ) : null}

            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <DetailRow label="Member id" value={detail.id} />
              <DetailRow label="LPEX UID" value={detail.lpexUid} />
              <DetailRow label="LPEX status" value={formatLpexStatus(detail.lpexUserStatus)} />
              <DetailRow label="Registered at LPEX" value={formatDateTime(detail.registeredAtLpex)} />
              <DetailRow label="Telegram user id" value={detail.telegramUserId} />
              <DetailRow label="Telegram username" value={detail.telegramUsername} />
              <DetailRow label="Telegram first name" value={detail.telegramFirstName} />
              <DetailRow label="Telegram last name" value={detail.telegramLastName} />
              <DetailRow label="Telegram status" value={formatTelegramStatus(detail.telegramStatus)} />
              <DetailRow label="Country code" value={detail.countryCode} />
              <DetailRow label="Current volume" value={formatUsd(detail.usdVolume)} />
              <DetailRow label="Referrer KOL id" value={detail.referrerKolId} />
              <DetailRow label="Referrer KOL code" value={detail.referrerKol?.code ?? detail.referrerKolCode} />
              <DetailRow label="Referrer KOL name" value={detail.referrerKol?.displayName} />
              <DetailRow label="Referrer KOL status" value={detail.referrerKol?.status} />
              <DetailRow label="Created at" value={formatDateTime(detail.createdAt)} />
              <DetailRow label="Updated at" value={formatDateTime(detail.updatedAt)} />
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
