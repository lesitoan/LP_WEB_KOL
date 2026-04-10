export default function Topbar() {
  return (
    <header className="h-14 border-b border-border bg-surface-1 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1 max-w-[480px] h-9 bg-surface-2 border border-border rounded-lg flex items-center px-3 gap-2 text-[13px] text-muted-foreground hover:border-border-strong transition-colors cursor-pointer">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Tìm member, group, giao dịch...
        <span className="ml-auto bg-surface-3 border border-border rounded px-1.5 py-[1px] text-[10px] font-geist-mono text-muted-foreground">
          ⌘K
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-[hsl(40_78%_55%/0.1)] to-[hsl(40_78%_55%/0.02)] border border-[hsl(40_78%_55%/0.3)] rounded-lg text-xs font-semibold text-brand">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5L12 16l-5.5 3.5L8 13 3 8.5 9.5 8z" />
          </svg>
          ELITE · Comm. 50%
        </div>
        <button className="w-9 h-9 rounded-lg grid place-items-center text-muted-foreground hover:bg-surface-3 hover:text-foreground transition-all relative">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full bg-brand shadow-[0_0_0_2px_hsl(var(--surface-1))]" />
        </button>
        <button className="w-9 h-9 rounded-lg grid place-items-center text-muted-foreground hover:bg-surface-3 hover:text-foreground transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
        </button>
      </div>
    </header>
  );
}
