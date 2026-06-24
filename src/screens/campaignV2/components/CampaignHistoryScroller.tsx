"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Campaign, CampaignCounts, CampaignHistoryFilter } from "@/types/api/campaignV2";
import CampaignCard from "./CampaignCard";
import { FILTER_TABS } from "./campaignV2Utils";

interface Props {
  campaigns: Campaign[];
  counts: CampaignCounts;
  activeFilter: CampaignHistoryFilter;
  selectedCampaignId?: string | null;
  isFetching?: boolean;
  onFilterChange: (filter: CampaignHistoryFilter) => void;
  onSelectCampaign: (campaignId: string) => void;
  onDeleteCampaign?: (campaignId: string) => void;
}

interface ArrowState {
  left: boolean;
  right: boolean;
}

function getArrowState(element: HTMLElement | null): ArrowState {
  if (!element) return { left: false, right: false };
  const { scrollLeft, scrollWidth, clientWidth } = element;
  return {
    left: scrollLeft > 0,
    right: scrollLeft + clientWidth < scrollWidth - 4,
  };
}

function scrollElement(element: HTMLElement | null, direction: "left" | "right", step: number) {
  if (!element) return;
  element.scrollBy({
    left: direction === "left" ? -step : step,
    behavior: "smooth",
  });
}

export default function CampaignHistoryScroller({
  campaigns,
  counts,
  activeFilter,
  selectedCampaignId,
  isFetching,
  onFilterChange,
  onSelectCampaign,
  onDeleteCampaign,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [campaignArrows, setCampaignArrows] = useState<ArrowState>({ left: false, right: false });
  const [filterArrows, setFilterArrows] = useState<ArrowState>({ left: false, right: false });

  const updateArrows = useCallback(() => {
    setCampaignArrows(getArrowState(scrollRef.current));
    setFilterArrows(getArrowState(filterScrollRef.current));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0 });
    const timer = setTimeout(updateArrows, 120);
    return () => clearTimeout(timer);
  }, [campaigns, updateArrows]);

  useEffect(() => {
    const timer = setTimeout(updateArrows, 120);
    window.addEventListener("resize", updateArrows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateArrows);
    };
  }, [counts, campaigns, updateArrows]);

  const handleCampaignScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const firstItem = container.firstElementChild as HTMLElement | null;
    const step = firstItem?.clientWidth || container.clientWidth;
    scrollElement(container, direction, step);
  };

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-[20px] font-semibold text-white mb-4">
        Các chiến dịch đã tạo
      </h3>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="relative w-full lg:flex-1 min-w-0 flex items-center">
          {filterArrows.left && (
            <div className="absolute left-0 top-0 bottom-0 flex items-center z-20 bg-gradient-to-r from-black via-black/80 to-transparent pr-10 pl-1">
              <button
                type="button"
                onClick={() => scrollElement(filterScrollRef.current, "left", 150)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#1A1A1A] border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}

          <div
            ref={filterScrollRef}
            onScroll={updateArrows}
            className="w-full flex items-center gap-2 overflow-x-hidden scroll-smooth whitespace-nowrap py-1"
          >
            {FILTER_TABS.map((tab) => {
              const count = counts[tab.key] ?? 0;
              const isActive = activeFilter === tab.key;
              const isDisabled = count === 0;

              return (
                <button
                  key={tab.key}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onFilterChange(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium transition-all shrink-0 ${
                    isActive
                      ? "bg-[#27272A] text-white"
                      : "text-[#8B8B93] hover:text-white"
                  } ${isDisabled ? "opacity-40 cursor-not-allowed hover:text-[#8B8B93]" : ""}`}
                >
                  {tab.label}
                  <span
                    className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[12px] font-bold ${
                      isActive ? "bg-[#F7F0A1] text-black" : "bg-white/10 text-[#8B8B93]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {filterArrows.right && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center z-20 bg-gradient-to-l from-black via-black/80 to-transparent pl-10 pr-1">
              <button
                type="button"
                onClick={() => scrollElement(filterScrollRef.current, "right", 150)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#1A1A1A] border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            disabled={!campaignArrows.left}
            onClick={() => handleCampaignScroll("left")}
            className={`h-10 w-10 inline-flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all ${
              !campaignArrows.left ? "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={!campaignArrows.right}
            onClick={() => handleCampaignScroll("right")}
            className={`h-10 w-10 inline-flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all ${
              !campaignArrows.right ? "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100" : ""
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="py-10 text-center text-[14px] text-[#8B8B93]">
          {isFetching ? "Đang tải chiến dịch..." : "Không có chiến dịch nào trong mục này."}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className={`relative flex -mx-2 overflow-x-hidden scroll-smooth transition-opacity ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="w-full shrink-0 px-2 lg:w-1/2 xl:w-1/3 2xl:w-1/4 flex flex-col"
            >
              <CampaignCard
                campaign={campaign}
                isActive={campaign.id === selectedCampaignId}
                onViewCampaign={onSelectCampaign}
                onDeleteCampaign={onDeleteCampaign}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
