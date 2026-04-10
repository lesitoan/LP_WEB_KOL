import { groupColorMap, members, statusClass } from "./members-data";

export default function MembersTable() {
  return (
    <div className="bg-surface-1 border border-border rounded-[14px] overflow-hidden">
      <div className="p-4 px-5 border-b border-border flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[240px] max-w-[360px] h-[34px] bg-surface-2 border border-border rounded-lg px-3 flex items-center gap-2 text-[13px] text-muted-foreground">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Tìm theo username, UID...
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[hsl(40_78%_55%/0.1)] border border-[hsl(40_78%_55%/0.25)] rounded-full text-[11.5px] font-medium text-brand">
          Status: Active <button className="opacity-70 hover:opacity-100">✕</button>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[hsl(40_78%_55%/0.1)] border border-[hsl(40_78%_55%/0.25)] rounded-full text-[11.5px] font-medium text-brand">
          Vol: $50K-$500K <button className="opacity-70 hover:opacity-100">✕</button>
        </span>
        <button className="text-xs text-muted-foreground px-2 py-1 hover:bg-surface-2 rounded">
          + Bộ lọc
        </button>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium bg-warning/[0.12] text-warning">
            ⚠ 12 sắp kick
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium bg-info/[0.12] text-info">
            ◷ 8 chờ verify
          </span>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border w-10">
              <input type="checkbox" className="accent-brand" />
            </th>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border">
              Member
            </th>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border">
              Groups
            </th>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border cursor-pointer hover:text-foreground">
              Volume 30D ↓
            </th>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border">
              Trạng thái
            </th>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border">
              Cashback tháng
            </th>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border w-10" />
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.name} className="hover:bg-surface-2 transition-colors cursor-pointer">
              <td className="p-4 px-5 border-b border-border">
                <input type="checkbox" className="accent-brand" />
              </td>
              <td className="p-4 px-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.gradient} grid place-items-center text-xs font-semibold text-foreground shrink-0`}
                  >
                    {m.initials}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground font-geist-mono">{m.uid}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 px-5 border-b border-border">
                {m.groups.length > 0 ? (
                  <div className="inline-flex gap-1 items-center">
                    {m.groups.map((g) => (
                      <span
                        key={g}
                        className={`w-[18px] h-[18px] rounded-full grid place-items-center text-[9px] font-bold text-primary-foreground ${groupColorMap[g]}`}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-[13px]">—</span>
                )}
              </td>
              <td
                className={`p-4 px-5 border-b border-border font-geist-mono font-medium text-[13.5px] ${
                  m.vol === "$0" ? "text-muted-foreground" : ""
                }`}
              >
                {m.vol}
              </td>
              <td className="p-4 px-5 border-b border-border">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium ${statusClass[m.status]}`}
                >
                  {m.statusLabel}
                </span>
              </td>
              <td
                className={`p-4 px-5 border-b border-border font-geist-mono font-medium text-[13.5px] ${
                  m.cashback === "—" ? "text-muted-foreground" : "text-brand"
                }`}
              >
                {m.cashback}
              </td>
              <td className="p-4 px-5 border-b border-border">
                <button className="w-7 h-7 rounded-lg grid place-items-center text-muted-foreground hover:bg-surface-3 hover:text-foreground transition-all">
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-5 py-3 border-t border-border flex items-center justify-between text-[12.5px] text-muted-foreground">
        <span>Hiển thị 1–8 / 742 members</span>
        <div className="flex gap-0.5">
          {["‹", "1", "2", "3", "…", "93", "›"].map((p) => (
            <button
              key={p}
              className={`w-7 h-7 grid place-items-center rounded-md text-xs text-muted-foreground hover:bg-surface-3 hover:text-foreground ${
                p === "1" ? "bg-surface-3 text-foreground font-semibold" : ""
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <span>50 ▾ rows/page</span>
      </div>
    </div>
  );
}
