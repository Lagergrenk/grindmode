import * as React from 'react';
import {
  BarChart,
  UtensilsCrossed,
  Target,
  Sliders,
  LayoutDashboard,
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
      path: '/dashboard/workouts',
      label: 'Workouts',
      icon: <Sliders className="h-4 w-4" />,
    },
    {
      path: '/dashboard/nutrition',
      label: 'Nutrition',
      icon: <UtensilsCrossed className="h-4 w-4" />,
    },
    {
      path: '/dashboard/progress',
      label: 'Progress',
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      path: '/dashboard/goals',
      label: 'Goals',
      icon: <Target className="h-4 w-4" />,
    },
  ];
};
