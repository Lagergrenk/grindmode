import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IDateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<IDateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const formatDisplayDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousDay}
            aria-label="Previous day"
          >
            <ChevronLeft />
          </Button>

          <div className="flex flex-col items-center">
            <span className="font-medium">
              {formatDisplayDate(selectedDate)}
            </span>
            {isToday(selectedDate) && (
              <span className="text-xs text-primary">Today</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextDay}
            aria-label="Next day"
          >
            <ChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
