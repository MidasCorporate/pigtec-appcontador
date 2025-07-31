/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

// import { useCookies } from 'react-cookie';
import { api } from '../services/api'

export interface UserInterface {
  id: string
  name: string
  email: string
  config_id?: string
}

interface AuthState {
  token: string
  user: UserInterface
  roles?: [string]
}

interface SignInCredentials {
  email: string
}

interface AuthContextData {
  user: UserInterface
  roles?: [string]
  // eslint-disable-next-line no-unused-vars
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): any
  // eslint-disable-next-line no-unused-vars
  updateUser(user: UserInterface): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const authChannels = new BroadcastChannel('auth')
interface Props {
  children?: ReactNode
}

const AuthProvider: FunctionComponent<Props> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@pigtek:token')
    const user = localStorage.getItem('@pigtek:user')
    const roles = localStorage.getItem('@pigtek:roles')

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`
      return { 
        token, 
        user: JSON.parse(user || '{}'), 
        roles: JSON.parse(roles || '[]') 
      }
    }

    return {} as AuthState
  })

  useEffect(() => {
    // if (data.token !== undefined) {
    //   api
    //   .get(`users/show?id=${data.user.id}`)
    //   .then((response: { data: UserInterface }) => {
    //     setData({ token: data.token, user: response.data })
    //   })
    //     .catch(() => {
    //       console.log('deu erro')
    //       signOut()
    //     })
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = useCallback(async ({ email }: any) => {
    const response = await api.post('sessions', {
      email,
    })
    console.log('response', response.data)
    const { token, refresh_token, user, roles } = response.data
    localStorage.setItem('@pigtek:token', token)

    localStorage.setItem('@pigtek:refresh_token', refresh_token)
    localStorage.setItem('@pigtek:user', JSON.stringify(user))
    localStorage.setItem('@pigtek:roles', JSON.stringify(roles))

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user, roles })
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem('@pigtek:token')
    localStorage.removeItem('@pigtek:refresh_token')
    localStorage.removeItem('@pigtek:user')
    localStorage.removeItem('@pigtek:roles')

    // await authChannels.postMessage('signOut');

    setData({} as AuthState)
  }, [])

  useEffect(() => {
    authChannels.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut()
          break
        default:
          break
      }
    }
  }, [signOut])

  const updateUser = useCallback(
    (user: UserInterface) => {
      localStorage.setItem('@pigtek:user', JSON.stringify(user))
      setData({
        token: data.token,
        user,
        roles: data.roles,
      })
    },
    [setData, data.token, data.roles],
  )
  console.log('AuthProvider', data)
  return (
    <AuthContext.Provider
      value={{ user: data.user, roles: data.roles, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
