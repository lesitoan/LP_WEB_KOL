'use client'

import Image from 'next/image'
import { LogOut, Menu, Settings, Star, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useGetKolCurrentTierQuery } from '@/services/api/tierApi'

type TopbarProps = {
  onMenuClick?: () => void
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

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter()
  const { profile, logout } = useAuthSession()
  const { data: tierData } = useGetKolCurrentTierQuery()

  const currentTierName =
    tierData?.matchedTier?.name || tierData?.currentTier?.name || 'Starter'
  const currentCommissionRate =
    tierData?.matchedTier?.commissionRatePct ??
    tierData?.currentTier?.commissionRatePct ??
    tierData?.kol.currentCommissionRate ??
    null

  const tierBadgeText =
    currentCommissionRate === null
      ? currentTierName
      : `${currentTierName} · Comm. ${currentCommissionRate}%`

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 shrink-0 items-center border-b border-[#202020] bg-black px-6 text-white">
      <div className="flex h-full w-[232px] shrink-0 items-center gap-3 max-md:w-auto">
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-1 grid h-9 w-9 place-items-center rounded-md border border-[#262626] bg-[#0b0b0b] text-[#d7d7d7] transition-colors hover:bg-[#171717] hover:text-white md:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-4 w-4" strokeWidth={1.9} />
        </button>

        <Image
          src="/images/Logo.png"
          alt="SCEX"
          width={132}
          height={34}
          priority
          className="h-auto w-[120px] object-contain"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#070707] py-1.5 pl-2 pr-3 text-xs font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:flex">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#292929] text-[#ffcf12] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <Star className="h-4 w-4 fill-current" strokeWidth={1.8} />
          </span>
          <span className="leading-4">{tierBadgeText}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-brand-blue-900 transition-colors hover:bg-brand-blue-800">
              <Avatar className="h-9 w-9 border border-brand-blue-500/40">
                <AvatarFallback className="bg-brand-blue-500 text-xs font-semibold text-white">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 border-[#252525] bg-[#080808] text-white"
          >
            <DropdownMenuLabel className="space-y-1">
              <div className="text-sm font-semibold leading-none">
                {profile?.name ?? 'Unknown User'}
              </div>
              <div className="truncate text-xs font-normal text-[#a5a5a5]">
                {profile?.email ?? ''}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#252525]" />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                router.push('/settings')
              }}
              className="gap-2 focus:bg-[#171717] focus:text-white"
            >
              <UserRound className="h-4 w-4" />
              Cài đặt tài khoản
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                router.push('/settings')
              }}
              className="gap-2 focus:bg-[#171717] focus:text-white"
            >
              <Settings className="h-4 w-4" />
              Cài đặt thành viên
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#252525]" />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault()
                logout()
              }}
              className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
