import { IExerciseSearchResult } from '@/types';
import { IImportMeta } from '../../vite-env';

const EXERCISE_BASE_URL: IImportMeta = import.meta.env.VITE_EXERCISE_BASE_URL;

export const exerciseApi = {
  /**
   * Get exercise data by ID
   */
  getExerciseById: async (id: string): Promise<IExerciseSearchResult> => {
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
  searchExercises: async (query: string): Promise<IExerciseSearchResult[]> => {
    try {
      const response = await fetch(
        `${EXERCISE_BASE_URL}/exercises/search?query=${encodeURIComponent(query)}`,
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

  /**
   * Get a list of all exercises
   */
  getAllExercises: async (): Promise<IExerciseSearchResult[]> => {
    try {
      const response = await fetch(`${EXERCISE_BASE_URL}/exercises`);
      if (!response.ok) {
        throw new Error(`Exercise API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting all exercises:', error);
      throw error;
    }
  },
};
