import { useCallback, useEffect, useMemo } from 'react'

import { useUrlFilterState } from '@/hooks/useUrlFilterState'
import type { InsightTabId } from '@/types/insights'
import { isValidInsightTabId } from '../utils'

const INSIGHTS_URL_INITIAL_VALUES = {
  contentType: '',
}

export function useInsightsUrlState() {
  const { values, setFilter, clearFilter } = useUrlFilterState({
    initialValues: INSIGHTS_URL_INITIAL_VALUES,
  })

  const activeTab = useMemo<InsightTabId>(() => {
    if (!values.contentType) return 'ALL'
    return isValidInsightTabId(values.contentType) ? values.contentType : 'ALL'
  }, [values.contentType])

  useEffect(() => {
    if (values.contentType && !isValidInsightTabId(values.contentType)) {
      clearFilter('contentType', { immediate: true })
    }
  }, [clearFilter, values.contentType])

  const setActiveTab = useCallback((tab: InsightTabId) => {
    setFilter('contentType', tab === 'ALL' ? '' : tab, { immediate: true })
  }, [setFilter])

  return {
    activeTab,
    setActiveTab,
  }
}
