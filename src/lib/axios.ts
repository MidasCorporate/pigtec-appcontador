import axios from 'axios'

import { env } from '@/env'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDc5MzU5MDcsImV4cCI6MTcwODAyMjMwNywic3ViIjoiZmNmMTlhNDQtZmFiZC00ZTU4LTg5MjMtMmYxNmNlYmFiMGU5In0.rGaeqCf9vhNKs_HFVV9I2qXXixUFyoG-qn7M5WAgrTk',
  },
})

if (env.VITE_ENABLED_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 3000)),
    )

    return config
  })
}
