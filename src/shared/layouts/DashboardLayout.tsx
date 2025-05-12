import React, { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from '@components/navigation';
import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const DashboardLayout: React.FC = () => {
  const { state, setSidebarOpen } = useAppState();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const sidebarOpen = state.ui.sidebarOpen;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = useCallback(async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-background">
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 ease-in-out bg-white dark:bg-sidebar shadow-lg`}
      >
        <Sidebar isCollapsed={!sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-background">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
