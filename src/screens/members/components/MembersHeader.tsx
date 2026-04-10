export default function MembersHeader() {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-0.5">Cộng đồng / Members</h1>
        <div className="text-[13px] text-muted-foreground">
          Quản lý và theo dõi tất cả members trên các groups
        </div>
      </div>
      <div className="flex gap-2">
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium bg-surface-2 border border-border text-foreground hover:bg-surface-3 transition-all">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export CSV
        </button>
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-brand text-primary-foreground hover:bg-brand-dim transition-all">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Mời member
        </button>
      </div>
    </div>
  );
}
