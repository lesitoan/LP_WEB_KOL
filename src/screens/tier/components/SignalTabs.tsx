import { signalTabs } from "./tier-data";

interface SignalTabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function SignalTabs({ activeTab, onTabChange }: SignalTabsProps) {
  return (
    <div className="flex gap-2 mb-4 border-b border-border">
      {signalTabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onTabChange(i)}
          className={`px-4 py-3 text-[13px] font-medium border-b-2 -mb-px transition-all ${
            i === activeTab
              ? "text-brand border-brand"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
