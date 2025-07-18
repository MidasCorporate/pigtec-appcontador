// routes.ts
import { createBrowserRouter, RouteObject } from 'react-router-dom'

import AuthRoute from './components/authRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { NotFound } from './pages/404'
// import { Dashboard } from './pages/app/dashboard/dashboard'
import { Register } from './pages/app/register/register-page.tsx'
import { RulesPermissions } from './pages/app/rules-permissions/rules-permissions'
import { Scores } from './pages/app/scores/scores'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { Error } from './pages/error'
import { Rules } from './pages/rulesPrivaci.tsx'
import Dashboard from './pages/app/dashboard/dashboard'
import HomeCounter from './pages/app/counter/index.tsx'
import { PoliticLayout } from './pages/_layouts/politic.tsx'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: '/scors',
        element: <ProtectedRoute element={<Scores />} />,
      },
      {
        path: '/registers',
        element: <ProtectedRoute element={<Register />} />,
      },
      {
        path: '/counter',
        element: <ProtectedRoute element={<HomeCounter />} />,
      },
      {
        path: '/permissions-rules',
        element: <ProtectedRoute element={<RulesPermissions />} />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <AuthRoute element={<SignIn />} />,
      },
      {
        path: '/sign-up',
        element: <AuthRoute element={<SignUp />} />,
      }
    ],
  },
  {
    path: '/privacy',
    element: <PoliticLayout />,
    children: [
       {
        path: '/privacy',
        element: <Rules />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export const router = createBrowserRouter(routes)
