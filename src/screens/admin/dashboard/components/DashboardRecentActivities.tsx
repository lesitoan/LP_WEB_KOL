import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardRecentActivitiesSkeleton } from '@/components/skeletons/DashboardRecentActivitiesSkeleton'
import type { AdminRecentActivityItem } from '@/types/admin/dashboard'
import { activitySeverityClassName, adminActivityIconLabel, adminActivitySeverityLabel, adminActivityTypeLabel, toDateTimeVi } from '../mappers'

type DashboardRecentActivitiesProps = {
  isLoading: boolean
  errorMessage: string | null
  activities: AdminRecentActivityItem[]
}

export default function DashboardRecentActivities({ isLoading, errorMessage, activities }: DashboardRecentActivitiesProps) {
  return (
    <Card className="self-start max-h-[calc(100vh-240px)] overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto pr-2 data-table-scroll-viewport">
        {isLoading ? (
          <DashboardRecentActivitiesSkeleton />
        ) : errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có hoạt động gần đây.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((activity, idx) => (
              <li key={`${activity.occurredAt}-${idx}`} className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{adminActivityIconLabel[activity.icon]}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] font-medium ${activitySeverityClassName(activity.severity)}`}>
                      {adminActivitySeverityLabel[activity.severity]}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{toDateTimeVi(activity.occurredAt)}</span>
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">{activity.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.description}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">Nhóm hoạt động: {adminActivityTypeLabel[activity.type]}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
