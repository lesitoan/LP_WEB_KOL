import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCampaignSchema, type CreateCampaignFormValues } from './schema';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import { useCreateCampaignMutation } from '@/services/api/campaignApi';
import { toast } from '@/hooks/useToast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();
  const [mounted, setMounted] = useState(false);

  // 1. Khởi tạo Form với Zod Resolver và Default Values
  const methods = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
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
      announceFrequency: "Thông báo hằng tuần",
      announceDayOfWeek: "Thứ 2",
      announceTime: "09:00",
    },
    mode: "onChange", 
  });

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
        setStep(1);
        methods.reset();
      }, 300);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, methods]);

  if (!mounted || !isOpen) return null;

  // 2. Xử lý khi bấm nút "Tiếp tục" ở Bước 1
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isStep1Valid = await methods.trigger(["name", "startAt", "endAt", "rankingType", "telegramGroupId"]);
    
    if (isStep1Valid) {
      setStep(2);
    }
  };  

  // 3. Xử lý Submit toàn bộ Form ở Bước 2
  const onSubmit = async (data: CreateCampaignFormValues) => {
    try {
      // Map label phần thưởng
      const formatLabel = (val?: string) => {
        if (!val) return "";
        const num = parseInt(val.trim(), 10);
        if (!isNaN(num)) {
          return `${num.toLocaleString("vi-VN")} VNĐ`;
        }
        return `${val.trim()} VNĐ`;
      };

      // Map ngày thông báo
      const mapDayOfWeek = (dayStr?: string): number | null => {
        if (!dayStr) return null;
        const map: Record<string, number> = {
          "Chủ nhật": 0, "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3,
          "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6,
        };
        return map[dayStr] ?? null;
      };

      // Map tần suất thông báo
      const frequencyMap: Record<string, string> = {
        "Không thông báo": "NONE",
        "Thông báo hằng ngày": "DAILY",
        "Thông báo hằng tuần": "WEEKLY",
        "Chỉ thông báo khi kết thúc": "END_ONLY",
      };
      const apiFrequency = frequencyMap[data.announceFrequency] || "NONE";
      const needsTime = apiFrequency === "DAILY";
      const needsDay = apiFrequency === "WEEKLY";

      // Parse giờ:phút
      let announceHour: number | null = null;
      let announceMinute: number | null = null;
      if (needsTime && data.announceTime) {
        const [h, m] = data.announceTime.split(":");
        announceHour = parseInt(h, 10);
        announceMinute = parseInt(m, 10);
      } else if (needsDay) {
        // Thông báo hằng tuần: mặc định 0h00
        announceHour = 0;
        announceMinute = 0;
      }

      // Build payload
      const payload = {
        name: data.name,
        description: data.description || null,
        rankingType: data.rankingType,
        scopeType: data.telegramGroupId === "ALL_GROUPS" ? "ALL_GROUPS" : "SINGLE_GROUP",
        telegramGroupId: data.telegramGroupId === "ALL_GROUPS" ? null : data.telegramGroupId,
        startAt: new Date(`${data.startAt}T00:00:00+07:00`).toISOString(),
        endAt: new Date(`${data.endAt}T23:59:59+07:00`).toISOString(),
        rewards: [
          { rankFrom: 1, rankTo: 1, label: formatLabel(data.rank1) },
          { rankFrom: 2, rankTo: 2, label: formatLabel(data.rank2) },
          { rankFrom: 3, rankTo: 3, label: formatLabel(data.rank3) },
        ].filter(r => r.label !== ""),
        announceFrequency: apiFrequency,
        announceHour,
        announceMinute,
        announceDayOfWeek: needsDay ? mapDayOfWeek(data.announceDayOfWeek) : null,
        status: "DRAFT",
      };

      await createCampaign(payload).unwrap();

      toast({
        title: "Tạo chiến dịch thành công",
        description: "Chiến dịch đã được lưu dưới dạng bản nháp. Bạn có thể phát hành bất cứ lúc nào.",
        variant: "success",
      });
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
      toast({
        title: "Tạo chiến dịch thất bại",
        description: message,
        variant: "destructive",
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4 overflow-y-auto">
      <div 
        className="bg-[#1A1A1A] border border-white/5 rounded-2xl w-full max-w-[640px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6">
          <div className="flex items-center justify-between py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/images/campaign/Ic_filled_trophy-star.png" alt="Trophy" className="w-6 h-6 object-contain" />
              <h2 className="text-white text-[16px] font-semibold">Tạo chiến dịch mới</h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-[#8B8B93] hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* FORMPROVIDER */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
              {step === 1 ? <StepOne /> : <StepTwo />}
            </div>

            <div className="px-6 mt-auto">
              <div className="py-5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[13px] text-white text-center sm:text-left">
                  Bước <span className="font-medium">{step}/2</span>: {step === 1 ? "Thông tin chiến dịch" : "Phần thưởng & thông báo"}
                </p>
                <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                  <button 
                    type="button"
                    disabled={isLoading}
                    onClick={() => step === 1 ? onClose() : setStep(1)}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold text-black bg-white hover:bg-gray-200 transition-colors active:scale-95 text-center disabled:opacity-50"
                  >
                    {step === 1 ? "Huỷ" : "Quay lại bước 1"}
                  </button>
                  {step === 1 ? (
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold text-black bg-[#F6F0AA] hover:opacity-90 transition-colors active:scale-95 text-center"
                    >
                      Tiếp tục
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold text-black bg-[#F6F0AA] hover:opacity-90 transition-colors active:scale-95 text-center disabled:opacity-50"
                    >
                      {isLoading ? "Đang tạo..." : "Tạo chiến dịch"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>,
    document.body
  );
}
