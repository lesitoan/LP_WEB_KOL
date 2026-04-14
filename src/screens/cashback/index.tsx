'use client'

import { useSearchParams } from 'next/navigation'
import { ConfigsTab } from './components/configs/configsTab'
import { CyclesTab } from './components/cycles/cyclesTab'
import { PayoutsTab } from './components/payouts/payoutsTab'
import { SettingTab } from './components/setting/settingTab'
import { SummaryTab } from './components/summary/summaryTab'

type CashbackTab = 'setting' | 'summary' | 'configs' | 'cycles' | 'payouts'

function parseTab(value: string | null): CashbackTab {
  if (value === 'summary' || value === 'configs' || value === 'cycles' || value === 'payouts') {
    return value
  }

  return 'setting'
}

export default function CashbackScreen() {
  const searchParams = useSearchParams()
  const activeTab = parseTab(searchParams.get('tab'))

  return (
    <div className="space-y-6">
      {activeTab === 'setting' && <SettingTab />}
      {activeTab === 'summary' && <SummaryTab />}
      {activeTab === 'configs' && <ConfigsTab />}
      {activeTab === 'cycles' && <CyclesTab />}
      {activeTab === 'payouts' && <PayoutsTab />}
    </div>
  )
}
