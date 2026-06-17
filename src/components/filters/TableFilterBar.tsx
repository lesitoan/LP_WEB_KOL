'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { Check, ChevronDown } from 'lucide-react'

export type FilterOption = {
  value: string
  label: string
}

export type SelectFilterConfig = {
  key: string
  label: string
  options: FilterOption[]
}

export type TextFilterConfig = {
  key: string
  placeholder: string
  widthClassName?: string
}

export type ActiveFilterChip = {
  key: string
  label: string
  valueLabel: string
}

type StatusBadge = {
  key: string
  label: string
  count: number
  tone?: 'warning' | 'info' | 'danger' | 'neutral'
}

type TableFilterBarProps = {
  textFilters: TextFilterConfig[]
  textValues: Record<string, string>
  selectFilters: SelectFilterConfig[]
  activeFilterChips: ActiveFilterChip[]
  statusBadges?: StatusBadge[]
  endContent?: ReactNode
  disabled?: boolean
  onTextChange: (key: string, value: string) => void
  onSelectFilter: (key: string, value: string) => void
  onRemoveChip: (key: string) => void
}

export default function TableFilterBar({
  textFilters,
  textValues,
  selectFilters,
  activeFilterChips,
  statusBadges = [],
  endContent,
  disabled = false,
  onTextChange,
  onSelectFilter,
  onRemoveChip,
}: TableFilterBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilterKey, setActiveFilterKey] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedValueByFilterKey = new Map(activeFilterChips.map((chip) => [chip.key, chip.valueLabel]))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(event.target as Node)) return

      setIsMenuOpen(false)
      setActiveFilterKey(null)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center gap-2 flex-wrap" ref={containerRef}>
        {textFilters.map((textFilter) => (
          <div
            key={textFilter.key}
            className={`h-[34px] bg-surface-2 border border-border rounded-lg px-3 flex items-center gap-2 text-sm font-normal text-muted-foreground ${
              textFilter.widthClassName ?? 'min-w-[220px] w-[320px]'
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className="bg-transparent w-full text-sm font-normal text-foreground outline-none placeholder:text-muted-foreground"
              value={textValues[textFilter.key] ?? ''}
              onChange={(event) => onTextChange(textFilter.key, event.target.value)}
              placeholder={textFilter.placeholder}
              aria-label={textFilter.placeholder}
              disabled={disabled}
            />
          </div>
        ))}

        {activeFilterChips.map((chip) => (
          <span
            key={chip.key}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-brand/35 bg-brand/15 text-[11.5px] font-medium text-brand"
          >
            {chip.label}: {chip.valueLabel}
            <button
              type="button"
              className="text-brand/70 hover:text-brand"
              onClick={() => onRemoveChip(chip.key)}
              disabled={disabled}
              aria-label={`Xóa lọc ${chip.label}`}
            >
              x
            </button>
          </span>
        ))}

        <div className="relative">
          <button
            type="button"
            className="inline-flex h-[34px] items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 text-sm font-normal text-foreground transition-colors hover:bg-surface-3 disabled:opacity-60"
            onClick={() => {
              setIsMenuOpen((prev) => !prev)
              setActiveFilterKey(null)
            }}
            disabled={disabled}
          >
            <Image src="/images/icons/filter_icon.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
            Bộ lọc
          </button>

          {isMenuOpen ? (
            <div className="absolute left-0 top-8 z-50 rounded-xl border border-border bg-surface-1 shadow-xl p-3 min-w-[260px] max-w-[min(92vw,360px)]">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Bộ lọc chính</div>
              <div className="space-y-1">
                {selectFilters.map((filter) => {
                  const isActive = filter.key === activeFilterKey
                  const selectedValueLabel = selectedValueByFilterKey.get(filter.key)
                  return (
                    <div key={filter.key} className="rounded-md">
                      <button
                        type="button"
                        className={`w-full text-left px-2.5 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-surface-3 text-foreground font-normal'
                            : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                        }`}
                        onClick={() => setActiveFilterKey((prev) => (prev === filter.key ? null : filter.key))}
                      >
                        <span>{filter.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                      </button>

                      {isActive ? (
                        <div className="mt-1 pl-2 border-l border-border/70 space-y-1">
                          {filter.options.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className="w-full text-left px-2.5 py-2 rounded-md text-sm text-foreground hover:bg-surface-2 transition-colors flex items-center justify-between gap-2"
                              onClick={() => {
                                onSelectFilter(filter.key, option.value)
                                setIsMenuOpen(false)
                                setActiveFilterKey(null)
                              }}
                            >
                              <span>{option.label}</span>
                              {selectedValueLabel === option.label ? <Check className="h-4 w-4 text-brand" /> : null}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>

        {statusBadges.length > 0 ? (
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            {statusBadges.map((badge) => {
              const toneClass =
                badge.tone === 'warning'
                  ? 'bg-warning/[0.12] text-warning'
                  : badge.tone === 'danger'
                    ? 'bg-destructive/[0.12] text-destructive'
                    : badge.tone === 'neutral'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-info/[0.12] text-info'

              return (
                <span
                  key={badge.key}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium ${toneClass}`}
                >
                  {badge.count} {badge.label}
                </span>
              )
            })}
          </div>
        ) : null}

        {endContent ? <div className="ml-auto shrink-0">{endContent}</div> : null}
      </div>
    </div>
  )
}
