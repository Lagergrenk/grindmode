import { Footer } from '@/components/navigation';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-background dark:to-card">
      <header className="w-full py-6 px-4">
        <div className="container mx-auto flex justify-center">
          <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center mr-2">
            <span className="text-sm font-bold text-primary-foreground">
              GM
            </span>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-foreground">
            Grind Mode
          </span>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};
