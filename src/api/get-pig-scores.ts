import { api } from '@/services/api'

// import { api } from '@/lib/axios'

export interface GetOrdersQuery {
  pageIndex?: number | null
  orderId?: string | null
  customerName?: string | null
  status?: string | null
}

// export interface GetOrdersReponse {
//   orders: {
//     orderId: string
//     createdAt: string
//     status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
//     customerName: string
//     total: number
//   }[]
//   meta: {
//     pageIndex: number
//     perPage: number
//     totalCount: number
//   }
// }
export interface GetScores {
  scores: {
    id: string
    start_date: string
    weight: string
    quantity: string
    lote: string
    name: string
    type: string
    progress: 'not_found' | 'canceled' | 'finalized' | 'happening'
    created_at: string
    status: boolean
    farmSender: {
      id: string
      name: string
    }
    farmReceived: {
      id: string
      name: string
    }
    farmInternal: {
      id: string
      name: string
    }
  }[]
  pagination: {
    page: number
    take: number
    total: number
    totalPages: number
  }
}
export async function getOrders({
  pageIndex,
  customerName,
  orderId,
  status,
}: GetOrdersQuery) {
  console.log('temp', pageIndex, customerName, orderId, status)
  const response = await api.get<GetScores>(
    `/scores/filter?take=6&page=${pageIndex}`,
  )

  return response.data
}
