import { tierData } from "./tier-data";

export default function TierComparisonTable() {
  return (
    <div className="bg-surface-1 border border-border rounded-[14px] overflow-hidden mb-6">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 px-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-surface-2 border-b border-border" />
            {["STARTER", "PARTNER", "ELITE ✓", "LEGEND"].map((t, i) => (
              <th
                key={t}
                className={`text-center p-3 px-5 text-[11px] font-semibold uppercase tracking-wider bg-surface-2 border-b border-border ${
                  i === 2
                    ? "text-brand bg-[hsl(40_78%_55%/0.05)]"
                    : "text-muted-foreground"
                }`}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tierData.map((row) => (
            <tr key={row.feature}>
              <td className="p-4 px-5 border-b border-border text-[13.5px]">
                <strong>{row.feature}</strong>
              </td>
              {row.values.map((v, i) => (
                <td
                  key={i}
                  className={`p-4 px-5 border-b border-border text-center text-[13.5px] ${
                    i === row.currentIdx
                      ? "bg-[hsl(40_78%_55%/0.05)]"
                      : ""
                  }`}
                >
                  {v === "✓" ? (
                    <span className="text-success text-base">✓</span>
                  ) : v === "—" ? (
                    <span className="text-muted-foreground">—</span>
                  ) : i === row.currentIdx ? (
                    <strong>{v}</strong>
                  ) : i === 3 && row.feature === "Commission rate" ? (
                    <strong className="text-tier-legend">{v}</strong>
                  ) : i === 3 && v === "Whale ★" ? (
                    <strong className="text-tier-legend">{v}</strong>
                  ) : (
                    <span className="text-muted-foreground">{v}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
