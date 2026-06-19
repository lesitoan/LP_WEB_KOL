import { useFormContext } from 'react-hook-form';
import type { CreateCampaignFormValues } from './schema';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const DAYS_OF_WEEK = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

export default function StepTwo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CreateCampaignFormValues>();
  
  // Theo dõi giá trị đang được chọn trong state của Form
  const selectedDay = watch("announceDayOfWeek");
  const selectedFrequency = watch("announceFrequency");

  const showTimeInput = selectedFrequency === "Thông báo hằng ngày";
  const showDaysOfWeek = selectedFrequency === "Thông báo hằng tuần";

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border border-white/5 bg-[#161616]/30 rounded-2xl p-5 space-y-4">
        <FormSelect 
          label="Phần thưởng"
          bg="bg-[#282828]"
          options={[{ label: "Tiền thưởng", value: "Tiền thưởng" }]}
          {...register("rewardType")}
          error={errors.rewardType?.message}
        />
        
        <div className="border-t border-white/5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((rank) => (
              <div key={rank}>
                <FormInput 
                  label={`Hạng ${rank}`}
                  placeholder="Nhập số tiền"
                  icon={<img src="/images/campaign/Ic_filled_bitcoin-circle-1.png" alt="Coin" className="w-4 h-4 opacity-80 object-contain" />}
                  // Bind data động theo tên trường rank1, rank2, rank3
                  {...register(`rank${rank}` as keyof CreateCampaignFormValues)}
                  error={errors[`rank${rank}` as keyof CreateCampaignFormValues]?.message}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-white/5 bg-[#161616]/30 rounded-2xl p-5 space-y-4">
        <FormSelect 
          label="Thông báo"
          bg="bg-[#282828]"
          options={[
            { label: "Không thông báo", value: "Không thông báo" },
            { label: "Thông báo hằng ngày", value: "Thông báo hằng ngày" },
            { label: "Thông báo hằng tuần", value: "Thông báo hằng tuần" },
            { label: "Chỉ thông báo khi kết thúc", value: "Chỉ thông báo khi kết thúc" },
          ]}
          {...register("announceFrequency")}
          error={errors.announceFrequency?.message}
        />

        {showTimeInput && (
          <div className="border-t border-white/5 pt-4">
            <FormInput
              type="time"
              label="Thời gian thông báo"
              placeholder="09:00"
              icon={<img src="/images/campaign/Ic_filled_alarm-clock.png" alt="Clock" className="w-5 h-5 opacity-80 object-contain" />}
              {...register("announceTime")}
              error={errors.announceTime?.message}
            />
          </div>
        )}

        {showDaysOfWeek && (
          <div className="border-t border-white/5 pt-4">
            <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-7 sm:gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    // Dùng setValue để ghi đè giá trị vào Form
                    onClick={() => setValue("announceDayOfWeek", day, { shouldValidate: true })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 sm:px-1 rounded-lg text-[13px] font-semibold transition-all border ${
                      isSelected 
                        ? "bg-[#FDFCE5] text-[#1C1C1E] border-[#FFD000]" 
                        : "bg-[#131313] text-[#8B8B93] border-white/5 hover:bg-[#282828] hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className="truncate">{day}</span>
                    {isSelected && (
                      <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center shrink-0 shadow-sm animate-scale-in">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.5} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.announceDayOfWeek && <p className="mt-2 text-[12px] text-red-500 font-medium">{errors.announceDayOfWeek.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}