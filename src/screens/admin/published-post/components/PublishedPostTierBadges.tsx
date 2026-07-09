"use client";

import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { PublishedPostTier } from '../constants'

interface PublishedPostTierBadgesProps {
  tiers: PublishedPostTier[]
  fallbackLabel?: string
  className?: string
  iconClassName?: string
}

const TIER_ICON_BY_CODE: Record<string, string> = {
  STARTER: '/images/tier_icons/STARTER_icon_active.svg',
  PARTNER: '/images/tier_icons/PARTNER_icon_active.svg',
  ELITE: '/images/tier_icons/ELITE_icon_active.svg',
  LEGEND: '/images/tier_icons/LEGEND_icon_active.svg',
}

function getTierIconSrc(code: string) {
  return TIER_ICON_BY_CODE[code] ?? `/images/tier_icons/${code}_icon_active.svg`
}

function getTierTooltipText(tier: PublishedPostTier) {
  return [
    tier.name || tier.code,
    `Code: ${tier.code}`,
    tier.scheduledAtLabel ? `Giờ nhận: ${tier.scheduledAtLabel}` : null,
    typeof tier.recipientCount === 'number' ? `Người nhận: ${tier.recipientCount.toLocaleString('vi-VN')}` : null,
    tier.status ? `Trạng thái: ${tier.status}` : null,
  ].filter(Boolean)
}

export default function PublishedPostTierBadges({
  tiers,
  fallbackLabel = '---',
  className,
  iconClassName,
}: PublishedPostTierBadgesProps) {
  if (tiers.length === 0) {
    return <span className="text-sm font-normal text-white">{fallbackLabel}</span>
  }

  return (
    <TooltipProvider delayDuration={120}>
      <div className={cn('flex items-center py-1', className)} aria-label={fallbackLabel}>
        {tiers.map((tier, index) => {
          const tooltipLines = getTierTooltipText(tier)
          const fanCenter = (tiers.length - 1) / 2
          const fanOffset = index - fanCenter

          return (
            <Tooltip key={tier.code}>
              <TooltipTrigger asChild>
                <span
                  tabIndex={0}
                  style={{
                    marginLeft: index === 0 ? 0 : -10,
                    transform: `translateY(${Math.abs(fanOffset) * 1.5}px) rotate(${fanOffset * 7}deg)`,
                    zIndex: index + 1,
                  }}
                  className={cn(
                    'relative grid h-8 w-8 shrink-0 cursor-help place-items-center rounded-full border border-[#545454] bg-[#282828] shadow-[0_4px_12px_rgba(0,0,0,0.28)] transition-colors hover:border-[#F7F0A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F0A1]/70',
                    iconClassName,
                  )}
                >
                  <img src={getTierIconSrc(tier.code)} alt={tier.name || tier.code} className="h-5 w-5 object-contain" />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="max-w-[240px] border-[#545454] bg-[#171717] px-3 py-2 text-xs leading-5 text-white shadow-xl"
              >
                <div className="space-y-0.5">
                  {tooltipLines.map((line, index) => (
                    <p key={`${tier.code}-${index}`} className={index === 0 ? 'font-semibold text-[#F7F0A1]' : 'text-[#D7D8D9]'}>
                      {line}
                    </p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
