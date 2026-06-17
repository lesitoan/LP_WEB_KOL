'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { useAuthSession } from '@/hooks/useAuthSession'
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
        activeIcon: '/images/sidebar/avtive/home_icon_active.svg',
      },
      {
        id: 'members',
        label: 'Cộng đồng',
        href: '/members',
        icon: '/images/sidebar/member_nav_icon.svg',
        activeIcon: '/images/sidebar/avtive/member_nav_icon_active.svg',
      },
      {
        id: 'insights',
        label: 'Insights',
        href: '/insights',
        icon: '/images/sidebar/insights_icon.svg',
        activeIcon: '/images/sidebar/avtive/insights_icon_active.svg',
      },
      {
        id: 'campaign',
        label: 'Chiến dịch',
        href: '/campaign',
        icon: '/images/sidebar/campaign_icon.svg',
        activeIcon: '/images/sidebar/avtive/campaign_icon_active.svg',
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
        activeIcon: '/images/sidebar/avtive/tier_nav_icon_active.svg',
      },
      {
        id: 'analytics',
        label: 'Phân tích',
        href: '/analytics',
        icon: '/images/sidebar/analytics_icon.svg',
        activeIcon: '/images/sidebar/avtive/analytics_icon_active.svg',
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
        activeIcon: '/images/sidebar/avtive/group_icon_active.svg',
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

  return (
    <aside className="flex h-full min-h-0 w-[232px] shrink-0 flex-col overflow-y-auto border-r border-[#202020] bg-black px-4 py-5 text-[#f5f5f5] custom-scrollbar">
      <nav className="flex-1 space-y-8">
        {navSections.map((section) => (
          <section key={section.label} className="space-y-2">
            <div className="px-0 text-xs font-normal uppercase leading-none text-[#8a8a8a]">
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
                      'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#2b2b2b] text-white'
                        : 'text-[#8f8f8f] hover:bg-[#171717] hover:text-white',
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

      <div className="border-t border-[#202020] pt-4">
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
            <div className="truncate text-sm font-normal leading-4 text-[#e0e0e0]">
              {profile?.email ?? '-'}
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#2b2b2b] text-[#dedede] transition-colors hover:bg-[#3a3a3a] hover:text-white"
            aria-label="Đăng xuất"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  )
}
