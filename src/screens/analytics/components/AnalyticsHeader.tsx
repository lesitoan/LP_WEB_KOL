import AnalyticsFilters from "./AnalyticsFilters"

export default function AnalyticsHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="mb-0.5 text-2xl font-medium tracking-tight">Phân tích</h1>
        <div className="text-sm font-normal text-muted-foreground">
          Sức khỏe phễu & tăng trưởng theo từng nhóm thành viên
        </div>
      </div>
      <AnalyticsFilters />
    </div>
  )
}
