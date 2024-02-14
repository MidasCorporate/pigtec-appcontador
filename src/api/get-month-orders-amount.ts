import { api } from '@/lib/axios'

export interface GetMonthAmountResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getMonthsAmount() {
  const response = await api.get<GetMonthAmountResponse>(
    'metrics/month-orders-amount',
  )

  return response.data
}
