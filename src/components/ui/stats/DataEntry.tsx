import React from 'react';

interface IDataEntryProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  unit?: string;
  className?: string;
}

export const DataEntry: React.FC<IDataEntryProps> = ({
  title,
  subtitle,
  value,
  unit,
  className = '',
}) => {
  return (
    <div
      className={`border rounded-md p-3 flex justify-between items-center ${className}`}
    >
      <div>
        <p className="font-medium">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {value !== undefined && (
        <p className="text-lg font-semibold">
          {value}
          {unit && (
            <span className="text-xs text-muted-foreground ml-1">{unit}</span>
          )}
        </p>
      )}
    </div>
  );
};
