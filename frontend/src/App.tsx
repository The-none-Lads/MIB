import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AgentProfilePage } from './pages/agent/AgentProfilePage';
import { DirectoryPage } from './pages/directory/DirectoryPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default route redirects to directory */}
        <Route path="/" element={<Navigate to="/directory" replace />} />
        
        {/* Personnel Directory */}
        <Route path="/directory" element={<DirectoryPage />} />
        
        {/* Individual NFC Agent Profile */}
        <Route path="/agent/:slug" element={<AgentProfilePage />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        
        {/* 404 Classified Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;

