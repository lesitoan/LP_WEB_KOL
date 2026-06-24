import type { CampaignLeaderboardItem, CampaignRankingType } from "@/types/api/campaignV2";
import {
  getLeaderboardValue,
  getMemberName,
  getRankingLabel,
} from "./campaignV2Utils";

interface Props {
  entries: CampaignLeaderboardItem[];
  rankingType: CampaignRankingType;
}

function DefaultAvatar() {
  return (
    <img
      src="/images/campaign/avatar.png"
      alt=""
      className="w-[36px] h-[36px] rounded-full object-cover shrink-0"
    />
  );
}

export default function CampaignLeaderboardTable({ entries, rankingType }: Props) {
  return (
    <div className="w-full text-left mt-6 bg-[#171717] rounded-2xl border border-white/5 overflow-hidden py-3">
      <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-4 py-2 text-[11px] md:text-[13px] font-medium text-[#8B8B93]">
        <span>Thứ hạng</span>
        <span>User ID</span>
        <span>{getRankingLabel(rankingType)}</span>
      </div>

      {entries.length === 0 ? (
        <div className="px-4 py-8">
          <div className="min-h-[88px] rounded-xl border border-white/5 bg-black/10 flex items-center justify-center text-[14px] text-[#8B8B93]">
            Chưa có dữ liệu
          </div>
        </div>
      ) : (
        <div className="max-h-[260px] overflow-y-auto custom-scrollbar">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[80px_1fr_200px] items-center gap-2 md:gap-4 px-4 py-3 md:py-3.5 hover:bg-white/5 transition-colors"
            >
              <div className="text-[13px] md:text-[14px] font-semibold text-white">
                {entry.rank}
              </div>
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <DefaultAvatar />
                <div className="min-w-0">
                  <p className="text-[13px] md:text-[14px] font-medium text-white truncate">
                    {getMemberName(entry)}
                  </p>
                  <p className="text-[11px] md:text-[12px] text-[#8B8B93] mt-0.5 truncate">
                    UID: {entry.member.lpexUid}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-start gap-2 shrink-0">
                <span className="text-[13px] md:text-[14px] text-white whitespace-nowrap">
                  {getLeaderboardValue(entry, rankingType)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
