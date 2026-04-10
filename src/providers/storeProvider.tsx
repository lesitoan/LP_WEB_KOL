'use client'

import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/stores/store'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => {
    return makeStore()
  }, [])

  return <Provider store={store}>{children}</Provider>
}
