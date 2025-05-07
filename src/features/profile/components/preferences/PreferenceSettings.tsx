import React from 'react';

import { PreferenceSection } from './PreferenceSection';
import { PreferenceItem } from './PreferenceItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dumbbell, CalendarClock, Scale } from 'lucide-react';

// Constants for select options
const WORKOUT_DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
const WEIGHT_UNITS = ['kg', 'lb'];
const HEIGHT_UNITS = ['cm', 'ft'];
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

interface IPreferencesSettingsProps {
  dateFormat: string;
  heightUnit: string;
  weightUnit: string;
  workoutDaysPerWeek: number;
  onDateFormatChange: (
    format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD',
  ) => void;
  onHeightUnitChange: (unit: 'cm' | 'ft') => void;
  onWeightUnitChange: (unit: 'kg' | 'lb') => void;
  onWorkoutDaysChange: (days: number) => void;
}

/**
 * UI component for displaying and managing user preferences
 */
export const PreferencesSettings: React.FC<IPreferencesSettingsProps> = ({
  dateFormat,
  heightUnit,
  weightUnit,
  workoutDaysPerWeek = 3,
  onDateFormatChange,
  onHeightUnitChange,
  onWeightUnitChange,
  onWorkoutDaysChange,
}) => {
  return (
    <div className="space-y-6">
      <PreferenceSection
        title="Workout Preferences"
        description="Customize your workout planning settings"
      >
        <PreferenceItem
          icon={<Dumbbell className="h-5 w-5 text-muted-foreground" />}
          label="Workout Days Per Week"
          description="How many days per week you plan to work out"
          inputId="workout-days"
        >
          <Select
            value={workoutDaysPerWeek?.toString() || '3'}
            onValueChange={(value) => onWorkoutDaysChange(parseInt(value))}
          >
            <SelectTrigger className="w-40" id="workout-days">
              <SelectValue placeholder="Days Per Week" />
            </SelectTrigger>
            <SelectContent>
              {WORKOUT_DAYS_OPTIONS.map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days} {days === 1 ? 'day' : 'days'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PreferenceItem>
      </PreferenceSection>

      <PreferenceSection
        title="Units & Formatting"
        description="Customize measurement units and date formats"
      >
        <PreferenceItem
          icon={<CalendarClock className="h-5 w-5 text-muted-foreground" />}
          label="Date Format"
          description="How dates should be displayed"
          inputId="date-format"
        >
          <Select value={dateFormat} onValueChange={onDateFormatChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Format" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FORMATS.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PreferenceItem>

        <PreferenceItem
          icon={<Scale className="h-5 w-5 text-muted-foreground" />}
          label="Height Unit"
          description="Choose your preferred height measurement"
          inputId="height-unit"
        >
          <Select value={heightUnit} onValueChange={onHeightUnitChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Height Unit" />
            </SelectTrigger>
            <SelectContent>
              {HEIGHT_UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit === 'cm' ? 'Centimeters (cm)' : 'Feet (ft)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PreferenceItem>

        <PreferenceItem
          icon={<Scale className="h-5 w-5 text-muted-foreground" />}
          label="Weight Unit"
          description="Choose your preferred weight measurement"
          inputId="weight-unit"
        >
          <Select value={weightUnit} onValueChange={onWeightUnitChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Weight Unit" />
            </SelectTrigger>
            <SelectContent>
              {WEIGHT_UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PreferenceItem>
      </PreferenceSection>
    </div>
  );
};
