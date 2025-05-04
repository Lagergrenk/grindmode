import React from 'react';

interface IStatRowProps {
  children: React.ReactNode;
  className?: string;
}

export const StatRow: React.FC<IStatRowProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};
