'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGetAdminTiersQuery } from '@/services/api/admin/tiersApi'
import { useGetAdminKolDetailQuery } from '@/services/api/admin/kolsApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { adminKolStatusLabel, kolStatusClassName, toDateTimeVi } from '../mappers'

type AdminKolDetailDialogProps = {
  kolId: string
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1 rounded-md border border-border bg-surface-2/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm text-foreground">{value || '---'}</p>
    </div>
  )
}

export function AdminKolDetailDialog({ kolId }: AdminKolDetailDialogProps) {
  const [open, setOpen] = useState(false)
  const { data, isFetching, error, refetch } = useGetAdminKolDetailQuery({ kolId }, { skip: !open })
  const { data: tiers = [] } = useGetAdminTiersQuery(undefined, { skip: !open })
  const currentTier = data?.currentTierId
    ? tiers.find((tier) => tier.id === data.currentTierId)
    : undefined
  const currentTierLabel = currentTier
    ? currentTier.name : data?.currentTierId

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
        <TooltipContent>Xem chi tiết</TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-3xl w-[calc(100vw-1rem)] sm:w-full max-h-[92vh] overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 pt-5 pb-4">
          <DialogTitle>Chi tiết Partner</DialogTitle>
        </DialogHeader>

        <div className="max-h-[76vh] overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isFetching ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-[74px] animate-pulse rounded-md bg-surface-2" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/[0.08] p-4 text-sm text-destructive">
              <p>{extractApiErrorMessage(error, 'Không thể tải chi tiết Partner')}</p>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          ) : data ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{data.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.code} · @{data.telegramUsername}
                  </p>
                </div>
                <span className={`inline-flex w-fit items-center rounded-full border px-2 py-[3px] text-[11.5px] font-medium ${kolStatusClassName(data.status)}`}>
                  {adminKolStatusLabel[data.status]}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <DetailRow label="Đường dẫn slug" value={data.slug} />
                <DetailRow label="Mã giới thiệu SCEX" value={data.lpexRefCode} />
                <DetailRow label="Liên hệ Zalo" value={data.zaloContact} />
                <DetailRow label="Ngôn ngữ" value={data.defaultLanguage} />
                <DetailRow label="Bậc hiện tại" value={currentTierLabel} />
                <DetailRow label="Hoa hồng" value={`${data.currentCommissionRate}%`} />
                <DetailRow label="Ngày onboard" value={toDateTimeVi(data.onboardedAt)} />
                <DetailRow label="Ngày duyệt" value={toDateTimeVi(data.approvedAt)} />
                <DetailRow label="Ngày tạo" value={toDateTimeVi(data.createdAt)} />
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
