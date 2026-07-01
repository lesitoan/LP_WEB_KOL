"use client"

import React from 'react'
import type { TierConfig } from '../constants'

interface TierCardProps {
  tier: TierConfig
  onOffsetChange: (delta: number) => void
  disabled?: boolean
}

const TIER_GRADIENT = 'linear-gradient(247deg, #FCF19D 9%, #DAA440 31%, #9F6728 65%)'

function formatOffset(minutes: number): string {
  if (minutes === 0) return 'Ngay'
  return `+${minutes}'`
}

export default function TierCard({ tier, onOffsetChange, disabled }: TierCardProps) {
  return (
    <div
      className="w-full h-full min-w-0 pt-4 rounded-2xl overflow-hidden flex flex-col justify-between gap-3 relative"
      style={{ background: TIER_GRADIENT }}
    >
      <div className="px-4 flex items-center gap-3">
        <img
          src={tier.icon}
          alt={tier.label}
          width={50}
          height={50}
          className="h-[50px] w-[50px] shrink-0 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white leading-[30px]">{tier.label}</span>
          <span className="text-sm italic font-normal text-white leading-[21px]">
            {tier.range} thành viên{typeof tier.kolCount === 'number' ? ` · ${tier.kolCount} KOL` : ''}
          </span>
        </div>
      </div>

      <div className="w-full px-4 py-4 bg-[#171717] rounded-t-2xl rounded-b-none flex flex-col gap-4 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-base font-normal text-[#D7D8D9] leading-6">Trễ (offset)</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onOffsetChange(-5)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#545454] hover:border-[#828283] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              aria-label="Giảm offset"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10" stroke="#FDFDFD" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <span className="w-[42px] text-center text-base font-normal text-[#D7D8D9] leading-6 select-none">
              {formatOffset(tier.offsetMinutes)}
            </span>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onOffsetChange(5)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#545454] hover:border-[#828283] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              aria-label="Tăng offset"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="#FDFDFD" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
