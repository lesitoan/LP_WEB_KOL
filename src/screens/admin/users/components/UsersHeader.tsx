interface UsersHeaderProps {
  onCreateClick: () => void
}

export default function UsersHeader({ onCreateClick }: UsersHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium text-white leading-[31.2px]">Quản lý người dùng</h1>
        <p className="text-sm font-normal text-[#828283] leading-[21px] mt-1">Phân quyền admin theo vai trò</p>
      </div>

      <button
        type="button"
        onClick={onCreateClick}
        className="self-end inline-flex items-center gap-2 h-9 px-4 bg-[#F7F0A1] rounded-lg text-sm font-semibold text-black hover:bg-[#e8e09c] transition-colors shrink-0"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 4v12M4 10h12" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Tạo tài khoản admin
      </button>
    </div>
  )
}
