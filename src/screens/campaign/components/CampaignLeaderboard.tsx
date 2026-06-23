import { useState, useEffect } from "react";
import type { CampaignReward, LeaderboardEntry, CampaignData, CampaignRankingType } from "@/types/api/campaign";

interface Props {
  leaderboard: LeaderboardEntry[];
  rewards: CampaignReward[];
  campaign?: CampaignData;
}

// Icons
const BarChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const TradeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// Tính phần thưởng từ rank + mảng rewards của campaign
function getPrize(rank: number, rewards: CampaignReward[]): string | undefined {
  const matched = rewards.find((r) => rank >= r.rankFrom && rank <= r.rankTo);
  if (!matched?.label) return undefined;

  const label = matched.label;
  const digitsOnly = label.replace(/\D/g, "");
  if (!digitsOnly) return label;

  const num = parseInt(digitsOnly, 10);
  if (num >= 1_000_000) {
    return formatVNDRaw(num);
  }
  return label;
}

// Format VNĐ
function formatVNDRaw(vnd: number, forceFullFormat: boolean = false): string {
  if (isNaN(vnd) || vnd <= 0) return "—";
  
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

// Format volume VNĐ (quy đổi từ USD sang VNĐ)
function formatVND(volumeStr: string | number | null | undefined, forceFullFormat: boolean = false): string {
  if (volumeStr === null || volumeStr === undefined || volumeStr === "") return "—";
  const usd = typeof volumeStr === "string" ? parseFloat(volumeStr) : volumeStr;
  if (isNaN(usd) || usd <= 0) return "—";
  return formatVNDRaw(usd * 25000, forceFullFormat);
}

// Format giá trị hiển thị theo rankingType của chiến dịch
function formatEntryValue(entry: LeaderboardEntry, rankingType: CampaignRankingType, forceFullFormat: boolean = false): string {
  if (rankingType === 'TOP_TRADE_COUNT') {
    const count = entry.tradeCount;
    if (count === null || count === undefined || isNaN(count) || count <= 0) {
      return "—";
    }
    return `${count.toLocaleString("vi-VN")} lệnh`;
  }
  return formatVND(entry.usdVolume, forceFullFormat);
}

// Lấy label cột theo rankingType
function getColumnLabel(rankingType: CampaignRankingType): string {
  if (rankingType === 'TOP_TRADE_COUNT') return 'Số lệnh trade';
  return 'Tổng tích lũy';
}

const DefaultAvatar = () => (
  <img
    src="/images/campaign/avatar.png"
    alt="Avatar"
    className="w-[36px] h-[36px] min-[576px]:w-[22px] min-[576px]:h-[22px] lg:w-[42px] lg:h-[42px] rounded-full object-cover shrink-0"
  />
);

const getBorderGrad = (rank: number) => {
  switch (rank) {
    case 1: return "from-[#FFD255] via-[#FFD255]/30 to-[#FFD255]/10";
    case 2: return "from-[#FFF6DF] via-[#FFF6DF]/30 to-[#FFF6DF]/10";
    case 3: return "from-[#FF9655] via-[#FF9655]/30 to-[#FF9655]/10";
    default: return "from-white/10 to-white/5";
  }
};

const getHeightClass = (rank: number) => {
  switch (rank) {
    case 1: return "h-[155px] min-[576px]:h-[135px] lg:h-[210px]";
    case 2: return "h-[155px] min-[576px]:h-[125px] lg:h-[185px]";
    case 3: return "h-[155px] min-[576px]:h-[115px] lg:h-[165px]";
    default: return "h-auto";
  }
};

const HexagonBadge = ({ rank }: { rank: number }) => {
  return (
    <img
      src={`/images/campaign/Badge_${rank}.png`}
      alt={`Badge ${rank}`}
      className="w-10 h-10 min-[576px]:w-6 min-[576px]:h-6 lg:w-12 lg:h-12 object-contain shrink-0"
    />
  );
};

// Podium Card (Top 3)
function PodiumCard({ 
  entry, 
  rewards,
  rankingType
}: { 
  entry: LeaderboardEntry; 
  rewards: CampaignReward[]; 
  rankingType: CampaignRankingType;
}) {
  const prize = getPrize(entry.rank, rewards);
  const borderGrad = getBorderGrad(entry.rank);
  const heightClass = getHeightClass(entry.rank);

  return (
    <div className={`relative w-full p-[1.75px] rounded-[18px] bg-gradient-to-b ${borderGrad} transition-all duration-300 ${heightClass}`}>
      <div className="relative overflow-hidden h-full bg-[#1C1C1E] rounded-[16px] p-3 min-[576px]:p-2 sm:p-4 lg:p-5 flex flex-col justify-start">
        
        {/* Vệt sáng highlight */}
        <img
          src={`/images/campaign/highlightGrad_${entry.rank}.png`}
          alt=""
          className="absolute top-0 left-0 w-full h-auto pointer-events-none select-none z-0"
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-2 lg:mb-4">
          <div className="flex items-center gap-1 lg:gap-3 min-w-0">
            <DefaultAvatar />
            <div className="min-w-0">
              <p className="text-[13px] min-[576px]:text-[9px] lg:text-[14px] font-semibold text-white truncate">{entry.telegramUsername}</p>
              <p className="text-[11px] min-[576px]:text-[7px] lg:text-[12px] text-[#8B8B93] mt-0.5 truncate">UID: {entry.lpexUid}</p>
            </div>
          </div>
          <HexagonBadge rank={entry.rank} />
        </div>

        <div className="relative z-10">
          {/* Divider */}
          <div className="h-px w-full bg-white/5 mb-2 lg:mb-4" />

          {/* Stats */}
          <div className="flex justify-between items-end gap-1">
            <div className="min-w-0">
              <p className="text-[10px] min-[576px]:text-[8px] lg:text-[11px] text-[#8B8B93] mb-0.5 lg:mb-1.5 truncate">
                {getColumnLabel(rankingType)}
              </p>
              <p className="font-bold text-[14px] min-[576px]:text-[9px] lg:text-[16px] text-white truncate">
                {formatEntryValue(entry, rankingType)}
              </p>
            </div>
            {prize && (
              <div className="flex flex-col items-start text-left shrink-0">
                <p className="text-[10px] min-[576px]:text-[8px] lg:text-[11px] text-[#8B8B93] mb-0.5 lg:mb-1.5 truncate">Phần thưởng</p>
                <div className="flex items-center font-bold text-[13px] min-[576px]:text-[9px] lg:text-[15px] text-white whitespace-nowrap">
                  <img src="/images/campaign/Ic_filled_bitcoin-circle-1.png" alt="USDT" className="w-[16px] h-[16px] min-[576px]:w-[10px] min-[576px]:h-[10px] lg:w-[18px] lg:h-[18px] mr-0.5 lg:mr-1.5 shrink-0" />
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
export default function CampaignLeaderboard({ leaderboard, rewards, campaign }: Props) {
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
  const safeRewards = Array.isArray(rewards) ? rewards : [];
  
  // Lấy rankingType từ chiến dịch làm giá trị mặc định cho tab
  const campaignRankingType: CampaignRankingType = campaign?.rankingType || 'TOP_VOLUME';
  
  // Tab mặc định = tiêu chí xếp hạng khi tạo chiến dịch, cho phép chuyển đổi
  const [activeTab, setActiveTab] = useState<CampaignRankingType>(campaignRankingType);

  // Khi chuyển sang xem chiến dịch khác → cập nhật lại tab mặc định
  useEffect(() => {
    setActiveTab(campaignRankingType);
  }, [campaignRankingType]);

  const rawPodium = safeLeaderboard.filter((e) => e.rank <= 3);
  const podium = [...rawPodium].sort((a, b) => a.rank - b.rank);

  const rest = safeLeaderboard.filter((e) => e.rank > 3);

  const getPodiumOrderClass = (rank: number) => {
    switch (rank) {
      case 1: return "min-[576px]:order-2";
      case 2: return "min-[576px]:order-1";
      case 3: return "min-[576px]:order-3";
      default: return "";
    }
  };

  return (
    <div>
      {/* Centered Title and Criteria Selector */}
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-[24px] font-semibold text-white mb-4">Bảng xếp hạng</h3>
        <div className="inline-flex p-1 bg-[#121214] border border-white/10 rounded-full">
          <button
            type="button"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[16px] font-medium transition-all ${
              activeTab === 'TOP_VOLUME'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-[#8B8B93] hover:text-white'
            }`}
            onClick={() => setActiveTab('TOP_VOLUME')}
          >
            <BarChartIcon className={`w-[16px] h-[16px] ${activeTab === 'TOP_VOLUME' ? 'text-[#FFD255]' : 'text-[#8B8B93]'}`} />
            Top Volume
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[16px] font-medium transition-all ${
              activeTab === 'TOP_TRADE_COUNT'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-[#8B8B93] hover:text-white'
            }`}
            onClick={() => setActiveTab('TOP_TRADE_COUNT')}
          >
            <TradeIcon className={`w-[16px] h-[16px] ${activeTab === 'TOP_TRADE_COUNT' ? 'text-[#FFD255]' : 'text-[#8B8B93]'}`} />
            Top Số lệnh trade
          </button>
        </div>
      </div>

      {safeLeaderboard.length === 0 ? (
        <div className="text-center text-[#8B8B93] py-10 text-[14px]">
          Chưa có dữ liệu bảng xếp hạng.
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          <div className="grid grid-cols-1 min-[576px]:grid-cols-3 gap-2 mb-6 items-stretch min-[576px]:items-end">
            {podium.map((entry) => (
              <div 
                key={entry.rank} 
                className={`w-full ${getPodiumOrderClass(entry.rank)}`}
              >
                <PodiumCard entry={entry} rewards={safeRewards} rankingType={activeTab} />
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
                <span>{getColumnLabel(activeTab)}</span>
              </div>

              {/* Danh sách các hàng */}
              {rest.map((entry) => (
                <div
                  key={entry.rank}
                  className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-4 py-3 md:py-3.5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {/* Thứ hạng */}
                  <div className="text-[13px] md:text-[14px] font-semibold text-white">
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

                  {/* Giá trị tương ứng */}
                  <div className="flex items-center justify-start gap-2 shrink-0">
                    <span className="text-[13px] md:text-[14px] text-white whitespace-nowrap">
                      {formatEntryValue(entry, activeTab, true)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Divider */}
      <div className="h-px w-full bg-white/10 mt-12 mb-8" />
    </div>
  );
}