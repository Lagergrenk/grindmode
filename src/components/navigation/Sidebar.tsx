import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SidebarNavItems } from './SideBarNavItems';
import { getSidebarNavItems } from './getSidebarNavItems';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';

interface ISidebarProps {
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

export const Sidebar: React.FC<ISidebarProps> = ({
  isCollapsed = false,
  toggleSidebar,
}) => {
  const navItems = getSidebarNavItems();
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-sidebar">
      {/* Sidebar Header */}
      <div
        className={cn(
          'flex h-16 items-center border-b dark:border-sidebar-border',
          isCollapsed ? 'justify-center' : 'px-4',
        )}
      >
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                GM
              </span>
            </div>
            <span className="font-semibold text-lg dark:text-sidebar-foreground">
              GrindMode
            </span>
          </div>
        ) : (
          <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">
              GM
            </span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 no-scrollbar bg-white dark:bg-sidebar">
        <SidebarNavItems navItems={navItems} isCollapsed={isCollapsed} />
      </nav>

      {/* Toggle Button */}
      <div className="flex items-center justify-center border-t dark:border-sidebar-border p-2 bg-white dark:bg-sidebar">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full h-10 rounded-full hover:bg-accent/50 dark:hover:bg-sidebar-accent/50"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 dark:text-sidebar-foreground" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 dark:text-sidebar-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
};
