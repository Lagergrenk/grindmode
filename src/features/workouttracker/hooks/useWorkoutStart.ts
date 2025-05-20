import { useAuth } from '@/features/auth';
import { getPlannedWorkouts } from '@/features/workoutplanner';
import { useCallback, useState } from 'react';
import { startWorkout } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useWorkoutStart = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const startWorkoutFromPlan = useCallback(
    async (workoutId: string, plannedWorkoutId: string) => {
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      setLoading(true);
      try {
        const workoutPlans = await getPlannedWorkouts();

        const workoutPlan = workoutPlans.find(
          (plan) => plan.id === plannedWorkoutId,
        );
        if (!workoutPlan) {
          console.error('Workout plan not found');
          return;
        }

        const workoutToStart = workoutPlan.workouts.find(
          (w) => w.id === workoutId,
        );
        if (!workoutToStart) {
          console.error('Workout not found in the plan');
          return;
        }

        const activeWorkout = await startWorkout(workoutToStart, user.uid);

        toast.success(`Started workout: ${activeWorkout.name}`);

        navigate(`/workout/active/${activeWorkout.id}`);
      } catch (error) {
        console.error('Error starting workout:', error);
        toast.error('Failed to start workout');
      } finally {
        setLoading(false);
      }
    },
    [user, navigate],
  );
  return {
    startWorkoutFromPlan,
    loading,
  };
};
