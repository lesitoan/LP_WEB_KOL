"use client"

import AnalyticsGrowthChart from "./components/AnalyticsGrowthChart"
import AnalyticsHeader from "./components/AnalyticsHeader"
import AnalyticsMembersTable from "./components/AnalyticsMembersTable"
import AnalyticsOverviewCard from "./components/AnalyticsOverviewCard"
import RevenueForecastChart from "./components/RevenueForecastChart"
import RevenueStatisticsChart from "./components/RevenueStatisticsChart"

export default function AnalyticsPageScreen() {
  return (
    <div className="animate-fade-in">
      <AnalyticsHeader />
      <AnalyticsOverviewCard />
      <div className="mb-5 grid min-w-0 gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        <RevenueStatisticsChart />
        <RevenueForecastChart />
      </div>
      <div className="mb-5">
        <AnalyticsGrowthChart />
      </div>
      <AnalyticsMembersTable />
    </div>
  )
}
