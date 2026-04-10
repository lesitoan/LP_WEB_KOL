export const signalTabs = ["Trading Signals", "On-chain Full", "Tin thị trường"];

export const signals = [
  {
    icon: "🔥",
    title: "Smart Money L/S Ratio — BTC",
    time: "14:30 hôm nay",
    body: (
      <>
        Long: <strong className="text-foreground font-medium">64%</strong> · Short: <strong className="text-foreground font-medium">36%</strong> · Tăng <strong className="text-success font-medium">+8%</strong> trong 4 giờ qua. Net Volume Change đang dương mạnh.
      </>
    ),
    insight:
      "Bullish bias đang tăng. Smart money đang accumulate từ vùng giá này.",
  },
  {
    icon: "📊",
    title: "ETF Flow — BTC ETFs",
    time: "12:00 hôm nay",
    body: (
      <>
        Net inflow: <strong className="text-success font-medium">+$284M</strong> · 5 ngày liên tiếp dòng vốn vào ròng. Top accumulators: <strong className="text-foreground font-medium">BlackRock IBIT, Fidelity FBTC</strong>.
      </>
    ),
    insight:
      "Institutional demand bền vững. Đây là support quan trọng cho trend dài hạn.",
  },
  {
    icon: "⚡",
    title: "Fill Intensity — ETH",
    time: "10:15 hôm nay",
    body: (
      <>
        Order book imbalance đang nghiêng <strong className="text-foreground font-medium">buy-side</strong>. Fill intensity ở mức cao nhất 7 ngày, cho thấy đang có lực mua mạnh từ market orders.
      </>
    ),
    insight:
      "Áp lực mua thật sự (không phải spoofing). Xem xét long với stoploss chặt.",
  },
];

export const tierData = [
  { feature: "Active members", values: ["<50", "50–200", "200–999", "1,000+"], currentIdx: 2 },
  { feature: "Commission rate", values: ["30%", "40%", "50%", "60%"], currentIdx: 2 },
  { feature: "Tin thị trường", values: ["✓", "✓", "✓", "✓"], currentIdx: 2 },
  { feature: "On-chain data", values: ["Basic", "Basic", "Full", "Full"], currentIdx: 2 },
  { feature: "Trading signals", values: ["—", "Basic", "Advanced", "Whale ★"], currentIdx: 2 },
  { feature: "Research reports", values: ["—", "—", "—", "✓"], currentIdx: 2 },
];
