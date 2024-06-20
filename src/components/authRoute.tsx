// components/AuthRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'

import { isAuthenticated } from '../utils/auth'

interface AuthRouteProps {
  element: JSX.Element
}

const AuthRoute: React.FC<AuthRouteProps> = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/scors" /> : element
}

export default AuthRoute
