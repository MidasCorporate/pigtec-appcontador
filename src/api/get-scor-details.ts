import { api } from '@/services/api'

export interface GetScorDetailsParams {
  scorId: string
}

export interface GetScorDetailsResponse {
  id: string
  start_date: string
  end_date: string
  weight: string
  quantity: string
  lote: string
  name: string
  type: string
  nfe: string
  gta: string
  female: string
  male: string
  file_url: string
  progress: 'not_found' | 'canceled' | 'finalized' | 'happening'
  created_at: string
  status: boolean
  markings: [
    {
      id: string
      quantity: string
      weight: string
      sequence: string
      gender: string
    },
  ]
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
}

export async function getScorDetails({ scorId }: GetScorDetailsParams) {
  const response = await api.get<GetScorDetailsResponse>(
    `/scores/show?id=${scorId}`,
  )

  return response.data
}
