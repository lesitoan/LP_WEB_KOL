"use client";

import { type FormEvent, type MouseEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import {
  createCampaignSchema,
  defaultCampaignFormValues,
  type CampaignFormValues,
} from "./schema";

interface Props {
  isOpen: boolean;
  mode: "create" | "edit";
  defaultValues?: CampaignFormValues;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: CampaignFormValues) => Promise<void>;
}

export default function CampaignFormModal({
  isOpen,
  mode,
  defaultValues,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const methods = useForm<CampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: defaultValues ?? defaultCampaignFormValues,
    mode: "onChange",
  });


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    methods.reset(defaultValues ?? defaultCampaignFormValues);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [defaultValues, isOpen, methods]);

  if (!mounted || !isOpen) return null;

  const title = mode === "create" ? "Tạo chiến dịch mới" : "Chỉnh sửa chiến dịch";
  const submitLabel = mode === "create" ? "Tạo chiến dịch" : "Lưu thay đổi";

  const handleNext = async (event?: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    const isValid = await methods.trigger([
      "name",
      "description",
      "startAt",
      "endAt",
      "rankingType",
      "telegramGroupId",
    ]);
    if (isValid) setStep(2);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step === 1) {
      void handleNext(event);
      return;
    }

    void methods.handleSubmit(onSubmit)(event);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-[2px]">
      <div className="w-full max-w-[640px] overflow-hidden rounded-[14px] border border-white/10 bg-[#171717] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <img
              src="/images/campaign/Ic_filled_trophy-star.png"
              alt=""
              className="h-4 w-4 object-contain"
            />
            <h2 className="text-[14px] font-semibold text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleFormSubmit}
            className="flex max-h-[calc(100dvh-80px)] flex-col"
          >
            <div className="overflow-y-auto px-5 py-4">
              {step === 1 ? <StepOne mode={mode} /> : <StepTwo />}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
              <p className="text-[12px] text-white/80">
                Bước <span className="font-semibold">{step}/2</span>:{" "}
                {step === 1 ? "Thông tin chiến dịch" : "Phần thưởng & thông báo"}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => (step === 1 ? onClose() : setStep(1))}
                  className="rounded-[8px] bg-white px-4 py-2 text-[12px] font-bold text-black hover:bg-gray-200 disabled:opacity-60"
                >
                  {step === 1 ? "Hủy" : "Quay lại bước 1"}
                </button>
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={(event) => void handleNext(event)}
                    className="rounded-[8px] bg-[#F7F0A1] px-4 py-2 text-[12px] font-bold text-black hover:brightness-105"
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-[8px] bg-[#F7F0A1] px-4 py-2 text-[12px] font-bold text-black hover:brightness-105 disabled:opacity-60"
                  >
                    {isLoading ? "Đang lưu..." : submitLabel}
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>,
    document.body,
  );
}
