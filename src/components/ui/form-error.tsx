import { AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/classMerger';

interface IFormErrorProps {
  message: string;
  className?: string;
}

export const FormError = ({ message, className }: IFormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-destructive text-sm',
        className,
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
