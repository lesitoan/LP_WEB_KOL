interface Props {
  onCreateClick: () => void;
}

export default function CampaignHeader({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-0.5 text-foreground">
          Chiến dịch đang diễn ra
        </h1>
        <div className="text-[13px] text-muted-foreground">
          Leaderboard real-time - có lớp chống gian lận (integrity)
        </div>
      </div>
      <button 
        onClick={onCreateClick}
        className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-[#0066FF] text-white hover:bg-[#0055D4] transition-all active:scale-[0.98]"
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Tạo campaign
      </button>
    </div>
  );
}