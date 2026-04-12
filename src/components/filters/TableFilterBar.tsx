'use client'

import { useEffect, useRef, useState } from 'react'

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
  disabled = false,
  onTextChange,
  onSelectFilter,
  onRemoveChip,
}: TableFilterBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilterKey, setActiveFilterKey] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const activeFilter = selectFilters.find((filter) => filter.key === activeFilterKey) ?? null

  return (
    <div className="p-4 px-5 border-b border-border space-y-3">
      <div className="flex items-center gap-2 flex-wrap" ref={containerRef}>
        {textFilters.map((textFilter) => (
          <div
            key={textFilter.key}
            className={`h-[34px] bg-surface-2 border border-border rounded-lg px-3 flex items-center gap-2 text-[13px] text-muted-foreground ${
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
              className="bg-transparent w-full text-foreground outline-none placeholder:text-muted-foreground"
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
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[hsl(40_78%_55%/0.1)] border border-[hsl(40_78%_55%/0.25)] rounded-full text-[11.5px] font-medium text-brand"
          >
            {chip.label}: {chip.valueLabel}
            <button
              type="button"
              className="opacity-70 hover:opacity-100"
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
            className="text-xs text-muted-foreground px-2 py-1 hover:bg-surface-2 rounded disabled:opacity-60"
            onClick={() => {
              setIsMenuOpen((prev) => !prev)
              setActiveFilterKey(null)
            }}
            disabled={disabled}
          >
            + Bộ lọc
          </button>

          {isMenuOpen ? (
            <div
              className={`absolute left-0 top-8 z-50 rounded-xl border border-border bg-surface-1 shadow-xl p-3 flex gap-3 ${
                activeFilter ? 'min-w-[500px]' : 'min-w-[220px]'
              }`}
            >
              <div className={`${activeFilter ? 'w-[200px] border-r border-border pr-3' : 'w-[200px]'}`}>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Bộ lọc chính</div>
                <div className="space-y-1">
                  {selectFilters.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      className={`w-full text-left px-2.5 py-2 rounded-md text-sm transition-colors ${
                        filter.key === activeFilterKey
                          ? 'bg-surface-3 text-foreground font-medium'
                          : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                      }`}
                      onClick={() => setActiveFilterKey(filter.key)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilter ? (
                <div className="flex-1 min-w-[240px]">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">{activeFilter.label}</div>
                  <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                    {activeFilter.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="w-full text-left px-2.5 py-2 rounded-md text-sm text-foreground hover:bg-surface-2 transition-colors"
                        onClick={() => {
                          onSelectFilter(activeFilter.key, option.value)
                          setIsMenuOpen(false)
                          setActiveFilterKey(null)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
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
      </div>
    </div>
  )
}
