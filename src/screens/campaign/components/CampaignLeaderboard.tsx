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
function formatVND(volumeStr: string | number, forceFullFormat: boolean = false): string {
  const usd = typeof volumeStr === "string" ? parseFloat(volumeStr || "0") : volumeStr;
  const vnd = usd * 25000;
  
  if (forceFullFormat) {
    return `${Math.round(vnd).toLocaleString("vi-VN")} VNĐ`;
  }
  
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

const HexagonBadge = ({ rank }: { rank: number }) => {
  return (
    <img
      src={`/images/campaign/Badge_${rank}.png`}
      alt={`Badge ${rank}`}
      className="w-12 h-12 object-contain shrink-0"
    />
  );
};

// Podium Card (Top 3)
function PodiumCard({ entry, rewards }: { entry: LeaderboardEntry; rewards: CampaignReward[] }) {
  const prize = getPrize(entry.rank, rewards);
  const borderGrad = getBorderGrad(entry.rank);
  const heightClass = getHeightClass(entry.rank);

  return (
    <div className={`relative flex-1 min-w-[220px] p-[1.75px] rounded-[18px] bg-gradient-to-b ${borderGrad} transition-all duration-300 ${heightClass}`}>
      <div className="relative overflow-hidden h-full bg-[#1C1C1E] rounded-[16px] p-5 flex flex-col justify-between">
        
        {/* Vệt sáng highlight */}
        <img
          src={`/images/campaign/highlightGrad_${entry.rank}.png`}
          alt=""
          className="absolute top-0 left-0 w-full h-auto pointer-events-none select-none z-0"
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DefaultAvatar />
            <div>
              <p className="text-[14px] font-semibold text-white">{entry.telegramUsername}</p>
              <p className="text-[12px] text-[#8B8B93] mt-0.5">UID: {entry.lpexUid}</p>
            </div>
          </div>
          <HexagonBadge rank={entry.rank} />
        </div>

        <div className="relative z-10">
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
                  {formatVND(entry.usdVolume, true)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}