export interface Member {
  initials: string;
  name: string;
  uid: string;
  groups: string[];
  vol: string;
  status: "active" | "warning" | "pending";
  statusLabel: string;
  cashback: string;
  gradient: string;
}

export const members: Member[] = [
  {
    initials: "TR",
    name: "tradervn88",
    uid: "UID 938472 · joined 12/01/2026",
    groups: ["V", "B", "Đ"],
    vol: "$487,200",
    status: "active",
    statusLabel: "● Active",
    cashback: "$122",
    gradient: "from-[#E8B84D] to-[#A86B3F]",
  },
  {
    initials: "HA",
    name: "hoanganh_btc",
    uid: "UID 184729 · joined 03/02/2026",
    groups: ["V", "B", "Đ"],
    vol: "$342,100",
    status: "active",
    statusLabel: "● Active",
    cashback: "$86",
    gradient: "from-[#F5B544] to-[#EF4444]",
  },
  {
    initials: "MK",
    name: "minhkhang_tr",
    uid: "UID 392847 · joined 20/02/2026",
    groups: ["B", "Đ"],
    vol: "$58,300",
    status: "warning",
    statusLabel: "⚠ Cảnh báo 1/2 · 4 ngày",
    cashback: "$15",
    gradient: "from-[#A78BFA] to-[#EC4899]",
  },
  {
    initials: "CL",
    name: "cryptolover99",
    uid: "UID 729384 · joined 08/03/2026",
    groups: ["Đ"],
    vol: "$12,400",
    status: "active",
    statusLabel: "● Active",
    cashback: "$3",
    gradient: "from-[#34D399] to-[#06B6D4]",
  },
  {
    initials: "N2",
    name: "newbie_2026",
    uid: "UID chưa nhập",
    groups: [],
    vol: "$0",
    status: "pending",
    statusLabel: "◷ Chờ verify · 18h còn lại",
    cashback: "—",
    gradient: "from-[#FB7185] to-[#F59E0B]",
  },
  {
    initials: "WM",
    name: "whale_master",
    uid: "UID 561284 · joined 18/12/2025",
    groups: ["V", "B", "Đ"],
    vol: "$1,098,300",
    status: "active",
    statusLabel: "● Active · VIP",
    cashback: "$274",
    gradient: "from-[#818CF8] to-[#C084FC]",
  },
  {
    initials: "DL",
    name: "defi_lover",
    uid: "UID 847291 · joined 22/01/2026",
    groups: ["B", "Đ"],
    vol: "$84,200",
    status: "active",
    statusLabel: "● Active",
    cashback: "$21",
    gradient: "from-[#22D3EE] to-[#3B82F6]",
  },
  {
    initials: "MV",
    name: "moonboy_vn",
    uid: "UID 384729 · joined 14/02/2026",
    groups: ["Đ"],
    vol: "$23,800",
    status: "active",
    statusLabel: "● Active",
    cashback: "$6",
    gradient: "from-[#F472B6] to-[#A78BFA]",
  },
];

export const groupColorMap: Record<string, string> = {
  V: "bg-group-gold",
  B: "bg-group-silver",
  Đ: "bg-group-bronze",
};

export const statusClass: Record<string, string> = {
  active: "bg-success/[0.12] text-success border border-success/20",
  warning: "bg-warning/[0.12] text-warning border border-warning/20",
  pending: "bg-info/[0.12] text-info border border-info/20",
};
