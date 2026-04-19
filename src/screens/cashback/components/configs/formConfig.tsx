'use client'

import { ChevronDown } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCashbackConfigForm, type CashbackConfigFormValues } from '../../hooks/useCashbackConfigForm'
import { configStatusLabel, distributionCycleLabel } from '../../constants'
import type { GroupItem } from '@/types/api'

type FormConfigProps = {
  isOpen: boolean
  groups: GroupItem[]
  isSubmitting: boolean
  onToggle: () => void
  onClose: () => void
  onSubmit: (values: CashbackConfigFormValues) => Promise<boolean>
}

export function FormConfig({ isOpen, groups, isSubmitting, onToggle, onClose, onSubmit }: FormConfigProps) {
  const { register, control, handleSubmit, formState: { errors }, reset } = useCashbackConfigForm()

  const handleCreate = handleSubmit(async (values) => {
    const isSuccess = await onSubmit(values)
    if (isSuccess) {
      reset()
      onClose()
    }
  })

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tạo Cashback Config</CardTitle>
            <CardDescription>
              Tạo config mới theo chính sách cashback hiện hành.
            </CardDescription>
          </div>
          <ChevronDown
            className="h-5 w-5 transition-transform"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="grid gap-4 md:grid-cols-2 pt-0">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cashbackRatePct">Cashback Rate (%)</Label>
            <Controller
              control={control}
              name="cashbackRatePct"
              rules={{
                required: 'Cashback rate là bắt buộc',
                validate: (value) => {
                  const number = Number(value)
                  if (Number.isNaN(number)) return 'Cashback rate không hợp lệ'
                  if (number < 0 || number > 50) return 'Cashback rate phải trong khoảng 0..50'
                  return true
                },
              }}
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="cashback-slider w-full"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-20 h-10 bg-surface-2 border border-border rounded-lg text-center font-geist-mono text-lg font-semibold text-brand outline-none focus:border-brand"
                      />
                      <span className="text-sm text-muted-foreground font-medium">%</span>
                    </div>
                  </div>
                  {errors.cashbackRatePct && (
                    <p className="text-xs text-destructive">{errors.cashbackRatePct.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minPayoutUsd">Min Payout (USD)</Label>
            <Input
              id="minPayoutUsd"
              type="number"
              min={1}
              {...register('minPayoutUsd', {
                required: 'Min payout là bắt buộc',
                validate: (value) => {
                  const number = Number(value)
                  if (Number.isNaN(number)) return 'Min payout không hợp lệ'
                  if (number < 1) return 'Min payout phải lớn hơn hoặc bằng 1'
                  return true
                },
              })}
            />
            {errors.minPayoutUsd && (
              <p className="text-xs text-destructive">{errors.minPayoutUsd.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Distribution Cycle</Label>
            <Controller
              control={control}
              name="distributionCycle"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">{distributionCycleLabel.weekly}</SelectItem>
                    <SelectItem value="monthly">{distributionCycleLabel.monthly}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{configStatusLabel.active}</SelectItem>
                    <SelectItem value="inactive">{configStatusLabel.inactive}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveFrom">Effective From</Label>
            <Controller
              control={control}
              name="effectiveFrom"
              rules={{ required: 'Effective from là bắt buộc' }}
              render={({ field }) => (
                <Input
                  id="effectiveFrom"
                  type="datetime-local"
                  {...register('effectiveFrom', { required: 'Effective from là bắt buộc' })}
                />
              )}
            />
            {errors.effectiveFrom && (
              <p className="text-xs text-destructive">{errors.effectiveFrom.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveTo">Effective To</Label>
            <Controller
              control={control}
              name="effectiveTo"
              render={({ field }) => (
                <Input
                  id="effectiveTo"
                  type="datetime-local"
                  {...register('effectiveTo')}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Nhóm (Group)</Label>
            <Controller
              control={control}
              name="telegramGroupId"
              rules={{ required: 'Vui lòng chọn nhóm' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">Không có nhóm nào</div>
                    ) : (
                      groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.telegramGroupId && (
              <p className="text-xs text-destructive">{errors.telegramGroupId.message}</p>
            )}
          </div>

          <div className="md:col-span-2 flex gap-2">
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo config'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
