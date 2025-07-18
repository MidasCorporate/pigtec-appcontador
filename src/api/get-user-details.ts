import { api } from '@/lib/axios'

export interface GetUserDetailsResponse {
  id: string
  name: string
  email: string
  description: string
  createdAt: Date | null
  updateAt: Date | null
}

export async function getUserDetails(id: string) {
  const response = await api.get<GetUserDetailsResponse>(`/users/show?id=${id}`)

  return response.data
}
