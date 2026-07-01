"use client"

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Copy, X } from 'lucide-react'
import type { TemporaryPasswordInfo } from '../hooks/useAdminUsersActions'

interface TemporaryPasswordModalProps {
  info: TemporaryPasswordInfo
  onClose: () => void
}

export default function TemporaryPasswordModal({ info, onClose }: TemporaryPasswordModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(info.password)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[520px] mx-4 bg-[#171717] border border-[#282828] rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-medium text-white leading-[30px]">Mật khẩu tạm thời</h2>
            <p className="mt-1 text-sm text-[#A8A8A9]">Mật khẩu này chỉ hiển thị một lần sau khi tạo tài khoản.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#282828] text-[#FDFDFD] transition-colors hover:bg-[#333333]"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-px bg-[#282828]" />

        <div className="space-y-3">
          <div className="rounded-lg bg-[#282828]/50 p-4">
            <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Email admin</div>
            <div className="mt-1 break-all text-base font-semibold leading-6 text-white">{info.email}</div>
          </div>

          <div className="rounded-lg border border-[#545454] bg-[#121212] p-4">
            <div className="text-xs font-normal leading-[18px] text-[#A8A8A9]">Mật khẩu</div>
            <div className="mt-1 break-all font-mono text-base font-semibold leading-6 text-[#F7F0A1]">{info.password}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 max-sm:flex-col">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#545454] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#282828] max-sm:w-full"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Đã copy' : 'Copy mật khẩu'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg bg-[#F7F0A1] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#e8e09c] max-sm:w-full"
          >
            Đã lưu
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
