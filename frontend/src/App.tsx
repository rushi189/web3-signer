import { Routes, Route, Navigate } from 'react-router-dom';
import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import AppShell from '../src/components/layout/AppShell';
import LoginPage from '../src/pages/LoginPage';
import DashboardPage from '../src/pages/DashboardPage';

export default function App() {
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) return <LoginPage />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
