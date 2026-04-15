'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CashbackSummarySkeleton } from '@/components/skeletons/CashbackSummarySkeleton'
import { toast } from '@/hooks/useToast'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import { useGetCashbackSummaryQuery } from '@/services/api/cashbackApi'
import { toCurrency } from '../../constants'

export function SummaryTab() {
  const { data: summary, isLoading, error } = useGetCashbackSummaryQuery()
  const [isEntered, setIsEntered] = useState(false)

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Không tải được tổng quan cashback',
        description: extractApiErrorMessage(error, 'Đã có lỗi xảy ra'),
      })
    }
  }, [error])

  useEffect(() => {
    if (!summary) return
    const frameId = window.requestAnimationFrame(() => {
      setIsEntered(true)
    })
    return () => window.cancelAnimationFrame(frameId)
  }, [summary])

  if (isLoading) {
    return <CashbackSummarySkeleton />
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Chưa có dữ liệu summary cashback.
        </CardContent>
      </Card>
    )
  }

  const cards = [
    {
      label: 'Tổng Commission',
      value: toCurrency(summary.totalCommissionUsd),
      tone: 'Doanh thu',
      className: 'border-primary/35 bg-gradient-to-br from-primary/20 via-primary/8 to-background',
      chipClassName: 'border-primary/40 bg-primary/15 text-primary',
      valueClassName: 'text-primary',
      fillColor: 'rgba(34, 211, 238, 0.24)',
    },
    {
      label: 'Tổng Cashback đã trả',
      value: toCurrency(summary.totalCashbackPaidUsd),
      tone: 'Đã chi trả',
      className: 'border-success/35 bg-gradient-to-br from-success/20 via-success/8 to-background',
      chipClassName: 'border-success/40 bg-success/15 text-success',
      valueClassName: 'text-success',
      fillColor: 'rgba(34, 197, 94, 0.22)',
    },
    {
      label: 'Tổng Payout',
      value: summary.totalPayouts,
      tone: 'Sản lượng',
      className: 'border-sky-400/35 bg-gradient-to-br from-sky-500/20 via-sky-500/8 to-background',
      chipClassName: 'border-sky-400/40 bg-sky-500/15 text-sky-300',
      valueClassName: 'text-sky-300',
      fillColor: 'rgba(56, 189, 248, 0.22)',
    },
    {
      label: 'KOL giữ lại',
      value: toCurrency(summary.kolRetainedUsd),
      tone: 'Biên lợi nhuận',
      className: 'border-violet-400/35 bg-gradient-to-br from-violet-500/20 via-violet-500/8 to-background',
      chipClassName: 'border-violet-400/40 bg-violet-500/15 text-violet-300',
      valueClassName: 'text-violet-300',
      fillColor: 'rgba(167, 139, 250, 0.24)',
    },
    {
      label: 'Member đã nhận',
      value: summary.totalMembersReceivedCashback,
      tone: 'Độ phủ',
      className: 'border-cyan-400/35 bg-gradient-to-br from-cyan-500/20 via-cyan-500/8 to-background',
      chipClassName: 'border-cyan-400/40 bg-cyan-500/15 text-cyan-300',
      valueClassName: 'text-cyan-300',
      fillColor: 'rgba(34, 211, 238, 0.22)',
    },
    {
      label: 'Payout thành công',
      value: summary.successfulPayouts,
      tone: 'Tốt',
      className: 'border-emerald-400/35 bg-gradient-to-br from-emerald-500/20 via-emerald-500/8 to-background',
      chipClassName: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300',
      valueClassName: 'text-emerald-300',
      fillColor: 'rgba(52, 211, 153, 0.22)',
    },
    {
      label: 'Payout đang chờ',
      value: summary.pendingPayouts,
      tone: 'Theo dõi',
      className: 'border-warning/45 bg-gradient-to-br from-warning/25 via-warning/8 to-background',
      chipClassName: 'border-warning/45 bg-warning/20 text-warning',
      valueClassName: 'text-warning',
      fillColor: 'rgba(251, 191, 36, 0.24)',
    },
    {
      label: 'Payout thất bại',
      value: summary.failedPayouts,
      tone: 'Rủi ro',
      className: 'border-destructive/45 bg-gradient-to-br from-destructive/25 via-destructive/8 to-background',
      chipClassName: 'border-destructive/45 bg-destructive/20 text-destructive',
      valueClassName: 'text-destructive',
      fillColor: 'rgba(239, 68, 68, 0.24)',
    },
  ]

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${isEntered ? 'enter-mounted' : ''}`}>
      {cards.map((card, index) => (
        <Card
          key={card.label}
          className={`enter-card enter-fill-item ${card.className}`}
          style={{ '--enter-delay': `${index * 80}ms`, '--fill-color': card.fillColor } as CSSProperties}
        >
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardDescription className="text-foreground/85">{card.label}</CardDescription>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${card.chipClassName}`}
              >
                {card.tone}
              </span>
            </div>
            <CardTitle className={`text-3xl font-bold tabular-nums ${card.valueClassName}`}>
              {card.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
