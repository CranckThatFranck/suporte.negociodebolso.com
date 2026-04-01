import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

const LoginPage = lazy(() => import('../../pages/login/LoginPage'))
const DashboardPage = lazy(() => import('../../pages/dashboard/DashboardPage'))
const InboxPage = lazy(() => import('../../pages/inbox/InboxPage'))
const TicketPage = lazy(() => import('../../pages/inbox/TicketPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background text-text-secondary">
            Carregando...
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox/:ticketId"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
