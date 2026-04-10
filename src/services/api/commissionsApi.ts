import { mockCommissions } from '@/lib/mockData'
import type { CommissionTransaction } from '@/types/api'
import { api, extractApiErrorMessage } from './baseApi'

async function requestCommissionTransactions(): Promise<CommissionTransaction[]> {
  return mockCommissions.map((item) => ({
    ...item,
    date: item.date.toISOString(),
  }))
}

export const commissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommissionTransactions: builder.query<CommissionTransaction[], void>({
      queryFn: async () => {
        try {
          return { data: await requestCommissionTransactions() }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: extractApiErrorMessage(error, 'Không thể tải danh sách giao dịch') },
            },
          }
        }
      },
      providesTags: ['Dashboard'],
    }),
  }),
})

export const { useGetCommissionTransactionsQuery } = commissionsApi
