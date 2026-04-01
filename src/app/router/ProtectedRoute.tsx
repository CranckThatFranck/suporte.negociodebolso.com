import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../../lib/storage/session'

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const token = getToken()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
