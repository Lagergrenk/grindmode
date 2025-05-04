import React from 'react';

interface IStatItemProps {
  label: string;
  value: string | number;
  unit?: string;
  valueSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StatItem: React.FC<IStatItemProps> = ({
  label,
  value,
  unit,
  valueSize = 'lg',
  className = '',
}) => {
  const valueSizeClasses = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`${valueSizeClasses[valueSize]} font-bold`}>
        {value}
        {unit && (
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
};
