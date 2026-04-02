import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ProtectedLayout } from './ProtectedLayout';

const LoginPage = lazy(() => import('@/pages/login/LoginPage').then((module) => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const InboxPage = lazy(() => import('@/pages/inbox/InboxPage').then((module) => ({ default: module.InboxPage })));

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/inbox/:ticketId" element={<InboxPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}