"use client"

import React from 'react'
import TierConfigSection from '../../../components/skeletons/admin/distribution/TierConfigSection'
import NewsTypeTable from './components/NewsTypeTable'
import { DistributionSkeleton } from '../../../components/skeletons/admin/distribution/DistributionSkeleton'
import { useDistributionConfigActions } from './hooks/useDistributionConfigActions'
import { useDistributionConfigData } from './hooks/useDistributionConfigData'
import { useDistributionConfigDraft } from './hooks/useDistributionConfigDraft'

export default function AdminDistributionScreen() {
  const data = useDistributionConfigData()
  const draftState = useDistributionConfigDraft(data.mappedDraft)
  const actions = useDistributionConfigActions({
    onSaved: draftState.replaceDraft,
  })

  const isSaving = actions.isSaving
  const draft = draftState.draft

  if (data.isError) {
    return (
      <div className="rounded-2xl border border-[#282828] bg-[#171717] p-8 text-center">
        <h1 className="text-xl font-semibold text-white">Không thể tải cấu hình phân phối</h1>
        <p className="mt-2 text-sm text-[#A8A8A9]">Vui lòng thử lại sau hoặc kiểm tra quyền truy cập.</p>
      </div>
    )
  }

  if (data.isLoading || !draft) {
    return <DistributionSkeleton />
  }

  return (
    <div className="space-y-6">
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
            onClick={draftState.resetDraft}
            disabled={!draftState.dirty || isSaving}
            className="h-9 px-4 bg-[#FDFDFD] rounded-lg text-sm font-semibold text-black hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Khôi phục mặc định
          </button>
          <button
            type="button"
            onClick={() => actions.handleSave(draftState.updateBody)}
            disabled={!draftState.dirty || isSaving}
            className="h-9 px-4 bg-[#F7F0A1] rounded-lg text-sm font-semibold text-black hover:bg-[#e8e09c] disabled:cursor-not-allowed disabled:opacity-50 transition-colors inline-flex items-center gap-2"
          >
            <img src="/images/admin/distribution/check_icon.svg" alt="" className="w-5 h-5 shrink-0" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <TierConfigSection
        tiers={draft.tiers}
        disabled={isSaving}
        onOffsetChange={draftState.handleOffsetChange}
      />

      <div className="flex flex-col">
        <h2 className="text-xl font-medium text-white leading-[30px]">Loại tin x tier</h2>
        <p className="text-sm font-normal text-[#828283] leading-[21px]">
          Offset = số phút trễ so với giờ chuẩn. Sửa 1 lần, áp dụng cho mọi loại tin của tier đó.
        </p>
      </div>

      <NewsTypeTable
        tiers={draft.tiers}
        categories={draft.categories}
        toggles={draft.toggles}
        disabled={isSaving}
        onToggle={draftState.handleToggle}
      />
    </div>
  )
}
