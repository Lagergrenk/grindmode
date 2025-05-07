import * as React from 'react';
import {
  BarChart,
  UtensilsCrossed,
  Target,
  LayoutDashboard,
  DumbbellIcon,
} from 'lucide-react';

export interface INavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export const getSidebarNavItems = (): INavItem[] => {
  return [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      path: '/workoutplanner',
      label: 'Workout Planner',
      icon: <DumbbellIcon className="h-4 w-4" />,
    },
    {
      path: '/nutrition',
      label: 'Nutrition',
      icon: <UtensilsCrossed className="h-4 w-4" />,
    },
    {
      path: '/progress',
      label: 'Progress',
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      path: '/goals',
      label: 'Goals',
      icon: <Target className="h-4 w-4" />,
    },
  ];
};
