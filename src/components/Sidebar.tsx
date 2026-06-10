'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChartGantt,
  DollarSign,
  Home,
  Layers,
  Lightbulb,
  LogOut,
  Star,
  Trophy,
  UsersRound,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthSession } from '@/hooks/useAuthSession'
import { cn } from '@/lib/utils'

const navSections = [
  {
    label: 'Vận hành',
    items: [
      { id: 'home', label: 'Tổng quan', href: '/dashboard', icon: Home },
      { id: 'members', label: 'Cộng đồng', href: '/members', icon: UsersRound },
      { id: 'insights', label: 'Insights', href: '/insights', icon: Lightbulb },
      { id: 'groups', label: 'Groups', href: '/groups', icon: Layers },
    ],
  },
    {
    label: 'Doanh thu',
    items: [
      // { id: 'cashback', label: 'Cashback', href: '/cashback', icon: DollarSign },
      { id: 'campaign', label: 'Chiến dịch', href: '/campaign', icon: Trophy },
    ],
  },
  {
    label: 'Phát triển',
    items: [
      { id: 'tier', label: 'Tier & Tín hiệu', href: '/tier', icon: Star },
      { id: 'analytics', label: 'Phân tích', href: '/analytics', icon: ChartGantt },
    ],
  },
  {
    label: 'Hệ thống',
    items: [{ id: 'settings', label: 'Cài đặt thành viên', href: '/settings', icon: Layers }],
  },
]

type SidebarProps = {
  onItemClick?: () => void
}

function getInitials(name?: string | null) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname()
  const { profile, logout } = useAuthSession()

  return (
    <aside className="flex h-full min-h-0 w-[232px] shrink-0 flex-col overflow-y-auto border-r border-[#202020] bg-black px-4 py-5 text-[#f5f5f5] custom-scrollbar">
      <nav className="flex-1 space-y-8">
        {navSections.map((section) => (
          <section key={section.label} className="space-y-2">
            <div className="px-0 text-[11px] font-medium uppercase leading-none text-[#8a8a8a]">
              {section.label}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
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
                      'flex h-10 items-center gap-3 rounded-md px-3 text-[13px] font-medium transition-colors',
                      isActive
                        ? 'bg-[#2b2b2b] text-white'
                        : 'text-[#8f8f8f] hover:bg-[#171717] hover:text-white',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-[18px] w-[18px] shrink-0',
                        isActive ? 'text-brand-blue-500' : 'text-[#9a9a9a]',
                      )}
                      strokeWidth={1.8}
                    />
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
          <Avatar className="h-9 w-9 border border-brand-blue-500/40 bg-brand-blue-800">
            <AvatarFallback className="bg-brand-blue-500 text-xs font-semibold text-white">
              {getInitials(profile?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold leading-5 text-white">
              {profile?.name ?? 'Unknown User'}
            </div>
            <div className="truncate text-[12px] leading-4 text-[#e0e0e0]">
              {profile?.email ?? '—'}
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
