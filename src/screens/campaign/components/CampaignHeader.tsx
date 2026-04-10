export default function CampaignHeader() {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-0.5">
          Chiến dịch đang diễn ra
        </h1>
        <div className="text-[13px] text-muted-foreground">
          Theo dõi leaderboard real-time của campaign hiện tại
        </div>
      </div>
      <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-brand text-primary-foreground hover:bg-brand-dim transition-all">
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Tạo campaign mới
      </button>
    </div>
  );
}
