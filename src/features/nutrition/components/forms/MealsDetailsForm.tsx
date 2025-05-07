import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormGroup } from '@/features/nutrition';

interface IMealDetailsFormProps {
  name: string;
  time: string;
  onNameChange: (value: string) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MEAL_OPTIONS = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'other', label: 'Other' },
];

export const MealDetailsForm: React.FC<IMealDetailsFormProps> = ({
  name,
  time,
  onNameChange,
  onTimeChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FormGroup>
        <Label htmlFor="meal-name">Meal Type</Label>
        <Select value={name} onValueChange={onNameChange}>
          <SelectTrigger id="meal-name" className="max-w-[180px]">
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            {MEAL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="meal-time">Time</Label>
        <Input
          id="meal-time"
          type="time"
          value={time}
          onChange={onTimeChange}
          className="max-w-[180px]"
        />
      </FormGroup>
    </div>
  );
};
