'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CreateGroupBenefitBody } from '@/types/api'

export type BenefitFormValues = {
  benefitType: string
  benefitName: string
  benefitValue: string
  sortOrder: string
}

type BenefitFormDialogProps = {
  dialogTitle: string
  submitText: string
  trigger: ReactNode
  initialValues: BenefitFormValues
  onSubmitPayload: (payload: CreateGroupBenefitBody) => Promise<void>
}

export function BenefitFormDialog({
  dialogTitle,
  submitText,
  trigger,
  initialValues,
  onSubmitPayload,
}: BenefitFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BenefitFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
  })

  useEffect(() => {
    if (open) {
      reset(initialValues)
    }
  }, [initialValues, open, reset])

  const onSubmit = async (form: BenefitFormValues) => {
    const parsedSortOrder = Number(form.sortOrder)

    if (Number.isNaN(parsedSortOrder) || !Number.isInteger(parsedSortOrder)) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmitPayload({
        benefitType: form.benefitType.trim(),
        benefitName: form.benefitName.trim(),
        benefitValue: form.benefitValue.trim() || undefined,
        sortOrder: parsedSortOrder,
      })

      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>

          <div className="py-5">
            <FieldGroup className="gap-4">
              <Field orientation="vertical">
                <FieldLabel>Tên benefit</FieldLabel>
                <Input
                  placeholder="Nhập tên benefit"
                  {...register('benefitName', {
                    required: 'Tên benefit là bắt buộc.',
                    validate: (value) => value.trim().length > 0 || 'Tên benefit là bắt buộc.',
                    maxLength: {
                      value: 255,
                      message: 'Tên benefit tối đa 255 ký tự.',
                    },
                  })}
                />
                {errors.benefitName ? (
                  <FieldDescription className="text-destructive">{errors.benefitName.message}</FieldDescription>
                ) : null}
              </Field>

              <Field orientation="vertical">
                <FieldLabel>Loại benefit</FieldLabel>
                <Input
                  placeholder="Vi du: support, education, signal"
                  {...register('benefitType', {
                    required: 'Loại benefit là bắt buộc.',
                    validate: (value) => value.trim().length > 0 || 'Loại benefit là bắt buộc.',
                    maxLength: {
                      value: 50,
                      message: 'Loại benefit tối đa 50 ký tự.',
                    },
                  })}
                />
                {errors.benefitType ? (
                  <FieldDescription className="text-destructive">{errors.benefitType.message}</FieldDescription>
                ) : null}
              </Field>

              <Field orientation="vertical">
                <FieldLabel>Giá trị benefit</FieldLabel>
                <Textarea
                  placeholder="Giá trị mô tả thêm (không bắt buộc)"
                  rows={3}
                  {...register('benefitValue')}
                />
                <FieldDescription>Có thể bỏ trống nếu không cần.</FieldDescription>
              </Field>

              <Field orientation="vertical">
                <FieldLabel>Sort order</FieldLabel>
                <Input
                  type="number"
                  step="1"
                  placeholder="0"
                  {...register('sortOrder', {
                    required: 'Sort order là bắt buộc.',
                    validate: (value) => {
                      const parsed = Number(value)
                      if (value === '' || Number.isNaN(parsed)) {
                        return 'Sort order không hợp lệ.'
                      }

                      if (!Number.isInteger(parsed)) {
                        return 'Sort order phải là số nguyên.'
                      }

                      return true
                    },
                  })}
                />
                {errors.sortOrder ? (
                  <FieldDescription className="text-destructive">{errors.sortOrder.message}</FieldDescription>
                ) : (
                  <FieldDescription>Danh sách sẽ sắp xếp theo sort order tăng dần.</FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
