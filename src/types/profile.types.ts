import { Timestamp } from 'firebase/firestore';

export interface IUserProfile {
  displayName: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: 'male' | 'female';
  goals?: IGoal[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IGoal {
  dailyCalories?: number;
  dailyProtein?: number;
  weeklyWorkouts?: number;
}
