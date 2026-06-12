import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCampaignSchema, type CreateCampaignFormValues } from './schema';
import StepOne from './StepOne';
import StepTwo from './StepTwo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  // 1. Khởi tạo Form với Zod Resolver và Default Values
  const methods = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: "",
      description: "",
      startAt: "",
      endAt: "",
      rankingType: "Volume giao dịch",
      scopeType: "Chọn nhóm",
      rewardType: "Tiền thưởng",
      rank1: "",
      rank2: "",
      rank3: "",
      announceFrequency: "Thông báo hằng tuần",
      announceDayOfWeek: "",
    },
    mode: "onChange", 
  });

  useEffect(() => {
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

  if (!isOpen) return null;

  // 2. Xử lý khi bấm nút "Tiếp tục" ở Bước 1
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isStep1Valid = await methods.trigger(["name", "startAt", "endAt", "rankingType", "scopeType"]);
    
    if (isStep1Valid) {
      setStep(2);
    }
  };  

  // 3. Xử lý Submit toàn bộ Form ở Bước 2
  const onSubmit = (data: CreateCampaignFormValues) => {
    console.log("🚀 DỮ LIỆU CHUẨN BỊ GỬI API:", data);
    // API Create Campaign
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pt-20 sm:pt-0 overflow-y-auto">
      <div 
        className="bg-[#1A1A1A] border border-white/5 rounded-2xl w-full max-w-[640px] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up"
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
                    onClick={() => step === 1 ? onClose() : setStep(1)}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold text-black bg-white hover:bg-gray-200 transition-colors active:scale-95 text-center"
                  >
                    {step === 1 ? "Huỷ" : "Quay lại bước 1"}
                  </button>
                  {step === 1 ? (
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#006AF5] hover:bg-[#005CE6] transition-colors active:scale-95 text-center"
                    >
                      Tiếp tục
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#006AF5] hover:bg-[#005CE6] transition-colors active:scale-95 text-center"
                    >
                      Tạo chiến dịch
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}