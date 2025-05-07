import React from 'react';

interface IProfileInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  action?: React.ReactNode;
}

/**
 * Displays a single account information item with optional action button
 */
export const ProfileInfoItem: React.FC<IProfileInfoItemProps> = ({
  icon,
  label,
  value,
  action,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{value}</p>
        </div>
      </div>
      {action}
    </div>
  );
};
