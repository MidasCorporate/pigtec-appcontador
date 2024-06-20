import { api } from '@/services/api'

interface UpdateScorBody {
  nfe: string
  gta: string
  id: string
}

export async function updateScor({ gta, nfe, id }: UpdateScorBody) {
  console.log('scor chamou atualizar', { gta, nfe, id })
  await api.put(`/scores?id=${id}`, { nfe, gta })
}
