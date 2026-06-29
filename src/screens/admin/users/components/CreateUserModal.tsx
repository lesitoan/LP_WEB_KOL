"use client"

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldLabel } from '@/components/ui/field'
import type { AdminUserRow, AdminRole } from '../constants'

const ROLES: AdminRole[] = ['Admin GFI', 'Admin duyệt bài', 'Admin SCEX']

interface CreateUserModalProps {
  onClose: () => void
  editUser?: AdminUserRow | null
}

export default function CreateUserModal({ onClose, editUser }: CreateUserModalProps) {
  const isEdit = Boolean(editUser)
  const [name, setName] = useState(editUser?.name ?? '')
  const [role, setRole] = useState<AdminRole>(editUser?.role ?? 'Admin GFI')
  const [username, setUsername] = useState(editUser?.email?.split('@')[0] ?? '')
  const [passwordMode, setPasswordMode] = useState<'auto' | 'manual'>('manual')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire API
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[570px] mx-4 bg-[#171717] border border-[#282828] rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">

        {/* Header */}
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
            className="w-9 h-9 flex items-center justify-center bg-[#282828] rounded-lg hover:bg-[#3a3a3a] transition-colors"
            aria-label="Đóng"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" stroke="#FDFDFD" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="w-full h-px bg-[#282828]" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Tên admin */}
          <Field>
            <FieldLabel className="text-sm font-medium text-white">
              Tên admin <span className="text-[#EB4E40]">*</span>
            </FieldLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên admin"
              required
              className="h-[52px] bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0"
            />
          </Field>

          {/* Vai trò */}
          <Field>
            <FieldLabel className="text-sm font-medium text-white">
              Vai trò <span className="text-[#EB4E40]">*</span>
            </FieldLabel>
            <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
              <SelectTrigger className="h-[52px] w-full bg-[#282828] border-[#282828] text-white focus:ring-0 focus:border-[#545454]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3a3a3a] text-white">
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="focus:bg-[#3a3a3a] focus:text-white">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Tên đăng nhập — chỉ hiện khi tạo mới */}
          {!isEdit && (
            <Field>
              <FieldLabel className="text-sm font-medium text-white">
                Tên đăng nhập <span className="text-[#EB4E40]">*</span>
              </FieldLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
                className="h-[52px] bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0"
              />
            </Field>
          )}

          {/* Mật khẩu — chỉ hiện khi tạo mới */}
          {!isEdit && (
            <Field>
              <FieldLabel className="text-sm font-medium text-white">
                Mật khẩu <span className="text-[#EB4E40]">*</span>
              </FieldLabel>
              {/* Radio toggle */}
              <div className="flex flex-col sm:flex-row gap-2">
                {(['auto', 'manual'] as const).map((mode) => (
                  <label
                    key={mode}
                    className="flex-1 flex items-center justify-between px-4 py-3 border border-[#282828] rounded-lg cursor-pointer hover:border-[#545454] transition-colors min-w-0"
                  >
                    <span className="text-sm text-white whitespace-nowrap">
                      {mode === 'auto' ? 'Tự động gen mật khẩu' : 'Nhập mật khẩu thủ công'}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                        passwordMode === mode ? 'border-[#F7F0A1]' : 'border-[#545454]'
                      }`}
                    >
                      {passwordMode === mode && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F7F0A1]" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name="passwordMode"
                      value={mode}
                      checked={passwordMode === mode}
                      onChange={() => setPasswordMode(mode)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
              {passwordMode === 'manual' && (
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="h-[52px] bg-[#121212] border-[#282828] text-white placeholder:text-[#828283] focus-visible:border-[#545454] focus-visible:ring-0 mt-1"
                />
              )}
            </Field>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-[#545454] text-sm font-semibold text-white hover:bg-[#282828] transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-[#F7F0A1] text-sm font-semibold text-black hover:bg-[#e8e09c] transition-colors"
            >
              {isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body)
}
