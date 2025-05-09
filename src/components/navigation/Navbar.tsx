import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Bell, User, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import {
  Avatar,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

interface INavbarProps {
  isDashboard?: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<INavbarProps> = ({
  isDashboard = false,
  onLogout,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-white dark:bg-background border-b border-gray-200 dark:border-border px-4">
      {/* Middle - Navigation Links (only on non-dashboard) */}
      {!isDashboard && (
        <nav className="hidden md:flex items-center space-x-4 mx-6">
          <div className="container mx-auto flex justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center mr-2">
                <span className="text-sm font-bold text-primary-foreground">
                  GM
                </span>
              </div>
            </Link>
          </div>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-foreground dark:hover:text-foreground"
          >
            About
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-foreground dark:hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>
      )}

      {/* Right side - Auth/User Controls */}
      <div className="ml-auto flex items-center space-x-2">
        {isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-2 rounded-full pl-1 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.photoURL || undefined}
                      alt="User Avatar"
                    />
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.displayName || 'Account'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 bg-gray-800 dark:bg-card rounded-full" />
                    ) : (
                      <Moon className="h-4 w-4 bg-gray-200 dark:bg-card rounded-full" />
                    )}
                    <span>Toggle Theme</span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden md:inline-flex"
            >
              Log in
            </Button>
            <Button size="sm" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
