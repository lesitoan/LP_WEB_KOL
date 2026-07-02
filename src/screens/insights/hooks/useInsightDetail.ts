import { useMemo } from 'react'

import { useGetKolInsightDetailQuery } from '@/services/api/kolInsightsApi'
import { buildInsightDetailView } from '../utils'

export function useInsightDetail(insightId: string | null) {
  const detailQuery = useGetKolInsightDetailQuery(insightId ?? '', {
    skip: !insightId,
  })

  const detail = useMemo(
    () => (detailQuery.data ? buildInsightDetailView(detailQuery.data) : null),
    [detailQuery.data],
  )

  return {
    detailQuery,
    detail,
    isLoading: detailQuery.isLoading || detailQuery.isFetching,
  }
}
