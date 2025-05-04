import React from 'react';

interface IAccountActionsProps {
  isLoading: boolean;
  onChangePassword: () => void;
  onChangeEmail: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export const AccountActions: React.FC<IAccountActionsProps> = ({
  isLoading,
  onChangePassword,
  onChangeEmail,
  onSignOut,
  onDeleteAccount,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = (confirm: boolean) => {
    if (confirm) {
      onDeleteAccount();
      setShowDeleteConfirmation(false);
    } else {
      setShowDeleteConfirmation(false);
    }
  };
  return (
    <div className="account-actions">
      <div className="user-actions">
        <button onClick={onChangePassword} className="action-button">
          {isLoading ? 'Loading...' : 'Change Password'}
        </button>
        <button onClick={onChangeEmail} className="action-button">
          {isLoading ? 'Loading...' : 'Change Email'}
        </button>
        <button onClick={onSignOut} className="action-button sign-out">
          Sign Out
        </button>
        <button
          onClick={handleDeleteAccount}
          className="action-button delete-account"
        >
          Delete Account
        </button>
      </div>
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete your account?</p>
          <button
            onClick={() => handleDeleteConfirm(true)}
            className="confirm-delete"
          >
            'Yes, Delete'
          </button>
          <button
            onClick={() => handleDeleteConfirm(false)}
            className="cancel-delete"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
