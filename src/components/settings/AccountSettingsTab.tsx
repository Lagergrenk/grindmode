import React from 'react';
import { ProfileSection } from './ProfileSection';
import { AccountManagementSection } from './AccountManagementSection';
import { IAuthUser } from '@/types';

interface IAccountSettingsTabProps {
  user: IAuthUser;
  isLoading: boolean;
  onChangeEmail: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

/**
 * Account settings tab component with profile and account management sections
 */
export const AccountSettingsTab: React.FC<IAccountSettingsTabProps> = ({
  user,
  isLoading,
  onChangeEmail,
  onSignOut,
  onDeleteAccount,
}) => {
  return (
    <div className="space-y-6">
      <ProfileSection user={user} />
      <AccountManagementSection
        isLoading={isLoading}
        onChangeEmail={onChangeEmail}
        onSignOut={onSignOut}
        onDeleteAccount={onDeleteAccount}
      />
    </div>
  );
};
