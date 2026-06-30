export default function EmptyCampaign() {
  return (
    <div className="flex min-h-[260px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-[#171717] p-6 text-center">
      <img
        src="/images/campaign/empty_leaderboard_icon.svg"
        alt=""
        className="h-[60px] w-[60px] shrink-0"
      />
      <p className="text-[20px] font-medium text-[#8B8B93]">Chưa có dữ liệu</p>
    </div>
  );
}
