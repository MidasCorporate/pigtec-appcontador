// routes.ts
import { createBrowserRouter, RouteObject } from 'react-router-dom'

import AuthRoute from './components/authRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { NotFound } from './pages/404'
// import { Dashboard } from './pages/app/dashboard/dashboard'
import { Equipment } from './pages/app/equipments/equipment'
import { Orders } from './pages/app/scores/scores'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { Error } from './pages/error'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute element={<Orders />} />,
      },
      {
        path: '/scors',
        element: <ProtectedRoute element={<Orders />} />,
      },
      {
        path: '/equipments',
        element: <ProtectedRoute element={<Equipment />} />,
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
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export const router = createBrowserRouter(routes)
