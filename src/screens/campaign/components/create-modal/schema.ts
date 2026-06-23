import { z } from "zod";

export const createCampaignSchema = z.object({
  // STEP 1
  name: z.string().min(1, "Vui lòng nhập tên chiến dịch"),
  description: z.string().optional(),
  startAt: z.string().min(1, "Vui lòng chọn thời gian bắt đầu"),
  endAt: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
  rankingType: z.string().min(1, "Vui lòng chọn tiêu chí"),
  telegramGroupId: z.string().min(1, "Vui lòng chọn phạm vi áp dụng"),

  // STEP 2
  rewardType: z.string().min(1, "Vui lòng chọn loại phần thưởng"),
  rank1: z.string().min(1, "Vui lòng nhập số tiền hạng 1"),
  rank2: z.string().min(1, "Vui lòng nhập số tiền hạng 2"),
  rank3: z.string().min(1, "Vui lòng nhập số tiền hạng 3"),
  announceFrequency: z.string().min(1, "Vui lòng chọn thông báo"),
  announceDayOfWeek: z.string().optional(),
  announceTime: z.string().optional(),
})
// CUSTOM VALIDATION (Cross-field)
.refine((data) => {
  if (!data.endAt) return true;
  
  const end = new Date(data.endAt);
  end.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return end > today;
}, {
  message: "Ngày kết thúc không được ở trong quá khứ hoặc hôm nay",
  path: ["endAt"],
})
.refine((data) => {
  // Chỉ kiểm tra nếu người dùng đã nhập cả 2 ngày
  if (!data.startAt || !data.endAt) return true; 
  
  const start = new Date(data.startAt);
  const end = new Date(data.endAt);
  return end > start;
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["endAt"],
})
.refine((data) => {
  if (data.announceFrequency === "Thông báo hằng tuần" && !data.announceDayOfWeek) {
    return false;
  }
  return true;
}, {
  message: "Vui lòng chọn ngày thông báo",
  path: ["announceDayOfWeek"]
})
.refine((data) => {
  if (["Thông báo hằng ngày", "Thông báo hằng tuần"].includes(data.announceFrequency) && !data.announceTime) {
    return false;
  }
  return true;
}, {
  message: "Vui lòng chọn thời gian thông báo",
  path: ["announceTime"]
});

export type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;