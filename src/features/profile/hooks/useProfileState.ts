import { useCallback, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../api';
import { IUserProfile } from '../types';

interface IUseProfileState {
  profile: IUserProfile | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  updateProfile: (profileData: Partial<IUserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/**
 * @returns Profile state and actions
 */
export const useProfileState = (): IUseProfileState => {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      setError(`Failed to fetch profile: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = useCallback(async (data: Partial<IUserProfile>) => {
    setIsSaving(true);
    setError(null);
    try {
      await updateUserProfile(data);
      setProfile((prevProfile) =>
        prevProfile ? { ...prevProfile, ...data } : null,
      );
    } catch (error) {
      setError(`Failed to update profile: ${error}`);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    setError(null);
    try {
      await fetchProfile();
    } catch (error) {
      setError(`Failed to refresh profile: ${error}`);
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    isSaving,
    updateProfile,
    refreshProfile,
  };
};
