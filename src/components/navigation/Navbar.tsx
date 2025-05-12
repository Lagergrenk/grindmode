import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { User, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
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

export const Navbar: React.FC<INavbarProps> = ({ onLogout }) => {
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-white dark:bg-background border-b border-gray-200 dark:border-border px-4">
      {/* Right side - Auth/User Controls */}
      <div className="ml-auto flex items-center space-x-2">
        {isAuthenticated ? (
          <>
            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-2 rounded-full pl-1 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt="User Avatar" />
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.displayName}</p>
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
