"use client"

import AnalyticsGrowthChart from "./components/AnalyticsGrowthChart"
import AnalyticsHeader from "./components/AnalyticsHeader"
import AnalyticsMembersTable from "./components/AnalyticsMembersTable"
import AnalyticsOverviewCard from "./components/AnalyticsOverviewCard"
import AnalyticsRevenueChart from "./components/AnalyticsRevenueChart"

export default function AnalyticsPageScreen() {
  return (
    <div className="animate-fade-in">
      <AnalyticsHeader />
      <AnalyticsOverviewCard />
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <AnalyticsRevenueChart title="Thống kê doanh thu 30D" />
        <AnalyticsRevenueChart title="Doanh thu dự kiến 30D tiếp theo" />
      </div>
      <div className="mb-5">
        <AnalyticsGrowthChart />
      </div>
      <AnalyticsMembersTable />
    </div>
  )
}
