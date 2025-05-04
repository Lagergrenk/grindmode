import React from 'react';
import { Calendar } from 'lucide-react';

interface IDashboardHeaderProps {
  userName: string;
}

export const DashboardHeader: React.FC<IDashboardHeaderProps> = ({
  userName,
}) => {
  // Get current date information
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <header className="mb-6 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground">
            Track your fitness journey and reach your goals
          </p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </header>
  );
};
