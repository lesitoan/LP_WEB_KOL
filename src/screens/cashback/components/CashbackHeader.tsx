interface CashbackHeaderProps {
  saved: boolean;
  onSave: () => void;
}

export default function CashbackHeader({ saved, onSave }: CashbackHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-0.5">Cashback Settings</h1>
        <div className="text-sm text-muted-foreground">
          Bạn đang ở tier <strong className="text-brand font-semibold">ELITE</strong> · Commission 50% · Cashback tối đa 49%
        </div>
      </div>
      <div className="flex gap-2">
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium bg-surface-2 border border-border text-foreground hover:bg-surface-3 transition-all">
          Hủy
        </button>
        <button
          onClick={onSave}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            saved
              ? "bg-success text-primary-foreground"
              : "bg-brand text-primary-foreground hover:bg-brand-dim"
          }`}
        >
          {saved ? "✓ Đã lưu" : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
