import { z } from "zod";
import type {
  CampaignAnnounceFrequency,
  CampaignRankingType,
} from "@/types/api/campaignV2";

export const RANKING_TYPE_OPTIONS: Array<{ label: string; value: CampaignRankingType }> = [
  { label: "Volume giao dịch", value: "TOP_VOLUME" },
  { label: "Số lệnh giao dịch", value: "TOP_TRADE_COUNT" },
  { label: "Tăng trưởng", value: "TOP_GROWTH" },
];

export const ANNOUNCE_FREQUENCY_OPTIONS: Array<{
  label: string;
  value: CampaignAnnounceFrequency;
}> = [
  { label: "Không thông báo", value: "NONE" },
  { label: "Thông báo hằng ngày", value: "DAILY" },
  { label: "Thông báo hằng tuần", value: "WEEKLY" },
  { label: "Chỉ thông báo khi kết thúc", value: "END_ONLY" },
];

export const DAYS_OF_WEEK = [
  { label: "Chủ nhật", value: "0" },
  { label: "Thứ 2", value: "1" },
  { label: "Thứ 3", value: "2" },
  { label: "Thứ 4", value: "3" },
  { label: "Thứ 5", value: "4" },
  { label: "Thứ 6", value: "5" },
  { label: "Thứ 7", value: "6" },
];

export const createCampaignSchema = z
  .object({
    name: z.string().trim().min(1, "Vui lòng nhập tên chiến dịch").max(255),
    description: z.string().optional(),
    startAt: z.string().min(1, "Vui lòng chọn thời gian bắt đầu"),
    endAt: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
    rankingType: z.enum(["TOP_VOLUME", "TOP_TRADE_COUNT", "TOP_GROWTH"]),
    telegramGroupId: z.string().min(1, "Vui lòng chọn phạm vi áp dụng"),
    rewardType: z.string().min(1, "Vui lòng chọn loại phần thưởng"),
    rank1: z.string().trim().min(1, "Vui lòng nhập phần thưởng hạng 1"),
    rank2: z.string().trim().min(1, "Vui lòng nhập phần thưởng hạng 2"),
    rank3: z.string().trim().min(1, "Vui lòng nhập phần thưởng hạng 3"),
    announceFrequency: z.enum(["NONE", "DAILY", "WEEKLY", "END_ONLY"]),
    announceDayOfWeek: z.string().optional(),
    announceTime: z.string().optional(),
  })
  .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endAt"],
  })
  .refine(
    (data) => {
      if (!data.endAt) return true;
      const end = new Date(data.endAt);
      const now = new Date();
      return end.getTime() > now.getTime() - 5 * 60 * 1000;
    },
    {
      message: "Thời gian kết thúc không được ở trong quá khứ",
      path: ["endAt"],
    }
  )
  .refine((data) => data.announceFrequency !== "WEEKLY" || !!data.announceDayOfWeek, {
    message: "Vui lòng chọn ngày thông báo",
    path: ["announceDayOfWeek"],
  })
  .refine(
    (data) =>
      !["DAILY", "WEEKLY"].includes(data.announceFrequency) || !!data.announceTime,
    {
      message: "Vui lòng chọn thời gian thông báo",
      path: ["announceTime"],
    },
  );

export type CampaignFormValues = z.infer<typeof createCampaignSchema>;

export const defaultCampaignFormValues: CampaignFormValues = {
  name: "",
  description: "",
  startAt: "",
  endAt: "",
  rankingType: "TOP_VOLUME",
  telegramGroupId: "ALL_GROUPS",
  rewardType: "Tiền thưởng",
  rank1: "",
  rank2: "",
  rank3: "",
  announceFrequency: "WEEKLY",
  announceDayOfWeek: "1",
  announceTime: "09:00",
};
