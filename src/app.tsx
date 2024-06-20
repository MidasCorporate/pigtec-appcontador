import './global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from './components/theme/theme-provider'
import AuthContext from './hooks'
import { queyClient } from './lib/react-query'
import { router } from './routes'

export function App() {
  return (
    <HelmetProvider>
      <AuthContext>
        <ThemeProvider storageKey="pigcount-theme">
          <Helmet titleTemplate="%s | pingCount" />
          <Toaster richColors />
          <QueryClientProvider client={queyClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </AuthContext>
    </HelmetProvider>
  )
}
