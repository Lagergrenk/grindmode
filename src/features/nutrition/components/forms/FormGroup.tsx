import React from 'react';
import { cn } from '@/shared/utils/classMerger';
import { AlertCircle } from 'lucide-react';

interface IFormGroupProps {
  children: React.ReactNode;
  errorMessage?: string;
  className?: string;
}

export const FormGroup: React.FC<IFormGroupProps> = ({
  children,
  errorMessage,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
      {errorMessage && (
        <div className="flex items-center gap-1 text-destructive text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
