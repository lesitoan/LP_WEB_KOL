'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { GROUP_LOGO_OPTIONS, getGroupLogoOption } from '@/lib/groupLogo'
import type { CreateGroupBody, UpdateGroupBody } from '@/types/api'
import { GroupLogoBadge } from './groupLogoBadge'

export type GroupFormValues = {
  title: string
  iconKey: string
  telegramGroupId: string
  description: string
  minVolumeRequired: string
  maxVolumeRequired: string
  warningCountBeforeKick: number[]
  gracePeriodDays: number[]
  autoKickEnabled: boolean
  rejoinEnabled: boolean
}

const volumeWithMaxTwoDecimalsRegex = /^\d+(?:\.\d{1,2})?$/

function getRangeBackground(value: number, min: number, max: number) {
  const progress = ((value - min) / (max - min)) * 100
  return `linear-gradient(to right, #D4A74A 0%, #D4A74A ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`
}

type GroupSubmitPayload = CreateGroupBody | UpdateGroupBody

type GroupFormDialogProps = {
  dialogTitle: string
  submitText: string
  trigger: ReactNode
  initialValues: GroupFormValues
  submitMode?: 'create' | 'update'
  onSubmitPayload: (payload: GroupSubmitPayload) => Promise<void>
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
  submitMode = 'create',
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
    formState: { dirtyFields, errors },
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
  const title = watch('title')
  const selectedLogo = getGroupLogoOption(watch('iconKey'))

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
      const fullPayload: CreateGroupBody = {
        title: form.title.trim(),
        iconKey: form.iconKey,
        telegramGroupId: form.telegramGroupId.trim(),
        description: form.description.trim(),
        minVolumeRequired,
        maxVolumeRequired,
        autoKickEnabled: form.autoKickEnabled,
        rejoinEnabled: form.rejoinEnabled,
        warningCountBeforeKick: form.warningCountBeforeKick[0],
        gracePeriodHours: form.gracePeriodDays[0] * 24,
      }

      if (submitMode === 'update') {
        const payload: UpdateGroupBody = {}

        if (dirtyFields.title) payload.title = fullPayload.title
        if (dirtyFields.iconKey) payload.iconKey = fullPayload.iconKey
        if (dirtyFields.telegramGroupId) payload.telegramGroupId = fullPayload.telegramGroupId
        if (dirtyFields.description) payload.description = fullPayload.description
        if (dirtyFields.minVolumeRequired) payload.minVolumeRequired = fullPayload.minVolumeRequired
        if (dirtyFields.maxVolumeRequired) payload.maxVolumeRequired = fullPayload.maxVolumeRequired
        if (dirtyFields.autoKickEnabled) payload.autoKickEnabled = fullPayload.autoKickEnabled
        if (dirtyFields.rejoinEnabled) payload.rejoinEnabled = fullPayload.rejoinEnabled
        if (dirtyFields.warningCountBeforeKick) payload.warningCountBeforeKick = fullPayload.warningCountBeforeKick
        if (dirtyFields.gracePeriodDays) payload.gracePeriodHours = fullPayload.gracePeriodHours

        await onSubmitPayload(payload)
      } else {
        await onSubmitPayload(fullPayload)
      }
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-[810px] gap-0 overflow-hidden border-[#252525] bg-[#171717] p-0 shadow-2xl sm:max-w-[810px] [&_[data-slot=dialog-close]]:right-6 [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:rounded-md [&_[data-slot=dialog-close]]:bg-[#2A2A2A] [&_[data-slot=dialog-close]]:p-1.5 [&_[data-slot=dialog-close]]:text-[#CFCFCF]">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex max-h-[92vh] flex-col">
          <style>{`
            .group-form-range::-webkit-slider-thumb {
              -webkit-appearance: none !important;
              appearance: none !important;
              width: 24px !important;
              height: 24px !important;
              border-radius: 50% !important;
              background: #D4A74A !important;
              border: 4px solid #ffffff !important;
              cursor: pointer !important;
              box-shadow: none !important;
            }
            .group-form-range::-moz-range-thumb {
              width: 24px !important;
              height: 24px !important;
              border-radius: 50% !important;
              background: #D4A74A !important;
              border: 4px solid #ffffff !important;
              cursor: pointer !important;
              box-shadow: none !important;
            }
          `}</style>
          <DialogHeader className="border-b border-[#252525] px-4 py-4 sm:px-6">
            <DialogTitle className="flex items-center gap-2 pr-10 text-lg font-medium text-[#E8E8E8]">
              <Layers className="h-4 w-4 text-[#FFCC00]" />
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FieldGroup className="gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Field orientation="vertical" className="w-full gap-1">
                  <FieldLabel className="text-xs font-semibold text-[#D7D7D7]">Tên group</FieldLabel>
                  <Input
                    className="h-10 border-[#2A2A2A] bg-[#0D0D0D] text-sm font-normal text-foreground placeholder:font-normal placeholder:text-[#6E6E6E]"
                    placeholder="Nhập tên nhóm"
                    {...register('title', {
                    required: 'Tên group không được để trống.',
                    validate: (value) => value.trim().length > 0 || 'Tên group không được để trống.',
                    })}
                  />
                  {errors.title ? (
                    <FieldDescription className="text-destructive">{errors.title.message}</FieldDescription>
                  ) : null}
                </Field>

                <Field orientation="vertical" className="w-full gap-1">
                  <FieldLabel className="text-sm font-medium text-[#D7D7D7]">ID nhóm Telegram</FieldLabel>
                  <Input
                    className="h-10 border-[#2A2A2A] bg-[#0D0D0D] text-sm font-normal text-foreground placeholder:font-normal placeholder:text-[#6E6E6E]"
                    placeholder="Nhập ID nhóm Telegram"
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

              <Field orientation="vertical" className="gap-1">
                <FieldLabel className="text-sm font-medium text-[#D7D7D7]">Mô tả nhóm</FieldLabel>
                <Textarea
                  className="min-h-[104px] resize-none border-[#2A2A2A] bg-[#0D0D0D] text-sm font-normal text-foreground placeholder:font-normal placeholder:text-[#6E6E6E]"
                  placeholder="Nhập mô tả cho nhóm"
                  {...register('description', {
                    required: 'Mô tả không được để trống.',
                    validate: (value) => value.trim().length > 0 || 'Mô tả không được để trống.',
                  })}
                />
                {errors.description ? (
                  <FieldDescription className="text-destructive">{errors.description.message}</FieldDescription>
                ) : null}
              </Field>

              <div className="grid gap-4 lg:grid-cols-2">
                <Field orientation="vertical" className="gap-1">
                  <FieldLabel className="text-sm font-medium text-[#D7D7D7]">{`Ngưỡng volume tối thiểu (USD)`}</FieldLabel>
                  <Input
                    className="h-10 border-[#2A2A2A] bg-[#0D0D0D] text-sm font-normal text-foreground placeholder:font-normal placeholder:text-[#6E6E6E]"
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

                <Field orientation="vertical" className="gap-1">
                  <FieldLabel className="text-sm font-medium text-[#D7D7D7]">{`Ngưỡng volume tối đa (USD)`}</FieldLabel>
                  <Input
                    className="h-10 border-[#2A2A2A] bg-[#0D0D0D] text-sm font-normal text-foreground placeholder:font-normal placeholder:text-[#6E6E6E]"
                    type="text"
                    min={minVolume ? Number(minVolume) : 0}
                    inputMode="decimal"
                    {...register('maxVolumeRequired', {
                      required: 'Ngưỡng volume tối đa là bắt buộc.',
                      validate: (value) => {
                        if (!volumeWithMaxTwoDecimalsRegex.test(value)) {
                          return 'Ngưỡng volume tối đa chỉ được có tối đa 2 chữ số thập phân.'
                        }
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

              <div className="grid gap-4 lg:grid-cols-2">
                <Field orientation="vertical" className="gap-1 rounded-lg border border-[#2A2A2A] p-4">
                  <FieldLabel className="text-sm font-normal text-[#D7D7D7]">Số lần cảnh báo trước khi kick</FieldLabel>
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
                        <div className="flex items-center justify-between text-sm font-normal text-[#777777]">
                          <span>1 lần</span>
                          <span className="font-normal text-[#D7D7D7]">{field.value[0]} lần</span>
                          <span>5 lần</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={field.value[0]}
                          onChange={(event) => field.onChange([Number(event.target.value)])}
                          className="group-form-range h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 outline-none focus:outline-none"
                          style={{ background: getRangeBackground(field.value[0], 1, 5) }}
                        />
                      </div>
                    )}
                  />
                  {errors.warningCountBeforeKick ? (
                    <FieldDescription className="text-destructive">{errors.warningCountBeforeKick.message}</FieldDescription>
                  ) : (
                    <FieldDescription className="text-xs font-normal text-[#777777]">Giá trị hợp lệ từ 1 đến 5</FieldDescription>
                  )}
                </Field>

                <Field orientation="vertical" className="gap-1 rounded-lg border border-[#2A2A2A] p-4">
                  <FieldLabel className="text-sm font-normal text-[#D7D7D7]">Thời gian gia hạn (ngày)</FieldLabel>
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
                        <div className="flex items-center justify-between text-sm font-normal text-[#777777]">
                          <span>3 ngày</span>
                          <span className="font-normal text-[#D7D7D7]">{field.value[0]} ngày</span>
                          <span>30 ngày</span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="30"
                          step="1"
                          value={field.value[0]}
                          onChange={(event) => field.onChange([Number(event.target.value)])}
                          className="group-form-range h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 outline-none focus:outline-none"
                          style={{ background: getRangeBackground(field.value[0], 3, 30) }}
                        />
                      </div>
                    )}
                  />
                  {errors.gracePeriodDays ? (
                    <FieldDescription className="text-destructive">{errors.gracePeriodDays.message}</FieldDescription>
                  ) : null}
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-[#2A2A2A] p-4">
                  <div className="space-y-0.5">
                    <FieldLabel className="text-sm font-normal text-[#D7D7D7]">Bật auto-kick</FieldLabel>
                    <FieldDescription className="text-xs font-normal text-[#777777]">Giá trị hợp lệ từ 1 đến 5</FieldDescription>
                  </div>
                  <Controller
                    control={control}
                    name="autoKickEnabled"
                    render={({ field }) => (
                      <Switch
                        className="h-6 w-[38px] border-0 bg-[#2B2B2B] data-[state=checked]:bg-[#15C982] data-[state=unchecked]:bg-[#2B2B2B] [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-4 [&_[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-0.5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Field>

                <Field orientation="horizontal" className="items-center justify-between rounded-lg border border-[#2A2A2A] p-4">
                  <div className="space-y-0.5">
                    <FieldLabel className="text-sm font-normal text-[#D7D7D7]">Cho phép rejoin</FieldLabel>
                    <FieldDescription className="text-xs font-normal text-[#777777]">Thành viên có thể tham gia lại sau khi bị kick.</FieldDescription>
                  </div>
                  <Controller
                    control={control}
                    name="rejoinEnabled"
                    render={({ field }) => (
                      <Switch
                        className="h-6 w-[38px] border-0 bg-[#2B2B2B] data-[state=checked]:bg-[#15C982] data-[state=unchecked]:bg-[#2B2B2B] [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-4 [&_[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-0.5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Field>
              </div>

              <Field orientation="vertical" className="gap-1">
                <FieldLabel className="text-sm font-medium text-[#D7D7D7]">Logo nhóm</FieldLabel>
                <Controller
                  control={control}
                  name="iconKey"
                  rules={{
                    validate: (value) => GROUP_LOGO_OPTIONS.some((option) => option.key === value) || 'Logo không hợp lệ.',
                  }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-full border-[#2A2A2A] text-[#D7D7D7]">
                        <span className="flex items-center gap-2">
                          <GroupLogoBadge iconKey={selectedLogo.key} title={title} className="h-6 w-7" textClassName="text-xs" />
                          {selectedLogo.label}
                        </span>
                      </SelectTrigger>
                      <SelectContent className="border-[#2A2A2A] bg-[#171717] text-[#D7D7D7]">
                        {GROUP_LOGO_OPTIONS.map((option) => (
                          <SelectItem key={option.key} value={option.key}>
                            <span className="flex items-center gap-2">
                              <GroupLogoBadge iconKey={option.key} title={title} className="h-6 w-7" textClassName="text-xs" />
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.iconKey ? (
                  <FieldDescription className="text-destructive">{errors.iconKey.message}</FieldDescription>
                ) : null}
              </Field>

              {descriptionInvalid || rangeInvalid ? (
                <p className="text-sm text-destructive">
                  {descriptionInvalid ? 'Mô tả không được để trống. ' : ''}
                  {rangeInvalid ? 'Ngưỡng volume tối thiểu không được lớn hơn ngưỡng tối đa.' : ''}
                </p>
              ) : null}
            </FieldGroup>
          </div>

          <DialogFooter className="border-t border-[#252525] px-4 py-4 sm:px-6">
            <Button type="button" variant="outline" className="h-9 bg-white text-base font-semibold text-[#171717] hover:bg-white/90" disabled={isSubmitting} onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" className="h-9 bg-brand text-base font-semibold text-[#171717] hover:bg-brand-dim" disabled={isSubmitting || descriptionInvalid || rangeInvalid}>
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
