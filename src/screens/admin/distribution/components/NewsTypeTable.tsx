"use client"

import React from 'react'
import { Switch } from '@/components/ui/switch'
import { TABLE_TIER_ICONS, type NewsCategory, type TierConfig, type TierId } from '../constants'

interface NewsTypeTableProps {
  tiers: TierConfig[]
  categories: NewsCategory[]
  toggles: Record<string, Record<TierId, boolean>>
  onToggle: (rowId: string, tierId: TierId, value: boolean) => void
  disabled?: boolean
}

export default function NewsTypeTable({ tiers, categories, toggles, onToggle, disabled }: NewsTypeTableProps) {
  return (
    <div className="bg-[#171717] rounded-xl sm:rounded-2xl p-3 sm:p-6 flex flex-col max-h-[calc(100vh-360px)] min-h-[250px] overflow-hidden">
      {/* Scroll container without top padding so sticky top-0 sits flush at the very top */}
      <div className="flex-1 min-h-0 overflow-auto pr-1 sm:pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="min-w-[600px] sm:min-w-[680px] flex flex-col">
          {/* Table header - Sticky flush at top-0 with solid background */}
          <div className="sticky top-0 z-20 bg-[#171717] pt-1 pb-3 sm:pb-4 grid grid-cols-[minmax(150px,1.4fr)_repeat(4,minmax(92px,1fr))] sm:grid-cols-[minmax(200px,1.5fr)_repeat(4,minmax(110px,1fr))] border-b border-[#282828] shrink-0">
            <div className="text-xs font-normal text-[#A8A8A9] flex items-center">Loại tin</div>
            {tiers.map((tier) => (
              <div key={tier.id} className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1">
                  <img
                    src={TABLE_TIER_ICONS[tier.id]}
                    alt={tier.label}
                    width={16}
                    height={16}
                    className="shrink-0 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <span className="text-xs font-medium text-[#A8A8A9]">{tier.label}</span>
                </div>
                <span className="text-xs font-normal text-[#A8A8A9]">({tier.range} TV · {tier.commission}%)</span>
              </div>
            ))}
          </div>

          {/* Rows body */}
          <div className="flex flex-col gap-0">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col">
                {/* Category label row */}
                <div className="grid grid-cols-[minmax(150px,1.4fr)_repeat(4,minmax(92px,1fr))] sm:grid-cols-[minmax(200px,1.5fr)_repeat(4,minmax(110px,1fr))] py-2.5 sm:py-3 border-b border-[#282828]">
                  <div className="text-sm font-semibold text-[#DAA440]">{cat.label}</div>
                  {tiers.map((t) => <div key={t.id} />)}
                </div>

                {/* Item rows */}
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[minmax(150px,1.4fr)_repeat(4,minmax(92px,1fr))] sm:grid-cols-[minmax(200px,1.5fr)_repeat(4,minmax(110px,1fr))] py-3 sm:py-4 border-b border-[#282828] last:border-b-0 items-center hover:bg-[#202020]/50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-normal text-white">{item.name}</span>
                      <span className="text-xs sm:text-sm font-normal text-[#A8A8A9]">{item.subtext}</span>
                    </div>
                    {tiers.map((tier) => (
                      <div key={tier.id} className="flex justify-start items-center">
                        <Switch
                          checked={toggles[item.id]?.[tier.id] ?? item.enabled[tier.id]}
                          disabled={disabled}
                          onCheckedChange={(v) => onToggle(item.id, tier.id, v)}
                          className="w-[38px] h-6 data-[state=checked]:!bg-[#12B76A] data-[state=unchecked]:!bg-[#828283] p-[2px] [&_[data-slot=switch-thumb]]:!bg-white [&_[data-slot=switch-thumb]]:!size-5 [&_[data-slot=switch-thumb]]:data-[state=checked]:!translate-x-[14px] [&_[data-slot=switch-thumb]]:data-[state=unchecked]:!translate-x-0 transition-colors cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
