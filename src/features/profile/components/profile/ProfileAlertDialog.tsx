import { Input, Label } from '@/components/ui';
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface IField {
  label: string;
  name: string;
  type?: string;
}

interface IProfileAlertDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  fields: IField[];
  onSubmit: (data: Record<string, string>) => void;
  cancelLabel?: string;
  actionLabel?: string;
}

import React from 'react';

export const ProfileAlertDialog: React.FC<IProfileAlertDialogProps> = ({
  trigger,
  title,
  description,
  fields,
  onSubmit,
  cancelLabel = 'Cancel',
  actionLabel = 'Update',
}) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = () => {
    onSubmit(formData);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            <Label htmlFor={field.name} className="block mb-2">
              {field.label}
            </Label>
            <Input
              id={field.name}
              type={field.type || 'text'}
              name={field.name}
              className="w-full"
              onChange={handleChange}
              value={formData[field.name] || ''}
            />
          </div>
        ))}

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction type="submit" onClick={handleAction}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
