import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, endOfWeek, format, startOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface IWeekNavHeaderProps {
  onNavigateWeek?: (startDate: Date, endDate: Date) => void;
}

export const WeekNavHeader: React.FC<IWeekNavHeaderProps> = ({
  onNavigateWeek,
}) => {
  const [viewStartDate, setViewStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }), // Start week on Monday
  );

  /**
   * Get the week end date based on start date
   */
  const viewEndDate = endOfWeek(viewStartDate, { weekStartsOn: 1 });

  /**
   * Navigate to the previous week
   */
  const handlePreviousWeek = () => {
    const newStartDate = addDays(viewStartDate, -7);
    setViewStartDate(newStartDate);

    if (onNavigateWeek) {
      const newEndDate = addDays(newStartDate, 6);
      onNavigateWeek(newStartDate, newEndDate);
    }
  };

  /**
   * Navigate to the next week
   */
  const handleNextWeek = () => {
    const newStartDate = addDays(viewStartDate, 7);
    setViewStartDate(newStartDate);

    if (onNavigateWeek) {
      const newEndDate = addDays(newStartDate, 6);
      onNavigateWeek(newStartDate, newEndDate);
    }
  };
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <h2 className="text-lg font-semibold">
        {format(viewStartDate, 'MMM d')} - {format(viewEndDate, 'MMM d, yyyy')}
      </h2>

      <Button variant="outline" size="sm" onClick={handleNextWeek}>
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
