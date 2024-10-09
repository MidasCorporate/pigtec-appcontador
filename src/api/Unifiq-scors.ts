/* eslint-disable camelcase */

import { api } from '@/services/api'

export async function UnifiqScors(scores_ids: string[]) {
  await api.post('/scores/joined', {
    scores_ids,
  })
}
