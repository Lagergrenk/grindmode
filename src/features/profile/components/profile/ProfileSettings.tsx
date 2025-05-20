import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { User, Mail, LogOut, Trash, Lock } from 'lucide-react';
import { ProfileInfoItem } from './ProfileInfoItem';
import { ProfileAlertDialog } from './ProfileAlertDialog';

interface IProfileSettingsProps {
  email: string | null;
  displayName: string | null;
  isLoading: boolean;
  onChangeEmail: (newEmail: string) => void;
  onChangePassword: (newPassword: string) => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

/**
 * UI component for displaying and managing account settings
 */
export const ProfileSettings: React.FC<IProfileSettingsProps> = ({
  email,
  displayName,
  isLoading,
  onChangeEmail,
  onChangePassword,
  onSignOut,
  onDeleteAccount,
}) => {
  const handleDeleteAccount = (confirmDelete: string) => {
    if (confirmDelete === 'DELETE') {
      onDeleteAccount();
    } else {
      alert('Please type "DELETE" to confirm account deletion.');
    }
  };

  const handleChangePassword = (
    newPassword: string,
    confirmPassword: string,
  ) => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onChangePassword(newPassword);
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your personal account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileInfoItem
            icon={<User className="h-5 w-5 text-muted-foreground" />}
            label="Name"
            value={displayName || 'Not set'}
          />

          <ProfileInfoItem
            icon={<Lock className="h-5 w-5 text-muted-foreground" />}
            label="Password"
            value="********"
            action={
              <ProfileAlertDialog
                trigger={
                  <Button variant="outline" size="sm" disabled={true}>
                    Change
                  </Button>
                }
                title="Change Password"
                description="Please enter your new password."
                onSubmit={(formData) =>
                  handleChangePassword(
                    formData.newPassword,
                    formData.confirmPassword,
                  )
                }
                fields={[
                  {
                    name: 'newPassword',
                    label: 'New Password',
                    type: 'password',
                  },
                  {
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    type: 'password',
                  },
                ]}
                actionLabel="Update Password"
              />
            }
          />

          <ProfileInfoItem
            icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            label="Email"
            value={email || 'Not set'}
            action={
              <ProfileAlertDialog
                trigger={
                  <Button variant="outline" size="sm" disabled={true}>
                    Change
                  </Button>
                }
                title="Change Email"
                description="Please enter your new email address."
                fields={[
                  {
                    name: 'newEmail',
                    label: 'New Email',
                    type: 'email',
                  },
                ]}
                actionLabel="Update Email"
                onSubmit={(formData) => onChangeEmail(formData.newEmail)}
                cancelLabel="Cancel"
              />
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account access and data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={onSignOut}
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>

          <ProfileAlertDialog
            trigger={
              <Button
                variant="destructive"
                className="w-full sm:w-auto flex items-center gap-2"
                disabled={isLoading}
              >
                <Trash className="h-4 w-4" />
                Delete account
              </Button>
            }
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
            actionLabel="Delete account"
            cancelLabel="Cancel"
            onSubmit={(formData) => handleDeleteAccount(formData.confirmDelete)}
            fields={[
              {
                name: 'confirmDelete',
                label: 'Type "DELETE" to confirm',
                type: 'text',
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
