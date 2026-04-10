"use client";
import { useState } from "react";
import CashbackHeader from "./components/CashbackHeader";
import { CashbackItem } from "./components/CashbackItem";
import { CashbackSummary } from "./components/CashbackSummary";
import { groups } from "./components/cashback-data";

export default function CashbackScreen() {
  const [rates, setRates] = useState<Record<string, number>>({
    "Group Vàng": 25,
    "Group Bạc": 15,
    "Group Đồng": 10,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="animate-fade-in">
      <CashbackHeader saved={saved} onSave={handleSave} />

      <div className="flex flex-col gap-4">
        {groups.map((g) => (
          <CashbackItem
            key={g.name}
            group={g}
            rate={rates[g.name]}
            onRateChange={(value) =>
              setRates((prev) => ({ ...prev, [g.name]: value }))
            }
          />
        ))}
      </div>

      <CashbackSummary rates={rates} />
    </div>
  );
}
