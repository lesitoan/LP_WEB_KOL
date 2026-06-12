export interface LeaderboardRow {
  rank: number;
  initials: string;
  name: string;
  uid: string;
  vol: string;
  trend: string;
  trendClass: string;
  prize?: string;
  gradient: string;
  rankClass: string;
  podium: boolean;
}

export const leaderboard: LeaderboardRow[] = [
  {
    rank: 1,
    initials: "TR",
    name: "tradervn88",
    uid: "UID 938472",
    vol: "$1,287,420",
    trend: "▬ 0",
    trendClass: "text-muted-foreground",
    prize: "💰 500 USDT",
    gradient: "from-[#E8B84D] to-[#A86B3F]",
    rankClass:
      "bg-gradient-to-br from-[#F5D87A] to-[#D4A04A] text-primary-foreground text-lg",
    podium: true,
  },
  {
    rank: 2,
    initials: "HA",
    name: "hoanganh_btc",
    uid: "UID 184729",
    vol: "$1,184,200",
    trend: "▲ 1",
    trendClass: "text-success",
    prize: "💰 200 USDT",
    gradient: "from-[#F5B544] to-[#EF4444]",
    rankClass:
      "bg-gradient-to-br from-[#D5CFB8] to-[#A89682] text-primary-foreground text-lg",
    podium: true,
  },
  {
    rank: 3,
    initials: "WM",
    name: "whale_master",
    uid: "UID 561284",
    vol: "$1,098,300",
    trend: "▼ 1",
    trendClass: "text-danger",
    prize: "💰 100 USDT",
    gradient: "from-[#818CF8] to-[#C084FC]",
    rankClass:
      "bg-gradient-to-br from-[#D69970] to-[#8B4513] text-primary-foreground text-lg",
    podium: true,
  },
  {
    rank: 4,
    initials: "CK",
    name: "crypto_king99",
    uid: "UID 472918",
    vol: "$987,420",
    trend: "▲ 2",
    trendClass: "text-success",
    gradient: "from-[#34D399] to-[#06B6D4]",
    rankClass: "bg-surface-2 text-muted-foreground",
    podium: false,
  },
  {
    rank: 5,
    initials: "DL",
    name: "defi_lover",
    uid: "UID 847291",
    vol: "$842,100",
    trend: "▼ 1",
    trendClass: "text-danger",
    gradient: "from-[#22D3EE] to-[#3B82F6]",
    rankClass: "bg-surface-2 text-muted-foreground",
    podium: false,
  },
  {
    rank: 6,
    initials: "MV",
    name: "moonboy_vn",
    uid: "UID 384729",
    vol: "$784,000",
    trend: "▬ 0",
    trendClass: "text-muted-foreground",
    gradient: "from-[#F472B6] to-[#A78BFA]",
    rankClass: "bg-surface-2 text-muted-foreground",
    podium: false,
  },
  {
    rank: 7,
    initials: "BT",
    name: "btc_holder",
    uid: "UID 192847",
    vol: "$682,500",
    trend: "▲ 3",
    trendClass: "text-success",
    gradient: "from-[#FB7185] to-[#F59E0B]",
    rankClass: "bg-surface-2 text-muted-foreground",
    podium: false,
  },
  {
    rank: 8,
    initials: "MK",
    name: "minhkhang_tr",
    uid: "UID 392847",
    vol: "$521,840",
    trend: "▼ 2",
    trendClass: "text-danger",
    gradient: "from-[#A78BFA] to-[#EC4899]",
    rankClass: "bg-surface-2 text-muted-foreground",
    podium: false,
  },
];

export interface CampaignHistoryData {
  id: string;
  title: string;
  month: string;
  status: "active" | "ended";
  participants: number;
  totalVol: string;
  timeLeft: string;
}

export const campaignHistory: CampaignHistoryData[] = [
  {
    id: "1",
    title: "Vua volume",
    month: "THÁNG 3",
    status: "ended",
    participants: 142,
    totalVol: "$42.5 M",
    timeLeft: "-- : -- : --",
  },
  {
    id: "2",
    title: "Vua volume",
    month: "THÁNG 5",
    status: "active",
    participants: 142,
    totalVol: "$42.5 M",
    timeLeft: "12 : 04 : 28",
  },
  {
    id: "3",
    title: "Vua volume",
    month: "THÁNG 6",
    status: "active",
    participants: 142,
    totalVol: "$42.5 M",
    timeLeft: "12 : 04 : 28",
  },
];