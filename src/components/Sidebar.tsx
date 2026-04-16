'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGetCurrentUserQuery } from '@/services/api/authApi'
import { Skeleton } from './ui/skeleton'

const navSections = [
  {
    label: 'Vận hành',
    items: [
      { id: 'home', label: 'Tổng quan', icon: 'home' },
      { id: 'members', label: 'Cộng đồng', icon: 'users', badge: '742' },
      { id: 'groups', label: 'Groups', icon: 'layers' },
    ],
  },
  {
    label: 'Doanh thu',
    items: [
      { id: 'cashback', label: 'Cashback', icon: 'dollar' },
      { id: 'campaign', label: 'Chiến dịch', icon: 'trophy', badge: '1', badgeAlert: true },
    ],
  },
  {
    label: 'Phát triển',
    items: [
      { id: 'tier', label: 'Tier & Tín hiệu', icon: 'star' },
      { id: 'analytics', label: 'Phân tích', icon: 'chart' },
    ],
  },
  {
    label: 'Hệ thống',
    items: [{ id: 'settings', label: 'Cài đặt', icon: 'settings' }],
  },
]

const icons: Record<string, JSX.Element> = {
  home: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" />
    </svg>
  ),
  users: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <circle cx="9" cy="8" r="4" /><path d="M3 21v-1a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v1" /><circle cx="17" cy="9" r="3" /><path d="M21 19v-1a4 4 0 0 0-3-3.87" />
    </svg>
  ),
  layers: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </svg>
  ),
  dollar: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3H9.5a1.5 1.5 0 0 0 0 3H14" />
    </svg>
  ),
  trophy: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="M8 21h8M12 17v4M6 4h12v6a6 6 0 0 1-12 0V4z" /><path d="M6 6H4a2 2 0 0 0 0 4h2M18 6h2a2 2 0 0 1 0 4h-2" />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5L12 16l-5.5 3.5L8 13 3 8.5 9.5 8z" />
    </svg>
  ),
  chart: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="M3 12h4l3-9 4 18 3-9h4" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  file: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  refresh: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="M3 2v6h6" />
      <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
      <path d="M21 22v-6h-6" />
      <path d="M3 12a9 9 0 0 0 15 6.7L21 16" />
    </svg>
  ),
  wallet: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z" />
      <path d="M16 12h5" />
      <path d="M16 9v6" />
    </svg>
  ),
}

const screenPaths: Record<string, string> = {
  home: '/dashboard',
  members: '/members',
  groups: '/groups',
  cashback: '/cashback',
  campaign: '/campaign',
  tier: '/tier',
  analytics: '/analytics',
  settings: '/settings',
}

const cashbackSubItems = [
  // { title: 'Setting', href: '/cashback?tab=setting', tab: 'setting', icon: 'dollar' },
  { title: 'Summary', href: '/cashback?tab=summary', tab: 'summary', icon: 'file' },
  { title: 'Configs', href: '/cashback?tab=configs', tab: 'configs', icon: 'settings' },
  { title: 'Cycles', href: '/cashback?tab=cycles', tab: 'cycles', icon: 'refresh' },
  { title: 'Payouts', href: '/cashback?tab=payouts', tab: 'payouts', icon: 'wallet' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: user, isLoading } = useGetCurrentUserQuery()

  const activeCashbackTab = searchParams.get('tab') || 'setting'
  const [isCashbackOpen, setIsCashbackOpen] = useState(pathname === '/cashback')

  useEffect(() => {
    if (pathname === '/cashback') {
      setIsCashbackOpen(true)
    }
  }, [pathname])

  const getIsActive = (id: string) => {
    const path = screenPaths[id]
    if (!path) return false
    if (id === 'groups') return pathname.startsWith('/groups')
    return pathname === path
  }

  const handleNavigate = (id: string) => {
    const path = screenPaths[id]
    if (!path) return
    router.push(path)
  }

  return (
    <aside className="bg-surface-1 border-r border-border flex h-dvh min-h-dvh flex-col py-5 w-[232px] shrink-0 overflow-y-auto">
      <div className="px-5 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-brand to-brand-dim grid place-items-center text-primary-foreground font-bold text-sm shadow-[0_0_16px_hsl(var(--brand-glow))]">
          LP
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Manager</div>
          <div className="text-[10px] text-muted-foreground font-normal tracking-widest uppercase">by GFI x LPex</div>
        </div>
      </div>

      <nav className="px-3 flex-1">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="text-[10px] font-semibold text-muted-foreground tracking-[0.08em] uppercase px-3 pt-3 pb-2 first:pt-0">
              {section.label}
            </div>

            {section.items.map((item: any) => {
              if (item.id === 'cashback') {
                const isCashbackActive = pathname === '/cashback'

                return (
                  <div key={item.id} className="mb-[1px]">
                    <button
                      type="button"
                      onClick={() => setIsCashbackOpen((prev) => !prev)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground transition-all relative',
                        'hover:bg-surface-2 hover:text-foreground',
                        isCashbackActive && 'bg-surface-3 text-foreground',
                      )}
                    >
                      {isCashbackActive && (
                        <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-brand rounded-r" />
                      )}
                      {icons[item.icon]}
                      {item.label}
                      <svg
                        className={cn('w-4 h-4 ml-auto transition-transform', isCashbackOpen && 'rotate-180')}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {isCashbackOpen && (
                      <div className="ml-5 mt-1 border-l border-border pl-2">
                        {cashbackSubItems.map((subItem) => {
                          const isActive = pathname === '/cashback' && activeCashbackTab === subItem.tab
                          return (
                            <Link
                              key={subItem.tab}
                              href={subItem.href}
                              className={cn(
                                'flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] mb-[1px] transition-all',
                                isActive
                                  ? 'bg-[hsl(var(--brand)_/_0.18)] text-foreground'
                                  : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                              )}
                            >
                              {icons[subItem.icon]}
                              {subItem.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium text-muted-foreground mb-[1px] transition-all relative',
                    'hover:bg-surface-2 hover:text-foreground',
                    getIsActive(item.id) && 'bg-surface-3 text-foreground',
                  )}
                >
                  {getIsActive(item.id) && (
                    <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-brand rounded-r" />
                  )}
                  {icons[item.icon]}
                  {item.label}
                  {item.badge && (
                    <span
                      className={cn(
                        'ml-auto text-[10px] font-semibold px-1.5 py-[1px] rounded-full',
                        item.badgeAlert ? 'bg-danger text-foreground' : 'bg-surface-4 text-muted-foreground',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="px-5 pt-4 border-t border-border flex items-center gap-3">
        {isLoading ? (
          <>
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2 w-16 opacity-50" />
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5B544] to-[#F87171] grid place-items-center text-foreground font-semibold text-[13px]">
              {user?.name ? (
                user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              ) : '??'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{user?.name || 'Unknown User'}</div>
              <div className="text-[11px] text-brand flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5L12 16l-5.5 3.5L8 13 3 8.5 9.5 8z" />
                </svg>
                {user?.tier || 'Partner'}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
