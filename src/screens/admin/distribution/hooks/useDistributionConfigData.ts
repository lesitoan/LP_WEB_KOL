import { useMemo } from 'react'
import { useGetAdminDistributionConfigQuery } from '@/services/api/admin/distributionConfigApi'
import { mapDistributionConfigToDraft } from '../constants'

export function useDistributionConfigData() {
  const query = useGetAdminDistributionConfigQuery()

  const mappedDraft = useMemo(
    () => (query.data ? mapDistributionConfigToDraft(query.data) : null),
    [query.data],
  )

  return {
    query,
    config: query.data ?? null,
    mappedDraft,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  }
}
