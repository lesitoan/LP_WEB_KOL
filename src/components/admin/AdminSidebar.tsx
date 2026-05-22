'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAdminAuthSession } from '@/hooks/admin/useAdminAuthSession'

type SidebarProps = {
  onItemClick?: () => void
}

const navSections = [
  {
    label: 'Vận hành',
    items: [
      { id: 'dashboard', label: 'Tổng quan', icon: 'home' },
      { id: 'members', label: 'Thành viên', icon: 'users' },
      { id: 'kols', label: 'KOLs', icon: 'star' },
      { id: 'activities', label: 'Hoạt động', icon: 'chart' },
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
}

const screenPaths: Record<string, string> = {
  dashboard: '/admin/dashboard',
  members: '/admin/members',
  kols: '/admin/kols',
  activities: '/admin/activities',
  settings: '/admin/settings',
}

export default function AdminSidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useAdminAuthSession()

  const getIsActive = (id: string) => {
    const path = screenPaths[id]
    if (!path) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <aside className="bg-surface-1 border-r border-border flex h-dvh min-h-dvh flex-col py-5 w-[232px] shrink-0 overflow-y-auto">
      <div className="px-5 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-brand to-brand-dim grid place-items-center text-primary-foreground font-bold text-sm shadow-[0_0_16px_hsl(var(--brand-glow))]">
          AD
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Admin Portal</div>
          <div className="text-[10px] text-muted-foreground font-normal tracking-widest uppercase">by GFI x LPex</div>
        </div>
      </div>

      <nav className="px-3 flex-1">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="text-[10px] font-semibold text-muted-foreground tracking-[0.08em] uppercase px-3 pt-3 pb-2 first:pt-0">
              {section.label}
            </div>

            {section.items.map((item) => (
              <Link
                key={item.id}
                href={screenPaths[item.id] || '#'}
                onClick={onItemClick}
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
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-5 pt-4 border-t border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5B544] to-[#F87171] grid place-items-center text-foreground font-semibold text-[13px]">
          {profile?.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium truncate">{profile?.name || 'Quản trị viên'}</div>
          <div className="text-[11px] text-brand flex items-center gap-1">{profile?.email || '—'}</div>
        </div>
      </div>
    </aside>
  )
}
