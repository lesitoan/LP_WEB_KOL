import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildDistributionUpdateBody,
  cloneDistributionDraft,
  type DistributionDraft,
  type TierId,
} from '../constants'

export function useDistributionConfigDraft(sourceDraft: DistributionDraft | null) {
  const [initialDraft, setInitialDraft] = useState<DistributionDraft | null>(null)
  const [draft, setDraft] = useState<DistributionDraft | null>(null)

  useEffect(() => {
    if (!sourceDraft) return

    setInitialDraft(cloneDistributionDraft(sourceDraft))
    setDraft(cloneDistributionDraft(sourceDraft))
  }, [sourceDraft])

  const updateBody = useMemo(() => {
    if (!initialDraft || !draft) return null
    return buildDistributionUpdateBody(initialDraft, draft)
  }, [draft, initialDraft])

  const handleOffsetChange = useCallback((tierId: TierId, delta: number) => {
    setDraft((current) => {
      if (!current) return current

      return {
        ...current,
        tiers: current.tiers.map((tier) =>
          tier.id === tierId
            ? { ...tier, offsetMinutes: Math.max(0, tier.offsetMinutes + delta) }
            : tier,
        ),
      }
    })
  }, [])

  const handleToggle = useCallback((rowId: string, tierId: TierId, value: boolean) => {
    setDraft((current) => {
      if (!current) return current

      return {
        ...current,
        toggles: {
          ...current.toggles,
          [rowId]: {
            ...current.toggles[rowId],
            [tierId]: value,
          },
        },
      }
    })
  }, [])

  const resetDraft = useCallback(() => {
    setDraft((current) => {
      if (!initialDraft) return current
      return cloneDistributionDraft(initialDraft)
    })
  }, [initialDraft])

  const replaceDraft = useCallback((nextDraft: DistributionDraft) => {
    setInitialDraft(cloneDistributionDraft(nextDraft))
    setDraft(cloneDistributionDraft(nextDraft))
  }, [])

  return {
    initialDraft,
    draft,
    updateBody,
    dirty: Boolean(updateBody),
    handleOffsetChange,
    handleToggle,
    resetDraft,
    replaceDraft,
  }
}
