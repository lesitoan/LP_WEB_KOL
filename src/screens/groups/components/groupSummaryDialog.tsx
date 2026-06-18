'use client'

import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatVnd } from '@/lib/formatMoney'
import { useGetGroupAccessSummaryQuery } from '@/services/api/groupsApi'

type GroupSummaryDialogProps = {
  groupId: string
}

const accessSummaryLabels: Record<string, string> = {
  totalKolMembers: 'Tổng số Partner',
  eligibleMembers: 'Thành viên đủ điều kiện',
  belowThresholdMembers: 'Thành viên dưới ngưỡng',
  aboveThresholdMembers: 'Thành viên trên ngưỡng',
  activeTelegramMembers: 'Thành viên Telegram đang hoạt động',
  verifiedLpexMembers: 'Thành viên đã xác minh SCEX',
  membersWithPayoutHistory: 'Thành viên có lịch sử chi trả',
  totalPayoutRecords: 'Tổng số bản ghi chi trả',
  totalVolumeUsd: 'Tổng volume (USD)',
  totalGrossFeeUsd: 'Tổng phí gộp (USD)',
  totalKolCommissionUsd: 'Tổng hoa hồng Partner (USD)',
  totalCashbackAmountUsd: 'Tổng cashback (USD)',
  lastPayoutAt: 'Lần chi trả gần nhất',
  totalRecords: 'Tổng số',
  eligibleCount: 'Đủ điều kiện',
  warningCount: 'Cảnh báo',
  finalWarningCount: 'Cảnh báo cuối',
  kickedCount: 'Đã kick',
  blockedRejoinCount: 'Chặn vào lại',
  pendingVerificationCount: 'Chờ xác minh',
  manualHoldCount: 'Tạm giữ thủ công',
}

function formatGroupStatus(status: string) {
  const normalized = (status || '').trim().toUpperCase()
  if (normalized === 'ACTIVE') return 'Đang hoạt động'
  if (normalized === 'INACTIVE') return 'Không hoạt động'
  return status || '---'
}

function groupStatusClass(status: string) {
  const normalized = (status || '').trim().toUpperCase()
  if (normalized === 'ACTIVE') {
    return 'bg-success/[0.12] text-success border border-success/20'
  }
  if (normalized === 'INACTIVE') {
    return 'bg-muted text-muted-foreground border border-border'
  }
  return 'bg-info/[0.12] text-info border border-info/20'
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
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[810px] gap-0 overflow-hidden border-[#252525] bg-[#171717] p-0 shadow-2xl sm:max-w-[810px] [&_[data-slot=dialog-close]]:right-6 [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:rounded-md [&_[data-slot=dialog-close]]:bg-[#2A2A2A] [&_[data-slot=dialog-close]]:p-1.5 [&_[data-slot=dialog-close]]:text-[#CFCFCF]">
          <DialogHeader className="border-b border-[#252525] px-4 py-4 sm:px-6">
            <DialogTitle className="pr-10 text-lg font-medium text-[#E8E8E8]">Tổng quan nhóm</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(92vh-61px)] overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {isFetching ? (
              <div className="flex min-h-[180px] items-center justify-center gap-2 text-sm font-normal text-[#777777]">
                <Spinner className="h-4 w-4" />
                Đang tải dữ liệu tổng quan...
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Không tải được thông tin tổng quan của nhóm.
              </div>
            ) : data ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-[#2A2A2A] p-4">
                  <h4 className="text-sm font-normal text-[#D7D7D7]">Thông tin nhóm</h4>
                  <div className="mt-4 grid gap-4 text-sm font-normal sm:grid-cols-2">
                    <p className="min-w-0 break-all text-[#E8E8E8]"><span className="text-xs font-normal text-[#777777]">Tên nhóm:</span> {data.group.title}</p>
                    <p className="flex items-center gap-2 text-[#E8E8E8]">
                      <span className="text-xs font-normal text-[#777777]">Trạng thái:</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-[3px] text-[11.5px] font-medium ${groupStatusClass(
                          data.group.status,
                        )}`}
                      >
                        {formatGroupStatus(data.group.status)}
                      </span>
                    </p>
                    <p className="text-[#E8E8E8]"><span className="text-xs font-normal text-[#777777]">Volume tối thiểu:</span> {data.group.minVolumeRequired !== null ? `${formatVnd(data.group.minVolumeRequired)} VNĐ` : '---'}</p>
                    <p className="text-[#E8E8E8]"><span className="text-xs font-normal text-[#777777]">Volume tối đa:</span> {data.group.maxVolumeRequired !== null ? `${formatVnd(data.group.maxVolumeRequired)} VNĐ` : '---'}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-[#2A2A2A] p-4">
                  <h4 className="text-sm font-normal text-[#D7D7D7]">Tóm tắt truy cập</h4>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {summaryEntries.map(([label, value]) => (
                      <div key={String(label)} className="min-w-0 rounded-lg border border-[#2A2A2A] p-4">
                        <p className="break-words text-xs font-normal text-[#777777]">{label}</p>
                        <p className="break-all text-sm font-normal text-[#E8E8E8]">{value ?? '---'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
