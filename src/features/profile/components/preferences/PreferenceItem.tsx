import React from 'react';
import { Label } from '@/components/ui/label';

interface IPreferenceItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  inputId: string;
  children: React.ReactNode;
}

/**
 * Reusable preference item component with consistent layout and styling
 */
export const PreferenceItem: React.FC<IPreferenceItemProps> = ({
  icon,
  label,
  description,
  inputId,
  children,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <Label htmlFor={inputId}>{label}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};
