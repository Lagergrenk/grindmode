import React from 'react';
import { Label, Input } from '@components/ui';

interface IFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name?: string;
  type?: string;
  autocomplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FormInput = ({
  label,
  id,
  name,
  type,
  autoComplete,
  value,
  onChange,
  className,
}: IFormInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
      </div>
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={`w-full ${className ?? ''}`}
      />
    </div>
  );
};
