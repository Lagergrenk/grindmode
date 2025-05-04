// User preferences and account management

import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserProfile, AccountActions } from '@/components/settings/';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, deleteUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSignOut = () => {
    if (!logout) return;
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    console.log('Change password clicked');
  };

  const handleChangeEmail = () => {
    // Logic to change email
    console.log('Change email clicked');
  };

  const handleDeleteAccount = async () => {
    if (!deleteUser) return;
    setIsLoading(true);
    try {
      await deleteUser();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>
      {user && (
        <>
          <UserProfile
            displayName={'User'}
            email={user.email || 'No email provided'}
          />
          <AccountActions
            isLoading={isLoading}
            onChangePassword={handleChangePassword}
            onChangeEmail={handleChangeEmail}
            onSignOut={handleSignOut}
            onDeleteAccount={handleDeleteAccount}
          />
        </>
      )}
    </div>
  );
};
