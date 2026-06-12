import type { CampaignReward, LeaderboardEntry } from "@/types/api/campaign";

interface Props {
  leaderboard: LeaderboardEntry[];
  rewards: CampaignReward[];
}

// Tính phần thưởng từ rank + mảng rewards của campaign
function getPrize(rank: number, rewards: CampaignReward[]): string | undefined {
  const matched = rewards.find((r) => rank >= r.rankFrom && rank <= r.rankTo);
  return matched?.label;
}

// Format volume VNĐ
function formatVND(volumeStr: string | number): string {
  const usd = typeof volumeStr === "string" ? parseFloat(volumeStr || "0") : volumeStr;
  const vnd = usd * 25000;
  
  const viFormatter = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
  });

  if (vnd >= 1_000_000_000) {
    return `${viFormatter.format(vnd / 1_000_000_000)} tỷ VNĐ`;
  }
  if (vnd >= 1_000_000) {
    return `${viFormatter.format(vnd / 1_000_000)} triệu VNĐ`;
  }
  
  return `${Math.round(vnd).toLocaleString("vi-VN")} VNĐ`;
}

const DefaultAvatar = () => (
  <img
    src="/images/campaign/avatar.png"
    alt="Avatar"
    className="w-[42px] h-[42px] rounded-full object-cover shrink-0"
  />
);


const getRankTheme = (rank: number) => {
  switch (rank) {
    case 1: return { main: "#FFD255", dark: "#B45309" }; 
    case 2: return { main: "#FFF6DF", dark: "#4B5563" }; 
    case 3: return { main: "#FF9655", dark: "#7C2D12" }; 
    default: return { main: "#FFD255", dark: "#B45309" };
  }
};

const getBorderGrad = (rank: number) => {
  switch (rank) {
    case 1: return "from-[#FFD255] via-[#FFD255]/30 to-transparent";
    case 2: return "from-[#FFF6DF] via-[#FFF6DF]/30 to-transparent";
    case 3: return "from-[#FF9655] via-[#FF9655]/30 to-transparent"
  }
};

const getHeightClass = (rank: number) => {
  switch (rank) {
    case 1: return "h-[190px] md:h-[210px]";
    case 2: return "h-[165px] md:h-[185px]";
    case 3: return "h-[145px] md:h-[165px]";
    default: return "h-auto";
  }
};

const getBgGrad = (rank: number) => {
  switch (rank) {
    case 1: return "from-[#FFD255]/25 via-[#FFD255]/5 to-transparent to-60%";
    case 2: return "from-[#FFF6DF]/25 via-[#FFF6DF]/5 to-transparent to-60%";
    case 3: return "from-[#FF9655]/25 via-[#FF9655]/5 to-transparent to-50%";
    default: return "from-transparent to-transparent";
  }
};

const getTopHighlight = (rank: number) => {
  switch (rank) {
    case 1: return "from-transparent via-[#FFD255]/90 to-transparent"; 
    case 2: return "from-transparent via-[#FFF6DF]/90 to-transparent";   
    case 3: return "from-transparent via-[#FF9655]/90 to-transparent"; 
    default: return "from-transparent via-white/50 to-transparent";
  }
};

const HexagonBadge = ({ rank }: { rank: number }) => {
  const theme = getRankTheme(rank);
  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100">
        <defs>
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
          <linearGradient id={`textGrad-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={theme.dark} />
          </linearGradient>
        </defs>
        <polygon points="50 5, 89 27.5, 89 72.5, 50 95, 11 72.5, 11 27.5" fill="#1C1C1E" stroke="transparent" strokeWidth="1" />
        <polygon points="50 5, 89 27.5, 89 72.5, 50 95, 11 72.5, 11 27.5" fill="transparent" stroke={`url(#baseGrad-${rank})`} strokeWidth="3.5" strokeLinejoin="round" />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="40px" fill={`url(#textGrad-${rank})`}>
          {rank}
        </text>
      </svg>
    </div>
  );
};

// Podium Card (Top 3)
function PodiumCard({ entry, rewards }: { entry: LeaderboardEntry; rewards: CampaignReward[] }) {
  const prize = getPrize(entry.rank, rewards);
  const borderGrad = getBorderGrad(entry.rank);
  const heightClass = getHeightClass(entry.rank);
  const bgGrad = getBgGrad(entry.rank);
  const highlightGrad = getTopHighlight(entry.rank);

  return (
    <div className={`relative flex-1 min-w-[220px] p-[1.75px] rounded-[18px] bg-gradient-to-b ${borderGrad} transition-all duration-300 ${heightClass}`}>
      <div className={`relative overflow-hidden h-full bg-[#1C1C1E] bg-gradient-to-b ${bgGrad} rounded-[16px] p-5 flex flex-col justify-between`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px] bg-gradient-to-r ${highlightGrad}`}></div>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-[5px] bg-gradient-to-r ${highlightGrad} blur-[4px] opacity-70`}></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DefaultAvatar />
            <div>
              <p className="text-[14px] font-semibold text-white">{entry.telegramUsername}</p>
              <p className="text-[12px] text-[#8B8B93] mt-0.5">UID: {entry.lpexUid}</p>
            </div>
          </div>
          <HexagonBadge rank={entry.rank} />
        </div>

        <div>
          {/* Divider */}
          <div className="h-px w-full bg-white/5 mb-4" />

          {/* Stats */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] text-[#8B8B93] mb-1.5">Tổng tích lũy</p>
              <p className="font-geist-mono font-bold text-[16px] text-white">{formatVND(entry.usdVolume)}</p>
            </div>
            {prize && (
              <div className="flex flex-col items-start text-left">
                <p className="text-[11px] text-[#8B8B93] mb-1.5">Phần thưởng</p>
                <div className="flex items-center font-bold text-[15px] text-white whitespace-nowrap">
                  <img src="/images/campaign/Ic_filled_bitcoin-circle-1.png" alt="USDT" className="w-[18px] h-[18px] mr-1.5 shrink-0" />
                  {prize}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Main Component 
export default function CampaignLeaderboard({ leaderboard, rewards }: Props) {
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];

  // Tách top 3 (podium) và sắp xếp theo thứ tự: Rank 2, Rank 1, Rank 3
  const rawPodium = safeLeaderboard.filter((e) => e.rank <= 3);
  const podium = [...rawPodium].sort((a, b) => {
    const order: Record<number, number> = { 2: 1, 1: 2, 3: 3 };
    return (order[a.rank] || 99) - (order[b.rank] || 99);
  });

  const rest = safeLeaderboard.filter((e) => e.rank > 3);

  if (safeLeaderboard.length === 0) {
    return (
      <div className="text-center text-[#8B8B93] py-10 text-[14px]">
        Chưa có dữ liệu bảng xếp hạng.
      </div>
    );
  }

  return (
    <div>
      {/* Podium Top 3 */}
      <div className="flex gap-3 mb-6 items-end overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {podium.map((entry) => (
          <div key={entry.rank} className="snap-start shrink-0 w-[82%] sm:w-[55%] md:w-auto md:flex-1 md:min-w-[200px]">
            <PodiumCard entry={entry} rewards={rewards} />
          </div>
        ))}
      </div>

      {/* Leaderboard Table Rank 4+ */}
      {rest.length > 0 && (
        <div className="w-full text-left mt-6 bg-[#171717] rounded-2xl border border-white/5 overflow-hidden py-3">

          {/* Header hàng */}
          <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-4 py-2 text-[11px] md:text-[13px] font-medium text-[#8B8B93]">
            <span>Thứ hạng</span>
            <span>User ID</span>
            <span>Tổng tích lũy</span>
          </div>

          {/* Danh sách các hàng */}
          {rest.map((entry) => (
            <div
              key={entry.rank}
              className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-4 py-3 md:py-3.5 hover:bg-white/5 transition-colors cursor-pointer"
            >
              {/* Thứ hạng */}
              <div className="text-[13px] md:text-[14px] font-geist-mono font-semibold text-white">
                {entry.rank}
              </div>

              {/* User ID */}
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <DefaultAvatar />
                <div className="min-w-0">
                  <p className="text-[13px] md:text-[14px] font-medium text-white truncate">{entry.telegramUsername}</p>
                  <p className="text-[11px] md:text-[12px] text-[#8B8B93] mt-0.5 truncate">UID: {entry.lpexUid}</p>
                </div>
              </div>

              {/* Tổng tích lũy */}
              <div className="flex items-center justify-start gap-2 shrink-0">
                <span className="font-geist-mono font-bold text-[13px] md:text-[14px] text-white whitespace-nowrap">
                  {formatVND(entry.usdVolume)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}