import { Navigate, Outlet } from 'react-router-dom';
import { hasSession } from '@/lib/storage/session';

export function ProtectedRoute() {
  return hasSession() ? <Outlet /> : <Navigate to="/login" replace />;
}