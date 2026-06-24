import type {
  CampaignLeaderboardItem,
  CampaignRankingType,
  CampaignReward,
} from "@/types/api/campaignV2";
import TopLeaderboardCard from "./TopLeaderboardCard";

interface Props {
  entries: CampaignLeaderboardItem[];
  rewards: CampaignReward[];
  rankingType: CampaignRankingType;
}

export default function CampaignLeaderboardTop({ entries, rewards, rankingType }: Props) {
  if (entries.length === 0) return null;

  const getOrderClass = (rank: number) => {
    if (rank === 1) return "order-1 lg:order-2";
    if (rank === 2) return "order-2 lg:order-1";
    if (rank === 3) return "order-3 lg:order-3";
    return "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-6 items-stretch lg:items-end">
      {entries.map((entry) => (
        <div key={entry.id} className={`w-full flex ${getOrderClass(entry.rank)}`}>
          <TopLeaderboardCard
            entry={entry}
            rewards={rewards}
            rankingType={rankingType}
          />
        </div>
      ))}
    </div>
  );
}
