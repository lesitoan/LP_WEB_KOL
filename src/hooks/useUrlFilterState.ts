'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type FilterValue = string
type FilterShape = Record<string, FilterValue>

type UseUrlFilterStateOptions<T extends FilterShape> = {
  initialValues: T
  debounceKeys?: Array<keyof T>
  debounceMs?: number
}

export function useUrlFilterState<T extends FilterShape>({
  initialValues,
  debounceKeys = [],
  debounceMs = 400,
}: UseUrlFilterStateOptions<T>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const keyList = useMemo(() => Object.keys(initialValues) as Array<keyof T>, [initialValues])
  const debounceKeySet = useMemo(() => new Set<keyof T>(debounceKeys), [debounceKeys])
  const searchParamsString = searchParams.toString()

  const parseFromUrl = () => {
    const next: FilterShape = { ...initialValues }

    for (const key of keyList) {
      const value = searchParams.get(String(key))
      next[String(key)] = value ?? initialValues[key]
    }

    return next as T
  }

  const initialParsed = useRef<T | null>(null)
  if (!initialParsed.current) {
    initialParsed.current = parseFromUrl()
  }

  const [values, setValues] = useState<T>(initialParsed.current)
  const [draftValues, setDraftValues] = useState<T>(initialParsed.current)

  const bootstrappedRef = useRef(false)
  useEffect(() => {
    if (bootstrappedRef.current) return
    bootstrappedRef.current = true
    const fromUrl = parseFromUrl()
    setValues(fromUrl)
    setDraftValues(fromUrl)
  }, [searchParams])

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParamsString)

    for (const key of keyList) {
      const value = values[key]
      if (!value) {
        currentParams.delete(String(key))
      } else {
        currentParams.set(String(key), value)
      }
    }

    const nextQuery = currentParams.toString()

    if (nextQuery === searchParamsString) {
      return
    }

    window.history.replaceState(null, '', nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [keyList, pathname, router, searchParamsString, values])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValues((prev) => {
        let changed = false
        const next = { ...prev }

        for (const key of keyList) {
          if (!debounceKeySet.has(key)) continue
          if (next[key] !== draftValues[key]) {
            next[key] = draftValues[key]
            changed = true
          }
        }

        return changed ? (next as T) : prev
      })
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [debounceKeySet, debounceMs, draftValues, keyList])

  const setFilter = (key: keyof T, value: string, options?: { immediate?: boolean }) => {
    setDraftValues((prev) => {
      if (prev[key] === value) return prev
      return { ...prev, [key]: value } as T
    })

    if (options?.immediate || !debounceKeySet.has(key)) {
      setValues((prev) => {
        if (prev[key] === value) return prev
        return { ...prev, [key]: value } as T
      })
    }
  }

  const setMany = (nextValues: Partial<T>, options?: { immediate?: boolean }) => {
    setDraftValues((prev) => {
      let changed = false
      const next = { ...prev }

      for (const [key, value] of Object.entries(nextValues)) {
        const typedKey = key as keyof T
        const typedValue = (value ?? '') as T[keyof T]
        if (next[typedKey] !== typedValue) {
          next[typedKey] = typedValue
          changed = true
        }
      }

      return changed ? (next as T) : prev
    })

    const shouldImmediate = options?.immediate
    if (shouldImmediate) {
      setValues((prev) => {
        let changed = false
        const next = { ...prev }

        for (const [key, value] of Object.entries(nextValues)) {
          const typedKey = key as keyof T
          const typedValue = (value ?? '') as T[keyof T]
          if (next[typedKey] !== typedValue) {
            next[typedKey] = typedValue
            changed = true
          }
        }

        return changed ? (next as T) : prev
      })
      return
    }

    const immediateKeys = Object.keys(nextValues).filter((key) => !debounceKeySet.has(key as keyof T))
    if (immediateKeys.length > 0) {
      setValues((prev) => {
        let changed = false
        const next = { ...prev }

        for (const key of immediateKeys) {
          const typedKey = key as keyof T
          const typedValue = ((nextValues as Record<string, string | undefined>)[key] ?? '') as T[keyof T]

          if (next[typedKey] !== typedValue) {
            next[typedKey] = typedValue
            changed = true
          }
        }

        return changed ? (next as T) : prev
      })
    }
  }

  const clearFilter = (key: keyof T, options?: { immediate?: boolean }) => setFilter(key, '', options)

  return {
    values,
    draftValues,
    setFilter,
    setMany,
    clearFilter,
  }
}
