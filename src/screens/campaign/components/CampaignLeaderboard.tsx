import { leaderboard, type LeaderboardRow } from "./campaign-data";

const podium = leaderboard.filter((r) => r.podium);
const rest = leaderboard.filter((r) => !r.podium);

// 1. Component Avatar
const DefaultAvatar = () => (
  <div className="w-[42px] h-[42px] rounded-full bg-[#183B7E] flex items-end justify-center shrink-0 overflow-hidden pt-[7px]">
    <div className="flex flex-col items-center gap-[3px]">
      <div className="w-[14px] h-[14px] rounded-full bg-[#4DA2FF]"></div>
      <div className="w-[26px] h-[14px] rounded-t-full bg-[#4DA2FF]"></div>
    </div>
  </div>
);

// 2. Hexagon Badge
const getRankTheme = (rank: number) => {
  switch (rank) {
    case 1: return { main: "#FDE047", dark: "#D97706" }; // Gold
    case 2: return { main: "#F8FAFC", dark: "#9CA3AF" }; // Silver
    case 3: return { main: "#FDBA74", dark: "#B45309" }; // Bronze
    default: return { main: "#FDE047", dark: "#D97706" };
  }
};

const HexagonBadge = ({ rank }: { rank: number }) => {
  const theme = getRankTheme(rank);
  
  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100">
        <defs>
          {/* 1. Base Gradient */}
          <linearGradient id={`baseGrad-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.main}>
              <animate attributeName="stop-opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="30%" stopColor={theme.main} stopOpacity="0.15" />
            <stop offset="70%" stopColor={theme.main} stopOpacity="0.15" />
            <stop offset="100%" stopColor={theme.main}>
              <animate attributeName="stop-opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* 2. Text Gradient */}
          <linearGradient id={`textGrad-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={theme.dark} />
          </linearGradient>
        </defs>

        {/* 3. Background fill */}
        <polygon
          points="50 5, 89 27.5, 89 72.5, 50 95, 11 72.5, 11 27.5"
          fill="#1C1C1E"
          stroke="transparent"
          strokeWidth="1"
        />

        {/* 4. Rounded border */}
        <polygon
          points="50 5, 89 27.5, 89 72.5, 50 95, 11 72.5, 11 27.5"
          fill="transparent"
          stroke={`url(#baseGrad-${rank})`}
          strokeWidth="3.5"
          strokeLinejoin="round" 
        />

        {/* 5. Rank number */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="40px"
          fill={`url(#textGrad-${rank})`}
        >
          {rank}
        </text>
      </svg>
    </div>
  );
};

function TrendBadge({ trend }: { trend: string }) {
  if (trend.includes("▬")) {
    return (
      <span className="inline-flex items-center justify-center text-[11px] font-bold h-5 px-1.5 rounded bg-white/5 text-[#8B8B93]">
        —
      </span>
    );
  }
  const isUp = trend.includes("▲");
  const num = trend.replace(/[▲▼▬\s]/g, "");
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-bold h-5 px-1.5 rounded ${
        isUp ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-[#EF4444]/15 text-[#EF4444]"
      }`}
    >
      {num} {isUp ? "▲" : "▼"}
    </span>
  );
}

// 3. Podium Card
function PodiumCard({ row }: { row: LeaderboardRow }) {
  const rawUid = row.uid.replace("UID ", "");
  const rawPrize = row.prize?.replace("💰 ", "");

  return (
    <div className="relative flex-1 min-w-[220px] p-[1px] rounded-[17px] bg-gradient-to-br from-white/25 via-transparent to-white/25 hover:from-[#F5C35A]/40 hover:to-[#F5C35A]/40 transition-all duration-300">
      <div className="h-full bg-[#1C1C1E] rounded-2xl p-5 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DefaultAvatar />
            <div>
              <p className="text-[14px] font-semibold text-white">{row.name}</p>
              <p className="text-[12px] text-[#8B8B93] mt-0.5">UID: {rawUid}</p>
            </div>
          </div>
          <HexagonBadge rank={row.rank} />
        </div>

        <div>
          {/* Divider */}
          <div className="h-px w-full bg-white/5 mb-4" />

          {/* Stats */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] text-[#8B8B93] mb-1.5">Tổng tích lũy</p>
              <p className="font-geist-mono font-bold text-[16px] text-white">{row.vol}</p>
            </div>
            {rawPrize && (
              <div className="flex flex-col items-start text-left">
                <p className="text-[11px] text-[#8B8B93] mb-1.5">Phần thưởng</p>
                <div className="flex items-center font-bold text-[15px] text-white whitespace-nowrap">
                  <img src="/images/campaign/usdt.png" alt="USDT" className="w-[18px] h-[18px] mr-1.5 shrink-0" />
                  {rawPrize}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CampaignLeaderboard() {
  return (
    <div>
      {/* Podium Top 3 */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {podium.map((row) => (
          <div key={row.rank} className="snap-start shrink-0 w-[82%] sm:w-[55%] md:w-auto md:flex-1 md:min-w-[200px]">
            <PodiumCard row={row} />
          </div>
        ))}
      </div>

      {/* Leaderboard Table Rank 4+ */}
      <div className="w-full text-left mt-8">
        
        {/* Header hàng */}
        <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-3 md:px-4 py-3 text-[11px] md:text-[13px] font-medium text-[#8B8B93] border-b border-white/10">
          <span>Thứ hạng</span>
          <span>User ID</span>
          <span>Tổng tích lũy</span>
        </div>

        {/* Danh sách các hàng */}
        {rest.map((row) => (
          <div
            key={row.rank}
            className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {/* Cột Thứ hạng */}
            <div className="text-[13px] md:text-[14px] font-geist-mono font-semibold text-white">
              {row.rank}
            </div>

            {/* Cột User ID */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <DefaultAvatar />
              <div className="min-w-0">
                <p className="text-[13px] md:text-[14px] font-medium text-white truncate">{row.name}</p>
                <p className="text-[11px] md:text-[12px] text-[#8B8B93] mt-0.5 truncate">{row.uid}</p>
              </div>
            </div>

            {/* Cột Tổng tích lũy + Trend Badge */}
            <div className="flex items-center justify-start gap-2 shrink-0">
              <span className="font-geist-mono font-bold text-[13px] md:text-[14px] text-white whitespace-nowrap">
                {row.vol}
              </span>
              <TrendBadge trend={row.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}