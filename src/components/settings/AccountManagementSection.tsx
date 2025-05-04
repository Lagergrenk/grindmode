import React from 'react';
import { Mail, LogOut, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeleteAccountDialog } from './DeleteAccountDialog';

interface IAccountManagementSectionProps {
  isLoading: boolean;
  onChangeEmail: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

/**
 * Account management section for email, sign out and account deletion
 */
export const AccountManagementSection: React.FC<
  IAccountManagementSectionProps
> = ({ isLoading, onChangeEmail, onSignOut, onDeleteAccount }) => {
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Email Address</h4>
                <p className="text-sm text-muted-foreground">
                  Change your email address
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onChangeEmail}>
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Sign Out</h4>
                <p className="text-sm text-muted-foreground">
                  Sign out from all devices
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md border-destructive/20">
            <div className="flex items-center gap-3">
              <Trash className="h-5 w-5 text-destructive" />
              <div>
                <h4 className="font-medium text-destructive">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <DeleteAccountDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={onDeleteAccount}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
