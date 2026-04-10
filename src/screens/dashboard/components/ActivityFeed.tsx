interface ActivityItem {
  time: string;
  icon: string;
  iconClass: string;
  text: JSX.Element;
}

const activities: ActivityItem[] = [
  {
    time: "14:32",
    icon: "↑",
    iconClass: "bg-success/15 text-success",
    text: (
      <>
        <strong className="text-foreground font-medium">+3 members</strong> mới đăng ký hôm nay
      </>
    ),
  },
  {
    time: "13:15",
    icon: "⚠",
    iconClass: "bg-warning/15 text-warning",
    text: (
      <>
        <strong className="text-foreground font-medium">minhkhang_tr</strong> nhận cảnh báo volume thấp
      </>
    ),
  },
  {
    time: "12:00",
    icon: "$",
    iconClass: "bg-info/15 text-info",
    text: (
      <>
        Commission tổng hợp: <strong className="text-foreground font-medium">+$840</strong>
      </>
    ),
  },
  {
    time: "11:20",
    icon: "↑",
    iconClass: "bg-success/15 text-success",
    text: (
      <>
        <strong className="text-foreground font-medium">hoanganh_btc</strong> nâng hạng →{" "}
        <strong className="text-foreground font-medium">Vàng</strong>
      </>
    ),
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
          Hoạt động gần đây
        </div>
      </div>
      <div className="flex flex-col">
        {activities.map((act) => (
          <div
            key={act.time}
            className="flex items-start gap-3 py-3 border-b border-border last:border-b-0 text-[13px]"
          >
            <div className="font-geist-mono text-[11px] text-muted-foreground shrink-0 pt-0.5">
              {act.time}
            </div>
            <div
              className={`w-5 h-5 rounded-md grid place-items-center shrink-0 mt-0.5 text-xs ${act.iconClass}`}
            >
              {act.icon}
            </div>
            <div className="flex-1 text-muted-foreground">{act.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
