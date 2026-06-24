interface Props {
  hasNoCampaigns: boolean;
}

export default function CampaignHeader({ hasNoCampaigns }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-0.5 text-foreground">
          Chiến dịch đang diễn ra
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Leaderboard real-time - có lớp chống gian lận (integrity)
        </p>
      </div>
      {!hasNoCampaigns && (
        <button
          type="button"
          className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-3.5 py-2 rounded-lg text-[14px] font-semibold bg-brand text-black hover:bg-brand-bright transition-all active:scale-[0.98]"
        >
          + Tạo campaign
        </button>
      )}
    </div>
  );
}
