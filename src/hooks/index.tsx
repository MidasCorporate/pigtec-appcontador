/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react'

import { AuthProvider } from './auth'

interface Props {
  children?: ReactNode
}

const AppProvider: React.FC<Props> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
)

export default AppProvider
