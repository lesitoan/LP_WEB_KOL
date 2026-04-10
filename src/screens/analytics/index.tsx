"use client";

import AnalyticsHeader from "./components/AnalyticsHeader";

export default function AnalyticsPageScreen() {
  return (
    <div className="animate-fade-in">
      <AnalyticsHeader />
      <div className="bg-surface-1 border border-border rounded-[14px] p-6 text-[13.5px] text-muted-foreground">
        <p className="mb-2">
          Sau này, trang này sẽ hiển thị biểu đồ chi tiết hơn về volume, retention, cohort của members...
        </p>
        <p>
          Hiện tại, bạn có thể sử dụng trang Tổng quan và Cộng đồng để theo dõi các chỉ số chính.
        </p>
      </div>
    </div>
  );
}
