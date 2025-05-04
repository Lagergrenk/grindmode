import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface INavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface ISidebarNavItemsProps {
  navItems: INavItem[];
  isCollapsed?: boolean;
}

export const SidebarNavItems: React.FC<ISidebarNavItemsProps> = ({
  navItems,
  isCollapsed = false,
}) => {
  return (
    <ul className={cn('space-y-1', isCollapsed ? 'px-2' : 'px-3')}>
      {navItems.map((item) => (
        <li
          key={item.path}
          className="transform transition-all duration-200 ease-in-out"
        >
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm transition-all duration-300 ease-in-out',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground dark:bg-sidebar-accent dark:text-sidebar-accent-foreground'
                  : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground dark:hover:bg-sidebar-accent/30 dark:text-sidebar-foreground dark:hover:text-sidebar-foreground',
                isCollapsed ? 'justify-center' : 'justify-start',
              )
            }
          >
            {/* Wrap the icon in a container that maintains position during transition */}
            <div
              className={cn(
                'flex items-center transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-full justify-center' : 'mr-3',
              )}
            >
              <span className="flex items-center justify-center w-5 h-5">
                {item.icon}
              </span>
            </div>

            {/* Text label with smooth fade and width transition */}
            <span
              className={cn(
                'whitespace-nowrap transition-all duration-300 ease-in-out',
                isCollapsed
                  ? 'w-0 opacity-0 overflow-hidden'
                  : 'w-auto opacity-100',
              )}
            >
              {item.label}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
