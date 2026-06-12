"use client";

import { Copy, Facebook, MessageCircle, Send } from "lucide-react";
import { referralUrl } from "../constants";

const shareChannels = [
  { label: "Facebook", icon: Facebook, className: "bg-[#1877f2] text-white" },
  { label: "Telegram", icon: Send, className: "bg-[#2ca5e0] text-white" },
  { label: "X (Twitter)", textIcon: "X", className: "bg-transparent text-white" },
  { label: "WhatsApp", icon: MessageCircle, className: "bg-transparent text-emerald-400" },
  { label: "Reddit", textIcon: "r/", className: "bg-[#ff4500] text-white" },
];

export default function ReferralShareCard() {
  const shortUrl = `${referralUrl.slice(0, 14)}...${referralUrl.slice(-4)}`;

  const copyReferralUrl = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(referralUrl);
  };

  return (
    <section className="relative flex flex-col overflow-hidden rounded-[14px] bg-surface-2 px-5 py-6 lg:px-4 xl:px-6">
      <div className="absolute left-0 top-5 h-16 w-1 bg-yellow-400" />

      <div className="mb-7 pl-3 lg:mb-6 xl:mb-7">
        <h2 className="text-[22px] font-bold uppercase leading-tight tracking-normal text-white lg:text-[20px] xl:text-[24px]">
          Giới thiệu bạn bè
        </h2>
        <p className="mt-2 text-sm font-medium text-zinc-100 xl:text-base">
          Chia sẻ link để nhận thêm hoa hồng từ mỗi Referral mới
        </p>
      </div>

      <div className="-mx-5 -mb-6 flex-1 rounded-t-[10px] bg-[#282828] px-4 py-5 lg:-mx-4 lg:px-3 xl:-mx-6 xl:px-4">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-500/50 pb-4 text-sm lg:text-xs xl:text-sm">
          <span className="text-zinc-400">Liên kết giới thiệu</span>
          <button
            type="button"
            onClick={copyReferralUrl}
            className="inline-flex min-w-0 items-center gap-2 text-zinc-100 transition-colors hover:text-yellow-200"
          >
            <span className="truncate">{shortUrl}</span>
            <Copy className="h-4 w-4 shrink-0" />
          </button>
        </div>

        <div className="pt-4">
          <p className="mb-5 text-sm text-zinc-400 lg:mb-4 lg:text-xs xl:mb-5 xl:text-sm">
            Chia sẻ lên mạng xã hội
          </p>
          <div className="grid grid-cols-5 gap-4 lg:gap-2 xl:gap-4">
            {shareChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <button
                  key={channel.label}
                  type="button"
                  className="flex min-w-0 flex-col items-center gap-2 rounded-md p-1 transition-colors hover:bg-white/5"
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full text-[28px] font-semibold leading-none lg:h-9 lg:w-9 lg:text-[24px] xl:h-10 xl:w-10 xl:text-[28px] ${channel.className}`}
                  >
                    {Icon ? <Icon className="h-6 w-6 lg:h-5 lg:w-5 xl:h-6 xl:w-6" /> : channel.textIcon}
                  </span>
                  <span className="w-full truncate text-center text-[11px] text-white xl:text-xs">{channel.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
