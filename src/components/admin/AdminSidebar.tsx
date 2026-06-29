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
    label: 'Nội dung',
    items: [
      { id: 'post-review', label: 'Duyệt bài', icon: 'post-review' },
      { id: 'distribution', label: 'Cấu hình phân phối', icon: 'distribution' },
    ],
  },
  {
    label: 'Số liệu',
    items: [
      { id: 'analytics-kols', label: 'Phân tích KOL', icon: 'analytics-kol' },
      { id: 'analytics-content', label: 'Phân tích nội dung', icon: 'analytics-content' },
    ],
  },
  {
    label: 'Kiểm soát nội dung',
    items: [
      { id: 'published-post', label: 'Tin đã đăng', icon: 'published-post' },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { id: 'reviews', label: 'Giám sát admin duyệt bài', icon: 'review' },
      { id: 'users', label: 'Quản lý người dùng', icon: 'user' },
    ],
  },
]

const screenPaths: Record<string, string> = {
  'post-review': '/admin/post-review',
  'distribution': '/admin/distribution',
  'analytics-kols': '/admin/analytics/kols',
  'analytics-content': '/admin/analytics/content',
  'reviews': '/admin/reviews',
  'users': '/admin/users',
  'settings': '/admin/settings',
  'published-post': '/admin/published-post',
}

export default function AdminSidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname()
  const { profile, logout } = useAdminAuthSession()

  const getIsActive = (id: string) => {
    const path = screenPaths[id]
    if (!path) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <aside className="bg-surface-1 border-r border-border flex h-dvh min-h-dvh flex-col justify-between w-[250px] shrink-0 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#F7F0A1]/90">
      <div className="flex flex-col flex-1">
        {/* Brand Header */}
        <div className="h-[78px] px-4 flex items-center shrink-0">
          <img src="/images/Logo.png" alt="Logo" className="w-[121px] h-8 shrink-0" />
        </div>

        {/* Main Navigation */}
        <nav className="px-4 flex-1 space-y-4">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1">
              <div className="text-xs font-normal text-[#828283] uppercase px-0 pt-2 pb-1">
                {section.label}
              </div>

              {section.items.map((item) => {
                const isActive = getIsActive(item.id)
                const iconSrc = isActive
                  ? `/images/admin/side-bar/${item.icon}-icon-active.svg`
                  : `/images/admin/side-bar/${item.icon}-icon.svg`

                return (
                  <Link
                    key={item.id}
                    href={screenPaths[item.id] || '#'}
                    onClick={onItemClick}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal mb-[1px] transition-all relative',
                      isActive
                        ? 'bg-[#282828] text-white'
                        : 'text-[#828283] hover:bg-surface-2 hover:text-[#828283]',
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#CCB0F6] rounded-r" />
                    )}
                    <img src={iconSrc} alt={item.label} className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {/* {item.badge !== undefined && (
                      <span className="ml-auto text-[12px] font-normal px-2 py-0.5 rounded-full bg-[#282828] text-[#D7D8D9]">
                        {item.badge}
                      </span>
                    )} */}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Settings & User Profile Footer */}
      <div className="pt-4 pb-8 px-4 border-t border-[#282828] flex flex-col gap-4">
        {(() => {
          const isSettingsActive = getIsActive('settings')
          const settingsIconSrc = isSettingsActive
            ? '/images/admin/side-bar/setting-icon-active.svg'
            : '/images/admin/side-bar/setting-icon.svg'

          return (
            <Link
              href={screenPaths.settings}
              onClick={onItemClick}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal transition-all relative',
                isSettingsActive
                  ? 'bg-[#282828] text-white'
                  : 'text-[#828283] hover:bg-surface-2 hover:text-[#828283]',
              )}
            >
              {isSettingsActive && (
                <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#CCB0F6] rounded-r" />
              )}
              <img src={settingsIconSrc} alt="Cài đặt" className="w-5 h-5 shrink-0" />
              <span>Cài đặt</span>
            </Link>
          )
        })()}

        {/* Profile Card */}
        <div className="w-full p-2 bg-[#171717] rounded-full flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#9B692C] flex items-center justify-center text-white font-semibold text-sm">
              {profile?.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'OR'}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="text-sm font-semibold text-white truncate leading-tight">
                {profile?.name || 'Olivia Rhye'}
              </div>
              <div className="text-sm font-normal text-[#A8A8A9] truncate">
                {profile?.role || 'GFI Super Admin'}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => logout()}
            className="p-1 rounded-lg hover:bg-surface-2 transition-colors shrink-0 mr-1"
            title="Đăng xuất"
          >
            <svg className="w-5 h-5 text-[#828283]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
