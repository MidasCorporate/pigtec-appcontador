import { api } from '@/lib/axios'

interface UpdateProfileBody {
  name: string
  description: string
}

export async function updateProfile({ description, name }: UpdateProfileBody) {
  await api.put('/profile', { name, description })
}
