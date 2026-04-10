"use client";

import { useRouter } from "next/navigation";

interface ActionButton {
  label: string;
  nav?: string;
}

interface NextAction {
  icon: string;
  iconClass: string;
  title: string;
  desc: string;
  buttons: ActionButton[];
}

const actions: NextAction[] = [
  {
    icon: "⚠",
    iconClass: "bg-warning/[0.12] text-warning border border-warning/25",
    title: "12 members sắp bị kick khỏi Vàng (volume thấp 7 ngày)",
    desc: "Họ có thể được giữ lại nếu trade thêm $35K trong 4 ngày tới. Cân nhắc gửi DM nhắc nhở.",
    buttons: [
      { label: "Xem danh sách", nav: "members" },
      { label: "Gửi DM nhắc nhở" },
    ],
  },
  {
    icon: "💡",
    iconClass: "bg-info/[0.12] text-info border border-info/25",
    title: "Campaign tuần trước đã kết thúc — chưa có campaign mới",
    desc: "Trung bình campaign mới boost volume +18% trong 2 tuần đầu.",
    buttons: [{ label: "Tạo campaign tháng 4", nav: "campaign" }],
  },
  {
    icon: "📊",
    iconClass: "bg-[hsl(40_78%_55%/0.12)] text-brand border border-[hsl(40_78%_55%/0.25)]",
    title: "Cashback rate group Đồng (10%) thấp hơn trung bình tier ELITE (15%)",
    desc: "Tăng rate có thể giúp hút thêm ref. Mô phỏng tác động trước khi quyết định.",
    buttons: [{ label: "Mô phỏng tác động", nav: "cashback" }],
  },
];

export default function NextActions() {
  const router = useRouter();
  return (
    <div className="bg-surface-1 border border-border rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
          🎯 Điều nên làm tiếp theo
        </div>
      </div>
      {actions.map((action) => (
        <div
          key={action.title}
          className="flex items-start gap-4 p-4 border border-border rounded-lg mb-3 last:mb-0 bg-surface-2 hover:border-border-strong hover:bg-surface-3 transition-all cursor-pointer"
        >
          <div
            className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 text-base ${action.iconClass}`}
          >
            {action.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1">
              <strong>{action.title}</strong>
            </div>
            <div className="text-[12.5px] text-muted-foreground">{action.desc}</div>
            <div className="flex gap-2 mt-3">
              {action.buttons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (btn.nav) router.push(`/${btn.nav}`);
                  }}
                  className={
                    btn.nav
                      ? "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-2 border border-border text-foreground hover:bg-surface-3 transition-all"
                      : "text-xs text-muted-foreground hover:bg-surface-2 px-2.5 py-1 rounded-lg transition-all"
                  }
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
