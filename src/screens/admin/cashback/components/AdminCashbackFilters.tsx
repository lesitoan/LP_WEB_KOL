'use client'

import type { AdminCashbackTab } from '../hooks/useAdminCashbackFiltersState'
import { AdminCashbackConfigFilters } from './AdminCashbackConfigFilters'
import { AdminCashbackCycleFilters } from './AdminCashbackCycleFilters'
import { AdminCashbackPayoutFilters } from './AdminCashbackPayoutFilters'
import type { AdminCashbackTabFilterProps } from './filterTypes'

type AdminCashbackFiltersProps = AdminCashbackTabFilterProps & {
  tab: AdminCashbackTab
}

export function AdminCashbackFilters({ tab, query, isFetching, onQueryChange }: AdminCashbackFiltersProps) {
  if (tab === 'configs') {
    return <AdminCashbackConfigFilters query={query} isFetching={isFetching} onQueryChange={onQueryChange} />
  }

  if (tab === 'cycles') {
    return <AdminCashbackCycleFilters query={query} isFetching={isFetching} onQueryChange={onQueryChange} />
  }

  return <AdminCashbackPayoutFilters query={query} isFetching={isFetching} onQueryChange={onQueryChange} />
}
