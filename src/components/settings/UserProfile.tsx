import React from 'react';

interface IUserProfileProps {
  displayName: string;
  email: string;
}

export const UserProfile: React.FC<IUserProfileProps> = ({
  displayName,
  email,
}) => {
  return (
    <div className="user-info">
      <p className="user-name">{displayName}</p>
      <p className="user-email">{email}</p>
    </div>
  );
};
