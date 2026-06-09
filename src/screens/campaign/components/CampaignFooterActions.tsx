export default function CampaignFooterActions() {
  const buttons = ["📊 Analytics", "📤 Share", "⚙ Edit"];

  return (
    <div className="px-4 md:px-6 py-4 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-muted-foreground">
      <span className="text-center md:text-left">Hiển thị Top 8 / 142 participants</span>
      <div className="flex flex-wrap justify-center gap-2">
        {buttons.map((b) => (
          <button
            key={b}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-2 border border-border text-foreground hover:bg-surface-3 transition-all"
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
