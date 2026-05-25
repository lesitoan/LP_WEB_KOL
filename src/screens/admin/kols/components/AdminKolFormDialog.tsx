'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  AdminKolItem,
  AdminKolStatus,
  AdminKolStatusAction,
  CreateAdminKolBody,
  UpdateAdminKolBody,
} from '@/types/admin/kols'
import { adminKolStatusLabel, adminKolStatusOptions, toDateInputValue, toIsoDate } from '../mappers'

export type AdminKolFormValues = {
  code: string
  displayName: string
  slug: string
  ownerEmail: string
  ownerPassword: string
  ownerFullName: string
  ownerUserId: string
  status: AdminKolStatus
  lpexRefCode: string
  telegramUsername: string
  zaloContact: string
  defaultLanguage: string
  currentTierId: string
  currentCommissionRate: string
  onboardedAt: string
  approvedAt: string
}

type AdminKolFormDialogProps = {
  mode: 'create' | 'edit'
  trigger: ReactNode
  kol?: AdminKolItem
  onSubmitPayload: (
    payload: CreateAdminKolBody | UpdateAdminKolBody,
    meta?: { statusAction?: AdminKolStatusAction },
  ) => Promise<void>
}

const defaultValues: AdminKolFormValues = {
  code: '',
  displayName: '',
  slug: '',
  ownerEmail: '',
  ownerPassword: '',
  ownerFullName: '',
  ownerUserId: '',
  status: 'PENDING',
  lpexRefCode: '',
  telegramUsername: '',
  zaloContact: '',
  defaultLanguage: 'vi',
  currentTierId: '',
  currentCommissionRate: '0',
  onboardedAt: '',
  approvedAt: '',
}

const formValuesFromKol = (kol?: AdminKolItem): AdminKolFormValues => {
  if (!kol) return defaultValues
  return {
    ...defaultValues,
    code: kol.code,
    displayName: kol.displayName,
    slug: kol.slug ?? '',
    ownerUserId: kol.ownerUserId ?? '',
    status: kol.status,
    lpexRefCode: kol.lpexRefCode,
    telegramUsername: kol.telegramUsername,
    zaloContact: kol.zaloContact ?? '',
    defaultLanguage: kol.defaultLanguage ?? 'vi',
    currentTierId: kol.currentTierId ?? '',
    currentCommissionRate: String(kol.currentCommissionRate ?? 0),
    onboardedAt: toDateInputValue(kol.onboardedAt),
    approvedAt: toDateInputValue(kol.approvedAt),
  }
}

const optionalTrim = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const normalizeTelegramUsername = (value: string) => value.trim().replace(/^@+/, '').toLowerCase()

const getStatusAction = (
  currentStatus: AdminKolStatus | undefined,
  nextStatus: AdminKolStatus,
): AdminKolStatusAction | undefined => {
  if (!currentStatus || currentStatus === nextStatus) return undefined
  if (nextStatus === 'ACTIVE') return currentStatus === 'PAUSED' ? 'resume' : 'approve'
  if (nextStatus === 'REJECTED') return 'reject'
  if (nextStatus === 'PAUSED') return 'pause'
  return undefined
}

const editableStatusOptions = adminKolStatusOptions.filter((option) => option.value !== 'PENDING')

export function AdminKolFormDialog({ mode, trigger, kol, onSubmitPayload }: AdminKolFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const wasOpenRef = useRef(false)
  const isCreate = mode === 'create'

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminKolFormValues>({
    defaultValues: formValuesFromKol(kol),
    mode: 'onChange',
  })

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      reset(formValuesFromKol(kol))
    }
    wasOpenRef.current = open
  }, [kol, open, reset])

  const currentStatus = watch('status')

  const onSubmit = async (form: AdminKolFormValues) => {
    const commissionRate = Number(form.currentCommissionRate || 0)

    setIsSubmitting(true)
    try {
      if (isCreate) {
        await onSubmitPayload({
          code: form.code.trim(),
          displayName: form.displayName.trim(),
          slug: optionalTrim(form.slug),
          ownerEmail: form.ownerEmail.trim().toLowerCase(),
          ownerPassword: form.ownerPassword,
          ownerFullName: optionalTrim(form.ownerFullName),
          status: form.status,
          lpexRefCode: form.lpexRefCode.trim(),
          telegramUsername: normalizeTelegramUsername(form.telegramUsername),
          zaloContact: optionalTrim(form.zaloContact),
          defaultLanguage: optionalTrim(form.defaultLanguage),
          currentTierId: optionalTrim(form.currentTierId),
          currentCommissionRate: Number.isFinite(commissionRate) ? commissionRate : 0,
          onboardedAt: toIsoDate(form.onboardedAt),
          approvedAt: toIsoDate(form.approvedAt),
        })
      } else {
        await onSubmitPayload(
          {
            code: optionalTrim(form.code),
            displayName: optionalTrim(form.displayName),
            slug: optionalTrim(form.slug),
            ownerUserId: optionalTrim(form.ownerUserId),
            lpexRefCode: optionalTrim(form.lpexRefCode),
            telegramUsername: optionalTrim(normalizeTelegramUsername(form.telegramUsername)),
            zaloContact: optionalTrim(form.zaloContact),
            defaultLanguage: optionalTrim(form.defaultLanguage),
            currentTierId: optionalTrim(form.currentTierId),
            currentCommissionRate: Number.isFinite(commissionRate) ? commissionRate : undefined,
            onboardedAt: toIsoDate(form.onboardedAt),
            approvedAt: toIsoDate(form.approvedAt),
          },
          { statusAction: getStatusAction(kol?.status, form.status) },
        )
      }
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl lg:max-w-5xl w-[calc(100vw-1rem)] sm:w-full max-h-[92vh] overflow-hidden p-0">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex max-h-[92vh] flex-col">
          <DialogHeader className="px-4 sm:px-5 pt-5">
            <DialogTitle>{isCreate ? 'Tạo KOL mới' : 'Cập nhật KOL'}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FieldGroup className="gap-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <Field orientation="vertical">
                  <FieldLabel>Mã KOL</FieldLabel>
                  <Input
                    placeholder="KOL_ABC"
                    {...register('code', {
                      required: 'Mã KOL không được để trống.',
                      maxLength: { value: 50, message: 'Mã KOL tối đa 50 ký tự.' },
                    })}
                  />
                  {errors.code ? <FieldDescription className="text-destructive">{errors.code.message}</FieldDescription> : null}
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Tên hiển thị</FieldLabel>
                  <Input
                    placeholder="KOL ABC"
                    {...register('displayName', {
                      required: 'Tên KOL không được để trống.',
                      maxLength: { value: 255, message: 'Tên KOL tối đa 255 ký tự.' },
                    })}
                  />
                  {errors.displayName ? <FieldDescription className="text-destructive">{errors.displayName.message}</FieldDescription> : null}
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Slug</FieldLabel>
                  <Input placeholder="kol-abc" {...register('slug')} />
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Field orientation="vertical">
                  <FieldLabel>Ref code LPEX</FieldLabel>
                  <Input
                    placeholder="REF123"
                    {...register('lpexRefCode', {
                      required: 'Ref code không được để trống.',
                      maxLength: { value: 100, message: 'Ref code tối đa 100 ký tự.' },
                    })}
                  />
                  {errors.lpexRefCode ? <FieldDescription className="text-destructive">{errors.lpexRefCode.message}</FieldDescription> : null}
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Telegram username</FieldLabel>
                  <Input
                    placeholder="@kolabc"
                    {...register('telegramUsername', {
                      required: 'Telegram username không được để trống.',
                      maxLength: { value: 100, message: 'Telegram username tối đa 100 ký tự.' },
                    })}
                  />
                  {errors.telegramUsername ? <FieldDescription className="text-destructive">{errors.telegramUsername.message}</FieldDescription> : null}
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Trạng thái</FieldLabel>
                  <Select value={currentStatus} onValueChange={(value) => setValue('status', value as AdminKolStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(isCreate ? adminKolStatusOptions : editableStatusOptions).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {adminKolStatusLabel[option.value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isCreate && getStatusAction(kol?.status, currentStatus) ? (
                    <FieldDescription>Trạng thái sẽ được cập nhật bằng API hành động riêng khi lưu.</FieldDescription>
                  ) : null}
                </Field>
              </div>

              {isCreate ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <Field orientation="vertical">
                    <FieldLabel>Email owner</FieldLabel>
                    <Input
                      type="email"
                      placeholder="owner@example.com"
                      {...register('ownerEmail', {
                        required: 'Email owner không được để trống.',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email owner không hợp lệ.' },
                      })}
                    />
                    {errors.ownerEmail ? <FieldDescription className="text-destructive">{errors.ownerEmail.message}</FieldDescription> : null}
                  </Field>

                  <Field orientation="vertical">
                    <FieldLabel>Mật khẩu owner</FieldLabel>
                    <Input
                      type="password"
                      placeholder="Tối thiểu 8 ký tự"
                      {...register('ownerPassword', {
                        required: 'Mật khẩu owner không được để trống.',
                        minLength: { value: 8, message: 'Mật khẩu tối thiểu 8 ký tự.' },
                        maxLength: { value: 72, message: 'Mật khẩu tối đa 72 ký tự.' },
                      })}
                    />
                    {errors.ownerPassword ? <FieldDescription className="text-destructive">{errors.ownerPassword.message}</FieldDescription> : null}
                  </Field>

                  <Field orientation="vertical">
                    <FieldLabel>Tên owner</FieldLabel>
                    <Input placeholder="Owner Name" {...register('ownerFullName')} />
                  </Field>
                </div>
              ) : (
                <Field orientation="vertical">
                  <FieldLabel>Owner user id</FieldLabel>
                  <Input placeholder="UUID owner mới" {...register('ownerUserId')} />
                </Field>
              )}

              <div className="grid gap-4 lg:grid-cols-3">
                <Field orientation="vertical">
                  <FieldLabel>Zalo contact</FieldLabel>
                  <Input placeholder="Số điện thoại hoặc link Zalo" {...register('zaloContact')} />
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Ngôn ngữ mặc định</FieldLabel>
                  <Input placeholder="vi" {...register('defaultLanguage')} />
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Tier hiện tại</FieldLabel>
                  <Input placeholder="UUID tier" {...register('currentTierId')} />
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Field orientation="vertical">
                  <FieldLabel>Commission rate (%)</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={999.99}
                    step="0.01"
                    {...register('currentCommissionRate', {
                      validate: (value) => {
                        const parsed = Number(value)
                        if (!Number.isFinite(parsed)) return 'Commission rate không hợp lệ.'
                        if (parsed < 0 || parsed > 999.99) return 'Commission rate phải từ 0 đến 999.99.'
                        return true
                      },
                    })}
                  />
                  {errors.currentCommissionRate ? <FieldDescription className="text-destructive">{errors.currentCommissionRate.message}</FieldDescription> : null}
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Ngày onboard</FieldLabel>
                  <Input type="date" {...register('onboardedAt')} />
                </Field>

                <Field orientation="vertical">
                  <FieldLabel>Ngày duyệt</FieldLabel>
                  <Input type="date" {...register('approvedAt')} />
                </Field>
              </div>
            </FieldGroup>
          </div>

          <DialogFooter className="px-4 sm:px-5 pb-5 pt-4 border-t border-border">
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isCreate ? 'Tạo KOL' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
