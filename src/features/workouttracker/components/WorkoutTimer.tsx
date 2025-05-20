// Src/features/workouttracker/components/WorkoutTimer.tsx
import { useState, useEffect } from 'react';

interface IWorkoutTimerProps {
  startTime?: Date;
  className?: string;
}

/**
 * Component for displaying elapsed workout time
 */
export const WorkoutTimer = ({
  startTime,
  className = '',
}: IWorkoutTimerProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const calculateElapsed = () => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    };

    // Calculate immediately, then set interval
    calculateElapsed();

    const timer = setInterval(calculateElapsed, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Format the time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-lg font-mono ${className}`}>
      {startTime ? formatTime(elapsedSeconds) : '00:00'}
    </div>
  );
};
