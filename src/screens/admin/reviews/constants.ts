export interface TimelineSlot {
  hour: number
  status: 'idle' | 'loophole' | 'covered'
}

export const hourlyTimelineData: TimelineSlot[] = [
  { hour: 0, status: 'idle' },
  { hour: 1, status: 'idle' },
  { hour: 2, status: 'idle' },
  { hour: 3, status: 'idle' },
  { hour: 4, status: 'loophole' },
  { hour: 5, status: 'loophole' },
  { hour: 6, status: 'idle' },
  { hour: 7, status: 'idle' },
  { hour: 8, status: 'covered' },
  { hour: 9, status: 'covered' },
  { hour: 10, status: 'covered' },
  { hour: 11, status: 'covered' },
  { hour: 12, status: 'covered' },
  { hour: 13, status: 'covered' },
  { hour: 14, status: 'covered' },
  { hour: 15, status: 'covered' },
  { hour: 16, status: 'covered' },
  { hour: 17, status: 'loophole' },
  { hour: 18, status: 'covered' },
  { hour: 19, status: 'covered' },
  { hour: 20, status: 'idle' },
  { hour: 21, status: 'idle' },
  { hour: 22, status: 'idle' },
  { hour: 23, status: 'idle' },
]

export interface AdminPerformanceRow {
  name: string
  avatarColor: string
  reviewedCount: number
  avgResponseTime: number
  editRate: number
  recallRate: number
  activeHours: number
}

export const adminPerformanceData: AdminPerformanceRow[] = [
  { name: 'Admin 01', avatarColor: '#9B692C', reviewedCount: 68, avgResponseTime: 4.2, editRate: 41, recallRate: 1.5, activeHours: 8.5 },
  { name: 'Admin 02', avatarColor: '#9B692C', reviewedCount: 52, avgResponseTime: 11.8, editRate: 22, recallRate: 5.8, activeHours: 7.0 },
  { name: 'Admin 03', avatarColor: '#9B692C', reviewedCount: 22, avgResponseTime: 6.1, editRate: 38, recallRate: 0, activeHours: 3.5 },
  { name: 'Admin 04', avatarColor: '#9B692C', reviewedCount: 52, avgResponseTime: 11.8, editRate: 41, recallRate: 5.8, activeHours: 7.0 },
  { name: 'Admin 05', avatarColor: '#9B692C', reviewedCount: 22, avgResponseTime: 4.2, editRate: 38, recallRate: 1.5, activeHours: 8.5 },
  { name: 'Admin 06', avatarColor: '#9B692C', reviewedCount: 52, avgResponseTime: 11.8, editRate: 41, recallRate: 5.8, activeHours: 8.5 },
  { name: 'Admin 07', avatarColor: '#9B692C', reviewedCount: 22, avgResponseTime: 4.2, editRate: 38, recallRate: 1.5, activeHours: 7.0 },
  { name: 'Admin 08', avatarColor: '#9B692C', reviewedCount: 22, avgResponseTime: 4.2, editRate: 38, recallRate: 1.5, activeHours: 8.5 },
]
