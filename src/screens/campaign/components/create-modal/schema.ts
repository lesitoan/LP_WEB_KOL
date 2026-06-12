import { z } from "zod";

export const createCampaignSchema = z.object({
  // STEP 1
  name: z.string().min(1, "Vui lòng nhập tên chiến dịch"),
  description: z.string().optional(),
  startAt: z.string().min(1, "Vui lòng chọn thời gian bắt đầu"),
  endAt: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
  rankingType: z.string().min(1, "Vui lòng chọn tiêu chí"),
  scopeType: z.string().min(1, "Vui lòng chọn phạm vi"),

  // STEP 2
  rewardType: z.string().min(1, "Vui lòng chọn loại phần thưởng"),
  rank1: z.string().min(1, "Vui lòng nhập số tiền hạng 1"),
  rank2: z.string().min(1, "Vui lòng nhập số tiền hạng 2"),
  rank3: z.string().min(1, "Vui lòng nhập số tiền hạng 3"),
  announceFrequency: z.string().min(1, "Vui lòng chọn thông báo"),
  announceDayOfWeek: z.string().min(1, "Vui lòng chọn ngày"),
})
// CUSTOM VALIDATION (Cross-field)
.refine((data) => {
  // Chỉ kiểm tra nếu người dùng đã nhập cả 2 ngày
  if (!data.startAt || !data.endAt) return true; 
  
  const start = new Date(data.startAt);
  const end = new Date(data.endAt);
  return end > start;
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["endAt"],
});

export type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;