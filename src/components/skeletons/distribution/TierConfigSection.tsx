"use client"

import React from 'react'
import type { TierConfig, TierId } from '../../../screens/admin/distribution/constants'
import TierCard from '../../../screens/admin/distribution/components/TierCard'

interface TierConfigSectionProps {
  tiers: TierConfig[]
  onOffsetChange: (tierId: TierId, delta: number) => void
  disabled?: boolean
}

export default function TierConfigSection({ tiers, onOffsetChange, disabled }: TierConfigSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {tiers.map((tier) => (
        <TierCard
          key={tier.id}
          tier={tier}
          disabled={disabled}
          onOffsetChange={(delta) => onOffsetChange(tier.id, delta)}
        />
      ))}
    </div>
  )
}
