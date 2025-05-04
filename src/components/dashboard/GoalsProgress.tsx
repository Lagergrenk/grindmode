import { IGoal } from '@/types';

interface IGoalProgressProps {
  goals: IGoal[];
}

export const GoalsProgress: React.FC<IGoalProgressProps> = ({ goals }) => {
  return (
    <div className="goals-progress">
      <h2 className="progress-title">Goals Progress</h2>
      {goals.map((goal, index) => (
        <div key={index} className="goal-item">
          <h3>Goals</h3>
          <p>Daily calories: {goal.dailyCalories}</p>
          <p>Dail protein: {goal.dailyProtein}</p>
          <p>Weekly workouts: {goal.weeklyWorkouts}</p>
        </div>
      ))}
    </div>
  );
};
