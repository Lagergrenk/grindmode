/**
 * Settings page for managing user account preferences and security
 */
import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, UserCog } from 'lucide-react';
import { AccountSettingsTab } from '@/components/settings/AccountSettingsTab';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, deleteUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>('account');

  /**
   * Handles user sign out and redirects to login page
   */
  const handleSignOut = () => {
    if (!logout) return;
    logout();
    navigate('/login');
  };

  /**
   * Handles password change request
   */
  // const handleChangePassword = () => {
  //   console.log('Change password clicked');
  // };

  /**
   * Handles email change request
   */
  const handleChangeEmail = () => {
    console.log('Change email clicked');
  };

  /**
   * Handles account deletion and redirects to login page
   */
  const handleDeleteAccount = async () => {
    if (!deleteUser) return;
    setIsLoading(true);
    try {
      await deleteUser();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
              disabled
            >
              <UserCog size={16} />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2"
              disabled
            >
              <Shield size={16} />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettingsTab
              user={user}
              isLoading={isLoading}
              onChangeEmail={handleChangeEmail}
              onSignOut={handleSignOut}
              onDeleteAccount={handleDeleteAccount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
