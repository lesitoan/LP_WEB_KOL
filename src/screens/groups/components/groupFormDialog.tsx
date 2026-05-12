'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  telegramGroupId: string
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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GroupFormDialog({
  dialogTitle,
  submitText,
  trigger,
  initialValues,
  onSubmitPayload,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: GroupFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const wasOpenRef = useRef(false) // Để khỏi quay về state cũ khi nhấn update
  const open = controlledOpen ?? internalOpen
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }
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
    if (defaultOpen) {
      setOpen(true)
    }
  }, [defaultOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      reset(initialValues)
    }
    wasOpenRef.current = open
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
        telegramGroupId: form.telegramGroupId.trim(),
        description: form.description.trim(),
        minVolumeRequired,
        maxVolumeRequired,
        autoKickEnabled: form.autoKickEnabled,
        rejoinEnabled: form.rejoinEnabled,
        warningCountBeforeKick: form.warningCountBeforeKick[0],
        gracePeriodHours: form.gracePeriodDays[0] * 24,
      })
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl lg:max-w-4xl xl:max-w-5xl w-[calc(100vw-1rem)] sm:w-full max-h-[92vh] overflow-hidden p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[92vh] flex-col">
          <DialogHeader className="px-4 sm:px-5 pt-5">
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FieldGroup className="gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
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

                <Field orientation="vertical" className="w-full">
                <FieldLabel>ID nhóm telegram</FieldLabel>
                  <Input
                    className="w-full"
                  placeholder="Nhập ID nhóm telegram"
                    {...register('telegramGroupId', {
                    required: 'ID nhóm Telegram không được để trống.',
                    validate: (value) => value.trim().length > 0 || 'ID nhóm Telegram không được để trống.',
                    })}
                  />
                  {errors.telegramGroupId ? (
                    <FieldDescription className="text-destructive">{errors.telegramGroupId.message}</FieldDescription>
                  ) : null}
                </Field>
              </div>

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

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field orientation="vertical">
                  <FieldLabel>{`Ngưỡng volume tối thiểu (USD)`}</FieldLabel>
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
                  <FieldLabel>{`Ngưỡng volume tối đa (USD)`}</FieldLabel>
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
                  <FieldLabel>Thời gian ân hận (ngày)</FieldLabel>
                  <Controller
                    control={control}
                    name="gracePeriodDays"
                    rules={{
                      validate: (value) => {
                        const current = value[0]
                        return current >= 3 && current <= 30 || 'Thời gian ân hận phải trong khoảng 3 đến 30 ngày.'
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

              <div className="grid gap-4 lg:grid-cols-2">
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
              </div>

              {descriptionInvalid || rangeInvalid ? (
                <p className="text-sm text-destructive">
                  {descriptionInvalid ? 'Mô tả không được để trống. ' : ''}
                  {rangeInvalid ? 'Ngưỡng volume tối thiểu không được lớn hơn ngưỡng tối đa.' : ''}
                </p>
              ) : null}
            </FieldGroup>
          </div>

          <DialogFooter className="px-4 sm:px-5 pb-5 pt-4 border-t border-border">
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
