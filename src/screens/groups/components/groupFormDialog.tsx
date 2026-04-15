'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CreateGroupBody } from '@/types/api'

export type GroupFormValues = {
  title: string
  description: string
  minVolumeRequired: string
  maxVolumeRequired: string
  warningCountBeforeKick: number[]
  gracePeriodDays: number[]
  autoKickEnabled: boolean
  rejoinEnabled: boolean
}

type GroupFormDialogProps = {
  dialogTitle: string
  submitText: string
  trigger: ReactNode
  initialValues: GroupFormValues
  onSubmitPayload: (payload: CreateGroupBody) => Promise<void>
  defaultOpen?: boolean
}

export function GroupFormDialog({
  dialogTitle,
  submitText,
  trigger,
  initialValues,
  onSubmitPayload,
  defaultOpen = false,
}: GroupFormDialogProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<GroupFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
  })

  useEffect(() => {
    if (open) {
      reset(initialValues)
    }
  }, [initialValues, open, reset])

  const minVolume = watch('minVolumeRequired')
  const maxVolume = watch('maxVolumeRequired')
  const description = watch('description')

  const minParsed = Number(minVolume)
  const maxParsed = Number(maxVolume)
  const descriptionInvalid = description.trim().length === 0
  const rangeInvalid =
    minVolume === '' ||
    maxVolume === '' ||
    Number.isNaN(minParsed) ||
    Number.isNaN(maxParsed) ||
    minParsed > maxParsed

  const onSubmit = async (form: GroupFormValues) => {
    const minVolumeRequired = Number(form.minVolumeRequired)
    const maxVolumeRequired = Number(form.maxVolumeRequired)

    if (minVolumeRequired > maxVolumeRequired) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmitPayload({
        title: form.title.trim(),
        description: form.description.trim(),
        minVolumeRequired,
        maxVolumeRequired,
        autoKickEnabled: form.autoKickEnabled,
        rejoinEnabled: form.rejoinEnabled,
        warningCountBeforeKick: form.warningCountBeforeKick[0],
        gracePeriodDays: form.gracePeriodDays[0],
      })
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>

          <div className="py-6">
            <FieldGroup className="gap-5">
              <Field orientation="vertical" className="w-full">
                <FieldLabel>Tên group</FieldLabel>
                <Input
                  className="w-full"
                  placeholder="Nhập tên group"
                  {...register('title', {
                    required: 'Tên group không được để trống.',
                    validate: (value) => value.trim().length > 0 || 'Tên group không được để trống.',
                  })}
                />
                {errors.title ? (
                  <FieldDescription className="text-destructive">{errors.title.message}</FieldDescription>
                ) : null}
              </Field>

              <Field orientation="vertical">
                <FieldLabel>Mô tả</FieldLabel>
                <Textarea
                  placeholder="Nhập mô tả cho group"
                  rows={4}
                  {...register('description', {
                    required: 'Mô tả không được để trống.',
                    validate: (value) => value.trim().length > 0 || 'Mô tả không được để trống.',
                  })}
                />
                {errors.description ? (
                  <FieldDescription className="text-destructive">{errors.description.message}</FieldDescription>
                ) : null}
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field orientation="vertical">
                  <FieldLabel>Ngưỡng volume tối thiểu</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={maxVolume ? Number(maxVolume) : undefined}
                    step="1"
                    inputMode="numeric"
                    {...register('minVolumeRequired', {
                      required: 'Ngưỡng volume tối thiểu là bắt buộc.',
                      validate: (value) => {
                        const parsed = Number(value)
                        const maxValue = Number(watch('maxVolumeRequired'))
                        if (value === '' || Number.isNaN(parsed)) return 'Ngưỡng volume tối thiểu không hợp lệ.'
                        if (parsed < 0) return 'Ngưỡng volume tối thiểu phải lớn hơn hoặc bằng 0.'
                        if (!Number.isNaN(maxValue) && parsed > maxValue) {
                          return 'Ngưỡng tối thiểu không được lớn hơn ngưỡng tối đa.'
                        }
                        return true
                      },
                    })}
                  />
                  {errors.minVolumeRequired ? (
                    <FieldDescription className="text-destructive">{errors.minVolumeRequired.message}</FieldDescription>
                  ) : null}
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Ngưỡng volume tối đa</FieldLabel>
                  <Input
                    type="number"
                    min={minVolume ? Number(minVolume) : 0}
                    step="1"
                    inputMode="numeric"
                    {...register('maxVolumeRequired', {
                      required: 'Ngưỡng volume tối đa là bắt buộc.',
                      validate: (value) => {
                        const parsed = Number(value)
                        const minValue = Number(watch('minVolumeRequired'))
                        if (value === '' || Number.isNaN(parsed)) return 'Ngưỡng volume tối đa không hợp lệ.'
                        if (parsed < 0) return 'Ngưỡng volume tối đa phải lớn hơn hoặc bằng 0.'
                        if (!Number.isNaN(minValue) && parsed < minValue) {
                          return 'Ngưỡng tối đa không được nhỏ hơn ngưỡng tối thiểu.'
                        }
                        return true
                      },
                    })}
                  />
                  {errors.maxVolumeRequired ? (
                    <FieldDescription className="text-destructive">{errors.maxVolumeRequired.message}</FieldDescription>
                  ) : null}
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field orientation="vertical">
                  <FieldLabel>Số lần cảnh báo trước kick</FieldLabel>
                  <Controller
                    control={control}
                    name="warningCountBeforeKick"
                    rules={{
                      validate: (value) => {
                        const current = value[0]
                        return current >= 1 && current <= 5 || 'Giá trị hợp lệ từ 1 đến 5.'
                      },
                    }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>1</span>
                          <span className="font-medium text-foreground">{field.value[0]} lần</span>
                          <span>5</span>
                        </div>
                        <Slider value={field.value} min={1} max={5} step={1} onValueChange={field.onChange} />
                      </div>
                    )}
                  />
                  {errors.warningCountBeforeKick ? (
                    <FieldDescription className="text-destructive">{errors.warningCountBeforeKick.message}</FieldDescription>
                  ) : (
                    <FieldDescription>Giá trị hợp lệ từ 1 đến 5.</FieldDescription>
                  )}
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Grace period (ngày)</FieldLabel>
                  <Controller
                    control={control}
                    name="gracePeriodDays"
                    rules={{
                      validate: (value) => {
                        const current = value[0]
                        return current >= 3 && current <= 30 || 'Grace period phải trong khoảng 3 đến 30 ngày.'
                      },
                    }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>3</span>
                          <span className="font-medium text-foreground">{field.value[0]} ngày</span>
                          <span>30</span>
                        </div>
                        <Slider value={field.value} min={3} max={30} step={1} onValueChange={field.onChange} />
                      </div>
                    )}
                  />
                  {errors.gracePeriodDays ? (
                    <FieldDescription className="text-destructive">{errors.gracePeriodDays.message}</FieldDescription>
                  ) : null}
                </Field>
              </div>

              <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <FieldLabel>Bật auto-kick</FieldLabel>
                  <FieldDescription>Group sẽ tự động kick khi vượt quá ngưỡng cảnh báo.</FieldDescription>
                </div>
                <Controller
                  control={control}
                  name="autoKickEnabled"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </Field>

              <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <FieldLabel>Cho phép rejoin</FieldLabel>
                  <FieldDescription>Thành viên có thể tham gia lại sau khi bị kick.</FieldDescription>
                </div>
                <Controller
                  control={control}
                  name="rejoinEnabled"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </Field>

              {descriptionInvalid || rangeInvalid ? (
                <p className="text-sm text-destructive">
                  {descriptionInvalid ? 'Mô tả không được để trống. ' : ''}
                  {rangeInvalid ? 'Ngưỡng volume tối thiểu không được lớn hơn ngưỡng tối đa.' : ''}
                </p>
              ) : null}
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || descriptionInvalid || rangeInvalid}>
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
