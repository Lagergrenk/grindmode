// Src/features/workouttracker/pages/WorkoutSummaryPage.tsx
import { useParams } from 'react-router-dom';
import { WorkoutSummary } from '../components/WorkoutSummary';

/**
 * Page component for displaying a completed workout summary
 */
export const WorkoutSummaryPage = () => {
  const { workoutId } = useParams<{ workoutId: string }>();

  if (!workoutId) {
    return <div className="container py-8">Missing workout ID</div>;
  }

  return (
    <div className="container py-8">
      <WorkoutSummary workoutId={workoutId} />
    </div>
  );
};
