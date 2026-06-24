import type {
  CampaignLeaderboardItem,
  CampaignRankingType,
  CampaignReward,
} from "@/types/api/campaignV2";
import {
  getLeaderboardValue,
  getMemberName,
  getRankingLabel,
  getRewardLabel,
} from "./campaignV2Utils";

interface Props {
  entry: CampaignLeaderboardItem;
  rewards: CampaignReward[];
  rankingType: CampaignRankingType;
}

const rankConfigs: Record<number, { border: string; badge: string; glow: string }> = {
  1: {
    border: "from-[#FFD255] via-[#FFD255]/40 to-[#FFD255]/15",
    badge: "border-[#FFD255] text-[#FFD255]",
    glow: "bg-[#FFD255]/10",
  },
  2: {
    border: "from-[#D7E8F7] via-[#D7E8F7]/35 to-[#D7E8F7]/10",
    badge: "border-[#D7E8F7] text-[#D7E8F7]",
    glow: "bg-[#D7E8F7]/8",
  },
  3: {
    border: "from-[#FF9655] via-[#FF9655]/35 to-[#FF9655]/10",
    badge: "border-[#FF9655] text-[#FF9655]",
    glow: "bg-[#FF9655]/10",
  },
};

const rankMinHeights: Record<number, string> = {
  1: "lg:min-h-[172px] min-h-[132px]",
  2: "lg:min-h-[152px] min-h-[132px]",
  3: "lg:min-h-[132px] min-h-[132px]",
};

function DefaultAvatar() {
  return (
    <img
      src="/images/campaign/avatar.png"
      alt=""
      className="w-[36px] h-[36px] rounded-full object-cover shrink-0"
    />
  );
}

const rankBadges: Record<number, string> = {
  1: "/images/campaign/Badge_1.png",
  2: "/images/campaign/Badge_2.png",
  3: "/images/campaign/Badge_3.png",
};

export default function TopLeaderboardCard({ entry, rewards, rankingType }: Props) {
  const config = rankConfigs[entry.rank] ?? rankConfigs[1];
  const heightClass = rankMinHeights[entry.rank] ?? "min-h-[132px]";

  return (
    <div className={`relative w-full p-[1.5px] rounded-[18px] bg-gradient-to-b ${config.border}`}>
      <div 
        className={`relative overflow-hidden bg-[#1C1C1E] rounded-[16px] p-4 ${heightClass} flex flex-col justify-between`}
        style={{ containerType: "inline-size" }}
      >
        <div className={`absolute inset-x-0 top-0 h-16 ${config.glow} blur-xl pointer-events-none`} />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <DefaultAvatar />
            <div className="min-w-0">
              <p className="text-[14px] md:text-[16px] font-normal text-white truncate">
                {getMemberName(entry)}
              </p>
              <p className="text-[12px] md:text-[14px] font-normal text-[#8B8B93] mt-0.5 truncate">
                UID: {entry.member.lpexUid}
              </p>
            </div>
          </div>
          {rankBadges[entry.rank] ? (
            <img
              src={rankBadges[entry.rank]}
              alt={`Top ${entry.rank}`}
              className="h-[45px] w-auto object-contain shrink-0"
            />
          ) : (
            <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-[16px] font-bold ${config.badge}`}>
              {entry.rank}
            </div>
          )}
        </div>

        <div className="relative z-10">
          <div className="h-px w-full bg-white/5 my-3" />
          <div className="flex justify-between items-end gap-3">
            <div className="min-w-0">
              <p className="text-[11px] md:text-[12px] font-normal text-[#8B8B93] mb-1 truncate">
                {getRankingLabel(rankingType)}
              </p>
              <p 
                className="font-bold text-white whitespace-nowrap [--max-font:15px] md:[--max-font:20px]"
                style={{ fontSize: "clamp(12px, 6.5cqi, var(--max-font))" }}
              >
                {getLeaderboardValue(entry, rankingType)}
              </p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-[11px] md:text-[12px] font-normal text-[#8B8B93] mb-1 truncate">
                Phần thưởng
              </p>
              <p 
                className="font-bold text-white whitespace-nowrap [--max-font:15px] md:[--max-font:20px]"
                style={{ fontSize: "clamp(12px, 6.5cqi, var(--max-font))" }}
              >
                {getRewardLabel(entry.rank, rewards)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
