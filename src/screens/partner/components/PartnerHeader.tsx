import Image from 'next/image'
export default function PartnerHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 px-5 py-5 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
        <Image src="/images/logo.png" alt="SCEX" width={177} height={48} className="h-8 w-auto object-contain" priority />
      </div>
    </header>
  )
}
