export const API_V1_PREFIX = '/api/v1'

export function apiV1Path(path: string): string {
  return `${API_V1_PREFIX}${path.startsWith('/') ? path : `/${path}`}`
}
