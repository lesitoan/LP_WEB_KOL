import Image from 'next/image'
import Link from 'next/link'

export default function PartnerHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 px-5 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
        <Image src="/images/logo.png" alt="SCEX" width={118} height={32} className="h-6 w-auto object-contain" priority />
        <Link href="/login" className="rounded-full bg-brand px-4 py-2 text-base font-bold text-primary-foreground hover:bg-brand-dim">
          Đăng nhập
        </Link>
      </div>
    </header>
  )
}
