'use client'

import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGetGroupAccessSummaryQuery } from '@/services/api/groupsApi'

type GroupSummaryDialogProps = {
  groupId: string
}

const accessSummaryLabels: Record<string, string> = {
  totalKolMembers: 'Tổng số KOL',
  eligibleMembers: 'Thành viên đủ điều kiện',
  belowThresholdMembers: 'Thành viên dưới ngưỡng',
  aboveThresholdMembers: 'Thành viên trên ngưỡng',
  activeTelegramMembers: 'Thành viên Telegram đang hoạt động',
  verifiedLpexMembers: 'Thành viên đã xác minh LPEx',
  membersWithPayoutHistory: 'Thành viên có lịch sử chi trả',
  totalPayoutRecords: 'Tổng số bản ghi chi trả',
  totalVolumeUsd: 'Tổng volume (USD)',
  totalGrossFeeUsd: 'Tổng phí gộp (USD)',
  totalKolCommissionUsd: 'Tổng hoa hồng KOL (USD)',
  totalCashbackAmountUsd: 'Tổng cashback (USD)',
  lastPayoutAt: 'Lần chi trả gần nhất',
}

export function GroupSummaryDialog({ groupId }: GroupSummaryDialogProps) {
  const [open, setOpen] = useState(false)

  const { data, isFetching, isError } = useGetGroupAccessSummaryQuery(
    { groupId },
    { skip: !open },
  )

  const summaryEntries = useMemo(() => {
    if (!data?.accessSummary) {
      return [] as Array<[string, number | string | null]>
    }
    return Object.entries(data.accessSummary).map(([key, value]) => [
      accessSummaryLabels[key] ?? key,
      value,
    ])
  }, [data])

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Xem chi tiết</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Xem chi tiết</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tổng quan nhóm</DialogTitle>
          </DialogHeader>

          {isFetching ? (
            <div className="flex min-h-[180px] items-center justify-center gap-2 text-muted-foreground">
              <Spinner className="h-4 w-4" />
              Đang tải dữ liệu tổng quan...
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Không tải được thông tin tổng quan của nhóm.
            </div>
          ) : data ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Thông tin nhóm</h4>
                <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  <p><span className="text-muted-foreground">Tên nhóm:</span> {data.group.title}</p>
                  <p><span className="text-muted-foreground">Trạng thái:</span> {data.group.status}</p>
                  <p><span className="text-muted-foreground">Volume tối thiểu:</span> {data.group.minVolumeRequired}</p>
                  <p><span className="text-muted-foreground">Volume tối đa:</span> {data.group.maxVolumeRequired}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Tóm tắt truy cập</h4>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  {summaryEntries.map(([label, value]) => (
                    <div key={String(label)} className="rounded-md border border-border px-3 py-2">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value ?? '---'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
