interface CashbackSummaryProps {
  rates: Record<string, number>;
}

export function CashbackSummary({ rates }: CashbackSummaryProps) {
  const rows = [
    { name: "Group Vàng", orig: 20, current: rates["Group Vàng"] },
    { name: "Group Bạc", orig: 15, current: rates["Group Bạc"] },
    { name: "Group Đồng", orig: 10, current: rates["Group Đồng"] },
  ];

  return (
    <div className="bg-surface-2 border border-dashed border-border-strong rounded-card p-5 mt-5">
      <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground font-semibold mb-3">
        📋 Tóm tắt thay đổi sẽ áp dụng
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.name} className="flex justify-between py-1.5 text-[13px]">
            <span>{row.name}</span>
            {row.current !== row.orig ? (
              <span>
                <span className="text-muted-foreground font-geist-mono">
                  {row.orig}% →
                </span>{" "}
                <span className="text-success font-geist-mono font-medium">
                  {row.current}%
                </span>{" "}
                <span className="text-success font-geist-mono font-medium">
                  (+{row.current - row.orig}%)
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground font-geist-mono">
                {row.orig}% → {row.current}% (không đổi)
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-[12.5px] text-muted-foreground flex items-center gap-2">
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        Áp dụng từ chu kỳ tiếp theo · Thứ 2, 13/04/2026 · Member sẽ nhận DM thông báo
      </div>
    </div>
  );
}
