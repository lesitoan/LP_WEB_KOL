"use client"

import React, { useState } from 'react'
import TierConfigSection from './components/TierConfigSection'
import NewsTypeTable from './components/NewsTypeTable'
import { TIERS, NEWS_CATEGORIES, type TierId, type TierConfig } from './constants'

// Build initial toggle state from constants
function buildInitialToggles() {
  const state: Record<string, Record<TierId, boolean>> = {}
  for (const cat of NEWS_CATEGORIES) {
    for (const item of cat.items) {
      state[item.id] = { ...item.enabled }
    }
  }
  return state
}

export default function AdminDistributionScreen() {
  const [tiers, setTiers] = useState<TierConfig[]>(TIERS.map((t) => ({ ...t })))
  const [toggles, setToggles] = useState(buildInitialToggles)
  const [dirty, setDirty] = useState(false)

  function handleOffsetChange(tierId: TierId, delta: number) {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? { ...t, offsetMinutes: Math.max(0, t.offsetMinutes + delta) }
          : t,
      ),
    )
    setDirty(true)
  }

  function handleToggle(rowId: string, tierId: TierId, value: boolean) {
    setToggles((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [tierId]: value },
    }))
    setDirty(true)
  }

  function handleReset() {
    setTiers(TIERS.map((t) => ({ ...t })))
    setToggles(buildInitialToggles())
    setDirty(false)
  }

  function handleSave() {
    // TODO: wire API
    setDirty(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium text-white leading-[31.2px]">Cấu hình phân phối</h1>
          <p className="text-sm font-normal text-[#828283] leading-[21px] mt-1">
            Định nghĩa offset thời gian + hoa hồng theo tier, và bật/tắt loại tin từng tier nhận
          </p>
        </div>

        <div className="self-end flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="h-9 px-4 bg-[#FDFDFD] rounded-lg text-sm font-semibold text-black hover:bg-white/80 transition-colors"
          >
            Khôi phục mặc định
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-4 bg-[#F7F0A1] rounded-lg text-sm font-semibold text-black hover:bg-[#e8e09c] transition-colors inline-flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10.5l4.5 4.5 7.5-9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Tier Cards */}
      <TierConfigSection tiers={tiers} onOffsetChange={handleOffsetChange} />

      {/* Section title */}
      <div className="flex flex-col">
        <h2 className="text-xl font-medium text-white leading-[30px]">Loại tin × tier</h2>
        <p className="text-sm font-normal text-[#828283] leading-[21px]">
          Offset = số phút trễ so với giờ chuẩn. Sửa 1 lần, áp dụng cho mọi loại tin của tier đó.
        </p>
      </div>

      {/* News Type × Tier Table */}
      <NewsTypeTable toggles={toggles} onToggle={handleToggle} />
    </div>
  )
}
