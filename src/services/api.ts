/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable no-else-return */
import axios, { AxiosError } from 'axios'

const tokenGlobal = localStorage.getItem('@pigtek:token')

let isRefreshing = false
let failedRequestsQueue: {
  onSuccess: (token: string) => void
  onFailure: (err: AxiosError<any>) => void
}[] = []

function signOut() {
  localStorage.removeItem('@pigtek:token')
  localStorage.removeItem('@pigtek:refresh_token')
  localStorage.removeItem('@pigtek:user')
}

export const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: 'https://node.pigtek.com.br',
  // baseURL: 'http://localhost:3001',
  // baseURL: 'https://deploy.cooasgo.samasc.com.br',
  headers: {
    authorization: `Bearer ${tokenGlobal}`,
  },
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: any) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        const token_refresh = localStorage.getItem('@pigtek:refresh_token')
        const originalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true
          api
            .post('/refresh', {
              refresh_token: token_refresh,
            })
            .then((response) => {
              const { token } = response.data

              localStorage.setItem('@pigtek:token', token)
              localStorage.setItem(
                '@pigtek:refresh_token',
                response.data.refresh_token,
              )

              api.defaults.headers.authorization = `Bearer ${token}`
              failedRequestsQueue.forEach((request) => request.onSuccess(token))
              failedRequestsQueue = []
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request) => request.onFailure(err))
              failedRequestsQueue = []
            })
            .finally(() => {
              isRefreshing = false
            })
        }
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers.authorization = `Bearer ${token}`

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            },
          })
        })
      } else if (
        error.response.data?.message === 'Refresh Token does not exists!'
      ) {
        console.log('Refresh token não existe')
        signOut()
      } else if (error.response.data?.code === 'token.malformed') {
        console.log('Token mal formado')
        signOut()
      } else if (error.response.data?.message === 'Token Flopado') {
        console.log('Token flopado')
        signOut()
      } else {
        console.log('erro diferente')
        signOut()
      }
    }
    return Promise.reject(error)
  },
)
