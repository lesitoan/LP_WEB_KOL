import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-card text-[#F7F0A1]">
          <Settings className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Coming soon</h1>
      </div>
    </section>
  );
}
