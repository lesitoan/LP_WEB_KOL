export default function CampaignCountdown() {
  const timeBlocks = [
    { num: "12", label: "Ngày" },
    { num: "04", label: "Giờ" },
    { num: "28", label: "Phút" },
  ];

  return (
    <div className="flex items-center gap-2 bg-surface-2 border border-border p-3 px-4 rounded-lg">
      {timeBlocks.map((t, i) => (
        <div key={t.label} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-muted-foreground text-lg">:</span>
          )}
          <div className="text-center">
            <div className="font-geist-mono text-[22px] font-semibold text-warning">
              {t.num}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.08em]">
              {t.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
