import Link from 'next/link'
import { getDefaultAdminPath } from '@/lib/adminPermissions'

interface AdminNotFoundContentProps {
  role?: string | null
}

export default function AdminNotFoundContent({ role }: AdminNotFoundContentProps) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md">
        <p className="text-sm font-medium uppercase text-[#828283]">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Không tìm thấy trang</h1>
        <p className="mt-3 text-sm leading-6 text-[#A8A8A9]">
          Trang bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        {/* <Link
          href={getDefaultAdminPath(role)}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#F7F0A1] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#F7F0A1]/80"
        >
          Ve trang duoc phep
        </Link> */}
      </div>
    </div>
  )
}
