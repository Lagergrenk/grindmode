import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IAuthUser } from '@/types';
import { Button } from '@components/ui/button';
import { Edit2Icon } from 'lucide-react';

interface IProfileSectionProps {
  user: IAuthUser;
  editDisplayName?: () => void;
}

/**
 * User profile section with avatar and basic information
 */
export const ProfileSection: React.FC<IProfileSectionProps> = ({
  user,
  editDisplayName,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user.photoURL || undefined}
              alt={user.displayName || 'User'}
            />
            <AvatarFallback className="text-2xl">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-medium">
              {user.displayName || 'User'}
              <Button variant="link" onClick={editDisplayName}>
                <Edit2Icon className="inline-block ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </h3>
            <p className="text-sm text-muted-foreground">
              {user.email || 'No email provided'}
            </p>
            <p className="text-sm text-muted-foreground">
              Member since:{' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Unknown'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
