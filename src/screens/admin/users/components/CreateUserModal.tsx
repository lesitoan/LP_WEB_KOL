"use client"

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import type { AdminUserFormValues } from '../hooks/useAdminUsersActions'
import type { AdminUserRow, AdminRole } from '../constants'

const ROLES: AdminRole[] = ['Admin GFI', 'Admin duyệt bài', 'Admin SCEX']

interface CreateUserModalProps {
  onClose: () => void
  onSubmit: (values: AdminUserFormValues, editUser?: AdminUserRow | null) => void
  editUser?: AdminUserRow | null
  isSaving?: boolean
}

export default function CreateUserModal({
  onClose,
  onSubmit,
  editUser,
  isSaving = false,
}: CreateUserModalProps) {
  const isEdit = Boolean(editUser)
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AdminUserFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: editUser?.name ?? '',
      role: editUser?.role ?? 'Admin GFI',
      email: editUser?.email ?? '',
      passwordMode: 'manual',
      password: '',
    },
  })

  const passwordMode = watch('passwordMode')

  useEffect(() => {
    reset({
      fullName: editUser?.name ?? '',
      role: editUser?.role ?? 'Admin GFI',
      email: editUser?.email ?? '',
      passwordMode: 'manual',
      password: '',
    })
  }, [editUser, reset])

  const submitForm = (values: AdminUserFormValues) => {
    if (isSaving) return
    onSubmit(values, editUser)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose()
      }}
    >
      <div className="w-full max-w-[570px] bg-[#171717] border border-[#282828] rounded-2xl p-6 flex flex-col max-h-full gap-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/admin/users/create-user-icon.svg" alt="" width={24} height={24} aria-hidden="true" />
            <h2 className="text-[18px] font-medium text-white leading-[30px]">
              {isEdit ? 'Sửa quyền admin' : 'Tạo tài khoản admin'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-9 h-9 flex items-center justify-center bg-[#282828] rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Đóng"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" stroke="#FDFDFD" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="w-full h-px bg-[#282828]" />

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col flex-1 min-h-0 overflow-hidden gap-4" noValidate>
          <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin-brand flex flex-col gap-4 py-0.5">
            <Field>
              <FieldLabel className="text-sm font-medium text-white">
                Tên admin <span className="text-[#EB4E40]">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="fullName"
                rules={{
                  validate: (value) => value.trim().length > 0 || 'Vui lòng nhập tên admin.',
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Nhập tên admin"
                    disabled={isSaving}
                    aria-invalid={Boolean(errors.fullName)}
                    className={cn(
                      "h-[52px] bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0",
                      errors.fullName && "border-[#EB4E40] focus-visible:border-[#EB4E40]",
                    )}
                  />
                )}
              />
              <FieldError className="text-xs text-[#EB4E40]" errors={[errors.fullName]} />
            </Field>

            <Field>
              <FieldLabel className="text-sm font-medium text-white">
                Vai trò <span className="text-[#EB4E40]">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="role"
                rules={{ required: 'Vui lòng chọn vai trò.' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSaving}>
                    <SelectTrigger
                      aria-invalid={Boolean(errors.role)}
                      className={cn(
                        "h-[52px] w-full bg-[#282828] border-[#282828] text-white focus:ring-0 focus:border-[#545454]",
                        errors.role && "border-[#EB4E40] focus:border-[#EB4E40]",
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[10002] bg-[#282828] border-[#3a3a3a] text-white">
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="focus:bg-[#3a3a3a] focus:text-white">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError className="text-xs text-[#EB4E40]" errors={[errors.role]} />
            </Field>

            <Field>
              <FieldLabel className="text-sm font-medium text-white">
                Email <span className="text-[#EB4E40]">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="email"
                rules={{
                  validate: (value) => {
                    const normalized = value.trim()
                    if (!normalized) return 'Vui lòng nhập email.'
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || 'Email không hợp lệ.'
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="admin@scex.io"
                    disabled={isSaving}
                    aria-invalid={Boolean(errors.email)}
                    className={cn(
                      "h-[52px] bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0",
                      errors.email && "border-[#EB4E40] focus-visible:border-[#EB4E40]",
                    )}
                  />
                )}
              />
              <FieldError className="text-xs text-[#EB4E40]" errors={[errors.email]} />
            </Field>

            {!isEdit && (
              <Field>
                <FieldLabel className="text-sm font-medium text-white">
                  Mật khẩu <span className="text-[#EB4E40]">*</span>
                </FieldLabel>
                <div className="flex flex-col sm:flex-row gap-2">
                  {(['auto', 'manual'] as const).map((mode) => (
                    <Controller
                      key={mode}
                      control={control}
                      name="passwordMode"
                      render={({ field }) => (
                        <label className="flex-1 flex items-center justify-between px-4 py-3 border border-[#282828] rounded-lg cursor-pointer hover:border-[#545454] transition-colors min-w-0">
                          <span className="text-sm text-white whitespace-nowrap">
                            {mode === 'auto' ? 'Tự động gen mật khẩu' : 'Nhập mật khẩu thủ công'}
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                              field.value === mode ? 'border-[#F7F0A1]' : 'border-[#545454]'
                            }`}
                          >
                            {field.value === mode && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#F7F0A1]" />
                            )}
                          </span>
                          <input
                            type="radio"
                            name={field.name}
                            value={mode}
                            checked={field.value === mode}
                            onChange={() => field.onChange(mode)}
                            disabled={isSaving}
                            className="sr-only"
                          />
                        </label>
                      )}
                    />
                  ))}
                </div>

                {passwordMode === 'manual' && (
                  <>
                    <Controller
                      control={control}
                      name="password"
                      rules={{
                        validate: (value) => {
                          if (passwordMode !== 'manual') return true
                          if (!value) return 'Vui lòng nhập mật khẩu.'
                          if (value.length < 8) return 'Mật khẩu tối thiểu 8 ký tự.'
                          if (value.length > 72) return 'Mật khẩu tối đa 72 ký tự.'
                          return true
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="password"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Nhập mật khẩu"
                          disabled={isSaving}
                          aria-invalid={Boolean(errors.password)}
                          className={cn(
                            "h-[52px] bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0 mt-1",
                            errors.password && "border-[#EB4E40] focus-visible:border-[#EB4E40]",
                          )}
                        />
                      )}
                    />
                    <FieldError className="text-xs text-[#EB4E40]" errors={[errors.password]} />
                  </>
                )}
              </Field>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#282828] shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-10 px-5 rounded-lg border border-[#545454] text-sm font-semibold text-white hover:bg-[#282828] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-5 rounded-lg bg-[#F7F0A1] text-sm font-semibold text-black hover:bg-[#e8e09c] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
