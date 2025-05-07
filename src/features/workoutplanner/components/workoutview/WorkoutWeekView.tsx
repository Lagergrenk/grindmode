import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface IWorkoutWeekViewProps {
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Grid layout for weekly workout planning
 * @param param0
 * @returns
 */
export const WorkoutWeekView: React.FC<IWorkoutWeekViewProps> = ({
  isLoading = false,
  className,
  children,
}) => {
  return (
    <div className={className}>
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4',
          isLoading && 'opacity-50 pointer-events-none',
        )}
      >
        {isLoading
          ? Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))
          : children}
      </div>
    </div>
  );
};
