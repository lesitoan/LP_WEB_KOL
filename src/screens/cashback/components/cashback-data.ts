export interface GroupConfig {
  name: string;
  icon: string;
  iconClass: string;
  meta: string;
  defaultRate: number;
  members: number;
  vol: string;
  commission: number;
  showFullImpact?: boolean;
}

export const groups: GroupConfig[] = [
  {
    name: "Group Vàng",
    icon: "V",
    iconClass: "bg-gradient-to-br from-[#F5D87A] to-[#D4A04A]",
    meta: "≥ $200K vol/30d · 142 members · ngưỡng hiện tại",
    defaultRate: 25,
    members: 142,
    vol: "$28,400,000",
    commission: 14200,
    showFullImpact: true,
  },
  {
    name: "Group Bạc",
    icon: "B",
    iconClass: "bg-gradient-to-br from-[#D5CFB8] to-[#A89682]",
    meta: "≥ $50K vol/30d · 312 members",
    defaultRate: 15,
    members: 312,
    vol: "$9.36M",
    commission: 4680,
  },
  {
    name: "Group Đồng",
    icon: "Đ",
    iconClass: "bg-gradient-to-br from-[#D69970] to-[#8B4513]",
    meta: "≥ $10K vol/30d · 288 members",
    defaultRate: 10,
    members: 288,
    vol: "$2.88M",
    commission: 1440,
  },
];
