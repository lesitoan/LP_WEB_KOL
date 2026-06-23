'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LogOut, Menu } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { useAuthSession } from '@/hooks/useAuthSession'
import { usePopup } from '@/hooks/usePopup'
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

function getTierIconSrc(code?: string | null, name?: string | null) {
  const iconKey = (code || name || '').toUpperCase()
  return iconKey ? `/images/tier_icons/${iconKey}.png` : '/images/tier_icons/tier_logo.png'
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { profile, logout } = useAuthSession()
  const { showConfirm, Popup } = usePopup()
  const { data: tierData } = useGetKolCurrentTierQuery()

  const currentTierName =
    tierData?.matchedTier?.name || tierData?.currentTier?.name || 'Starter'
  const currentTierCode =
    tierData?.matchedTier?.code || tierData?.currentTier?.code || currentTierName
  const currentCommissionRate =
    tierData?.matchedTier?.commissionRatePct ??
    tierData?.currentTier?.commissionRatePct ??
    tierData?.kol.currentCommissionRate ??
    null

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
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 shrink-0 items-center border-b border-border bg-black px-6 text-white">
      <div className="flex h-full w-[232px] shrink-0 items-center gap-3 max-md:w-auto">
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-1 grid h-9 w-9 place-items-center rounded-md border border-border-strong bg-surface-1 text-muted-foreground transition-colors hover:bg-surface-card hover:text-white md:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-4 w-4" strokeWidth={1.9} />
        </button>

        <Link href="/" aria-label="Về trang chủ" className="inline-flex items-center">
          <Image
            src="/images/Logo.png"
            alt="SCEX"
            width={132}
            height={34}
            priority
            className="h-auto w-[67px] object-contain sm:w-[100px]"
          />
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border-strong bg-surface-1 py-1.5 pl-2 pr-3 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:gap-3 sm:pr-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-control shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:h-9 sm:w-9">
            <img
              src={getTierIconSrc(currentTierCode, currentTierName)}
              alt={currentTierName}
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-xs font-semibold leading-4 sm:text-sm sm:leading-5">{currentTierName}</span>
            {currentCommissionRate !== null ? (
              <span className="text-[11px] font-normal leading-3 text-white/85 sm:text-xs sm:leading-4">
                Comm. {currentCommissionRate}%
              </span>
            ) : null}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 transition-colors hover:bg-brand/25">
              <Avatar className="h-9 w-9 border border-brand/40">
                <AvatarImage src="/images/avatar_default.png" alt="" />
                <AvatarFallback className="bg-brand text-xs font-semibold text-primary-foreground">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 border-border-strong bg-surface-card text-white"
          >
            <DropdownMenuLabel className="space-y-1">
              <div className="text-sm font-semibold leading-none">
                {profile?.name ?? 'Unknown User'}
              </div>
              <div className="truncate text-xs font-normal text-muted-foreground">
                {profile?.email ?? ''}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border-strong" />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault()
                void handleLogout()
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
    <Popup />
    </>
  )
}
