import { GroupConfig } from "./cashback-data";

interface CashbackItemProps {
  group: GroupConfig;
  rate: number;
  onRateChange: (value: number) => void;
}

export function CashbackItem({ group: g, rate, onRateChange }: CashbackItemProps) {
  const cashbackAmount = Math.round(g.commission * 2 * (rate / 100));
  const keepAmount = g.commission - cashbackAmount;
  const avgPerMember = Math.round(cashbackAmount / g.members);

  const handleSliderChange = (value: number) => {
    onRateChange(Math.max(0, Math.min(49, value)));
  };

  const handleInputChange = (raw: string) => {
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      onRateChange(0);
      return;
    }
    handleSliderChange(parsed);
  };

  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-5">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-9 h-9 rounded-lg grid place-items-center font-bold text-primary-foreground ${g.iconClass}`}
        >
          {g.icon}
        </div>
        <div>
          <div className="text-[15px] font-semibold">{g.name}</div>
          <div className="text-xs text-muted-foreground">{g.meta}</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4 items-center mb-5">
        <input
          type="range"
          min={0}
          max={49}
          value={rate}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="cashback-slider w-full"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={49}
            value={rate}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-20 h-10 bg-surface-2 border border-border rounded-lg text-center font-geist-mono text-lg font-semibold text-brand outline-none focus:border-brand"
          />
          <span className="text-sm text-muted-foreground font-medium">%</span>
        </div>
      </div>

      <div className="bg-surface-2 border border-border rounded-lg p-4">
        <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground font-semibold mb-3 flex items-center gap-2">
          📊 Tác động dự kiến {g.showFullImpact && "(theo data 30 ngày)"}
        </div>
        {g.showFullImpact ? (
          <>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-muted-foreground">Tổng members</span>
              <span className="font-geist-mono font-medium">{g.members}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-muted-foreground">Tổng vol 30d</span>
              <span className="font-geist-mono font-medium">{g.vol}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-muted-foreground">Commission bạn nhận (50%)</span>
              <span className="font-geist-mono font-medium">
                ${g.commission.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px] border-t border-dashed border-border mt-2 pt-3">
              <span className="text-muted-foreground">→ Cashback chia ra ({rate}%)</span>
              <span className="font-geist-mono font-semibold text-brand">
                ${cashbackAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-muted-foreground">→ Bạn giữ lại</span>
              <span className="font-geist-mono font-medium">
                ${keepAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px] border-t border-border mt-2 pt-2">
              <span className="text-muted-foreground">Trung bình mỗi member nhận</span>
              <span className="font-geist-mono font-semibold text-brand">
                ${avgPerMember}/tháng
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-muted-foreground">
                {g.members} members · vol {g.vol}
              </span>
              <span className="font-geist-mono font-medium">
                ~${avgPerMember}/member/tháng
              </span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px] border-t border-dashed border-border mt-2 pt-3">
              <span className="text-muted-foreground">→ Cashback chia ra ({rate}%)</span>
              <span className="font-geist-mono font-semibold text-brand">
                ${cashbackAmount.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>

      {g.name === "Group Đồng" && rate <= 10 && (
        <div className="flex items-start gap-2 p-3 bg-warning/[0.08] border border-warning/20 rounded-lg text-[12.5px] text-warning mt-3">
          <span>⚠</span>
          <span>
            Rate này thấp hơn trung bình tier ELITE (15%). Cân nhắc tăng để hút thêm ref mới.
          </span>
        </div>
      )}
    </div>
  );
}
