import { IExerciseSearchResultItem } from '../features/workoutplanner/types';
import { IImportMeta } from '../../vite-env';

const EXERCISE_BASE_URL: IImportMeta = import.meta.env.VITE_EXERCISE_BASE_URL;

interface IApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

export const exerciseApi = {
  /**
   * Get exercise data by ID
   */
  getExerciseById: async (
    id: string,
  ): Promise<IApiResponse<IExerciseSearchResultItem>> => {
    try {
      const response = await fetch(`${EXERCISE_BASE_URL}/exercises/${id}`);
      if (!response.ok) {
        throw new Error(`Exercise API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error getting exercise data for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search for exercises by name
   */
  searchExercises: async (
    query: string,
  ): Promise<IApiResponse<IExerciseSearchResultItem[]>> => {
    try {
      const response = await fetch(
        `${EXERCISE_BASE_URL}/exercises/autocomplete?search=${encodeURIComponent(
          query,
        )}`,
      );
      if (!response.ok) {
        throw new Error(`Exercise API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching exercises:', error);
      throw error;
    }
  },
};
