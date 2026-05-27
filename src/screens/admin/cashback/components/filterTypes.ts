import type { AdminCashbackQuery } from '../hooks/useAdminCashbackFiltersState'

export type AdminCashbackTabFilterProps = {
  query: AdminCashbackQuery
  isFetching: boolean
  onQueryChange: (query: AdminCashbackQuery) => void
}

export const optionLabel = (options: Array<{ value: string; label: string }>, value?: string) =>
  options.find((option) => option.value === value)?.label ?? value ?? ''
