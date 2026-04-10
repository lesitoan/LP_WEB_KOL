export type ApiStatus = 'success' | 'error'

export interface ApiResponse<TData> {
  status: ApiStatus
  internalMessage: string
  externalMessage: string
  data: TData | null
}