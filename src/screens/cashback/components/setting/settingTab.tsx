'use client'

import { useState } from 'react'
import CashbackHeader from '../CashbackHeader'
import { CashbackItem } from '../CashbackItem'
import { CashbackSummary } from '../CashbackSummary'
import { groups } from '../cashback-data'

export function SettingTab() {
  const [rates, setRates] = useState<Record<string, number>>({
    'Group Vàng': 25,
    'Group Bạc': 15,
    'Group Đồng': 10,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="animate-fade-in">
      <CashbackHeader saved={saved} onSave={handleSave} />

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <CashbackItem
            key={group.name}
            group={group}
            rate={rates[group.name]}
            onRateChange={(value) => setRates((prev) => ({ ...prev, [group.name]: value }))}
          />
        ))}
      </div>

      <CashbackSummary rates={rates} />
    </div>
  )
}
