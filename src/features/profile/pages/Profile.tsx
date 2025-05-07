import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/features/auth/hooks/useAuth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { User, UserCog } from 'lucide-react';
import { PreferencesSettings } from '../components/preferences/PreferenceSettings';
import { ProfileSettings } from '../components/profile/ProfileSettings';
import { deleteUserProfile } from '../api';
import { useProfileState } from '../hooks/useProfileState';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout, deleteProfile } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>('profile');

  const {
    state: { userPreferences },
    setDateFormat,
    setHeightUnit,
    setWeightUnit,
    setWorkoutDaysPerWeek,
  } = useAppState();

  const { profile, refreshProfile } = useProfileState();

  console.log('Profile:', profile);
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);
  /**
   * Handles user sign out and redirects to login page
   */
  const handleSignOut = () => {
    if (!logout) return;
    logout();
    navigate('/login');
  };

  /**
   * Handles email change request
   */

  const handleChangeEmail = () => {
    console.log('Change email clicked');
  };

  const handlePasswordChange = (e: string) => {
    console.log('Change password clicked', e);
  };

  const handleDeleteAccount = async () => {
    if (!deleteProfile) return;
    setIsLoading(true);
    try {
      await deleteProfile();
      await deleteUserProfile();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <div className="p-6">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <UserCog size={16} />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences">
            <PreferencesSettings
              dateFormat={userPreferences.dateFormat}
              heightUnit={userPreferences.heightUnit}
              weightUnit={userPreferences.weightUnit}
              workoutDaysPerWeek={userPreferences.workoutDaysPerWeek}
              onDateFormatChange={setDateFormat}
              onHeightUnitChange={setHeightUnit}
              onWeightUnitChange={setWeightUnit}
              onWorkoutDaysChange={setWorkoutDaysPerWeek}
            />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileSettings
              email={profile.email}
              displayName={profile.displayName}
              isLoading={isLoading}
              onChangeEmail={handleChangeEmail}
              onChangePassword={(newPassword) =>
                handlePasswordChange(newPassword)
              }
              onSignOut={handleSignOut}
              onDeleteAccount={handleDeleteAccount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
