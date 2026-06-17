import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CreateCampaignFormValues } from './schema';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { useGetGroupsQuery } from '@/services/api/groupsApi';

export default function StepOne() {
  const { register, formState: { errors } } = useFormContext<CreateCampaignFormValues>();

  // Lấy danh sách nhóm của KOL
  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery({ page: 1, limit: 100 });
  const groupsList = groupsData?.items || [];

  const groupOptions = [
    { label: "Toàn bộ nhóm", value: "ALL_GROUPS" },
    { label: "─── Chọn nhóm cụ thể ───", value: "divider", disabled: true },
    ...groupsList.map((g) => ({
      label: g.title,
      value: g.id,
    })),
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <FormInput 
        label="Tên chiến dịch"
        placeholder="Nhập tên nhóm"
        {...register("name")}
        error={errors.name?.message}
      />
      
      <FormInput 
        label="Mô tả chiến dịch"
        placeholder="Nhập mô tả cho chiến dịch"
        isTextarea
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          type="date" 
          label="Thời gian bắt đầu"
          placeholder="05/05/2026"
          icon={<img src="/images/campaign/Ic_calendar-check-alt.png" alt="Calendar" className="w-5 h-5 opacity-80" />}
          {...register("startAt")}
          error={errors.startAt?.message}
        />
        <FormInput 
          type="date"
          label="Thời gian kết thúc"
          placeholder="06/06/2026"
          icon={<img src="/images/campaign/Ic_calendar-check-alt.png" alt="Calendar" className="w-5 h-5 opacity-80" />}
          {...register("endAt")}
          error={errors.endAt?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect 
          label="Tiêu chí xếp hạng"
          options={[{ label: "Volume giao dịch", value: "TOP_VOLUME" }, {label: "Số lệnh giao dịch", value: "TOP_TRADE_COUNT" }, { label: "PNL tăng trưởng", value: "TOP_GROWTH" }]}
          {...register("rankingType")}
          error={errors.rankingType?.message}
        />
        <FormSelect 
          label="Phạm vi áp dụng"
          options={groupOptions}
          {...register("telegramGroupId")}
          error={errors.telegramGroupId?.message}
          disabled={isGroupsLoading}
        />
      </div>
    </div>
  );
}