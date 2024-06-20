// components/ProtectedRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'

import { isAuthenticated } from '../utils/auth'

interface ProtectedRouteProps {
  element: JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/sign-in" />
}

export default ProtectedRoute
