'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { useAuthSession } from '@/hooks/useAuthSession'
import { usePopup } from '@/hooks/usePopup'
import { cn } from '@/lib/utils'

const navSections = [
  {
    label: 'Vận hành',
    items: [
      {
        id: 'home',
        label: 'Tổng quan',
        href: '/dashboard',
        icon: '/images/sidebar/home_icon.svg',
        activeIcon: '/images/sidebar/active/home_icon_active.svg',
      },
      {
        id: 'members',
        label: 'Cộng đồng',
        href: '/members',
        icon: '/images/sidebar/member_nav_icon.svg',
        activeIcon: '/images/sidebar/active/member_nav_icon_active.svg',
      },
      {
        id: 'insights',
        label: 'Insights',
        href: '/insights',
        icon: '/images/sidebar/insights_icon.svg',
        activeIcon: '/images/sidebar/active/insights_icon_active.svg',
      },
      {
        id: 'campaign',
        label: 'Chiến dịch',
        href: '/campaign',
        icon: '/images/sidebar/campaign_icon.svg',
        activeIcon: '/images/sidebar/active/campaign_icon_active.svg',
      },
    ],
  },
  {
    label: 'Phát triển',
    items: [
      {
        id: 'tier',
        label: 'Tier & Quyền lợi',
        href: '/tier',
        icon: '/images/sidebar/tier_nav_icon.svg',
        activeIcon: '/images/sidebar/active/tier_nav_icon_active.svg',
      },
      {
        id: 'analytics',
        label: 'Phân tích',
        href: '/analytics',
        icon: '/images/sidebar/analytics_icon.svg',
        activeIcon: '/images/sidebar/active/analytics_icon_active.svg',
      },
      {
        id: 'cashback',
        label: 'Cashback',
        href: '/cashback',
        icon: '/images/sidebar/cashback_icon.svg',
        activeIcon: '/images/sidebar/active/cashback_icon_active.svg',
      },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      {
        id: 'groups',
        label: 'Cài đặt nhóm',
        href: '/groups',
        icon: '/images/sidebar/group_icon.svg',
        activeIcon: '/images/sidebar/active/group_icon_active.svg',
      },
    ],
  },
]

type SidebarProps = {
  onItemClick?: () => void
}

function SidebarIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      aria-hidden="true"
      className="h-6 w-6 shrink-0 object-contain"
    />
  )
}

export default function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname()
  const { profile, logout } = useAuthSession()
  const { showConfirm, Popup } = usePopup()

  const handleLogout = async () => {
    const accepted = await showConfirm({
      title: 'Đăng xuất',
      description: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?',
      confirmText: 'Đăng xuất',
      cancelText: 'Hủy',
      destructive: true,
    })

    if (accepted) {
      logout()
    }
  }

  return (
    <>
    <aside className="flex h-full min-h-0 w-[232px] shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-4 py-5 text-foreground custom-scrollbar">
      <nav className="flex-1 space-y-8">
        {navSections.map((section) => (
          <section key={section.label} className="space-y-2">
            <div className="px-0 text-xs font-normal uppercase leading-none text-muted-foreground">
              {section.label}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.id === 'groups'
                    ? pathname.startsWith('/groups')
                    : pathname === item.href

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      'flex h-10 items-center gap-3 rounded-control px-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface-control text-white'
                        : 'text-muted-foreground hover:bg-surface-card hover:text-white',
                    )}
                  >
                    <SidebarIcon src={isActive ? item.activeIcon : item.icon} />
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/avatar_default.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full border border-brand/40 object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold leading-5 text-white">
              {profile?.name ?? 'Unknown User'}
            </div>
            <div className="truncate text-sm font-normal leading-4 text-muted-foreground">
              {profile?.email ?? '-'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-surface-control text-muted-foreground transition-colors hover:bg-surface-control-hover hover:text-white"
            aria-label="Đăng xuất"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
    <Popup />
    </>
  )
}
